// Unified server using project's mailer and MongoDB
require('dotenv').config();
const express = require('express');
const path = require('path');
const Product = require('./js/models/Product');
const Category = require('./js/models/Category');
const cors = require('cors');
const fs = require('fs');
const session = require('express-session');
const multer = require('multer');

const connectDB = require('./connection');
const Contact = require('./js/models/Contact');  
const { sendAdminNotification, sendUserConfirmation, verify } = require('./mailer_clean');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (so contact.html and other assets are accessible)
app.use(express.static(path.join(__dirname)));

// Uploads directory and multer setup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadsDir); },
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_')); }
});
const upload = multer({ storage });

// -------------------------------
// 📩 Contact Form Endpoint
// -------------------------------
app.post('/contact', async (req, res) => {
  try {
    console.log('Received contact POST:', req.body);
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.',
      });
    }

    // Save contact to MongoDB
    const contact = new Contact({ name, email, phone, message });
    await contact.save();
    console.log('✅ Contact saved to database:', contact);

    // Send admin email
    sendAdminNotification({ name, email, phone, message })
      .then((info) => console.log('📨 Admin notification sent:', info && info.messageId))
      .catch((err) => console.error('❌ Failed to send admin notification:', err && err.message));

    // Send confirmation email to user
    sendUserConfirmation({ name, email, phone, message })
      .then((info) => console.log('📬 User confirmation sent:', info && info.messageId))
      .catch((err) => console.error('❌ Failed to send user confirmation:', err && err.message));

    return res.json({
      success: true,
      message: 'Form submitted successfully',
    });
  } catch (err) {
    console.error('🔥 Error in /contact:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while saving contact.',
    });
  }
});


// -------------------------------
// 🔐 Admin Session Setup
// -------------------------------
app.use(session({
  secret: process.env.ADMIN_SECRET || 'vidhi_admin_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true only if HTTPS
}));

// Simple admin auth middleware
function isAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  return res.redirect('/admin/login.html');
}


// -------------------------------
// 🔐 Admin Login
// -------------------------------
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password });

  // Change credentials later (env / DB)
  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    req.session.admin = true;
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Logout
app.get('/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login.html');
  });
});

// Serve /admin — show dashboard when logged in, otherwise redirect to login
app.get('/admin', (req, res) => {
  if (req.session && req.session.admin) {
    return res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
  }
  return res.redirect('/admin/login.html');
});

// -------------------------------
// 📩 ADMIN CONTACTS
// -------------------------------

// Get all contacts
app.get('/admin/contacts', isAdmin, async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});

// Mark as read
app.put('/admin/contacts/:id/read', isAdmin, async (req, res) => {
  await Contact.findByIdAndUpdate(req.params.id, { status: 'read' });
  res.json({ success: true });
});

// Delete contact
app.delete('/admin/contacts/:id', isAdmin, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});



// -------------------------------
// 📦 ADMIN PRODUCTS CRUD
// -------------------------------

// get products by category
app.get('/api/products/:category', async (req, res) => {
  const products = await Product.find({
    category: req.params.category,
    active: true
  }).sort({ order: 1 });
  res.json(products);
});

// ADMIN CRUD
app.post('/admin/products', isAdmin, upload.single('image'), async (req, res) => {
  const product = new Product({
    ...req.body,
    image: req.file ? '/uploads/' + req.file.filename : ''
  });
  await product.save();
  res.json({ success: true });
});

// Return all products for admin listing
app.get('/admin/products', isAdmin, async (req, res) => {
  const products = await Product.find().sort({ order: 1 });
  res.json(products);
});


app.delete('/admin/products/:id', isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});


// PUBLIC
app.get('/api/categories', async (req, res) => {
  const categories = await Category.find({ active: true }).sort({ order: 1 });
  res.json(categories);
});

// ADMIN
app.post('/admin/categories', isAdmin, upload.single('banner'), async (req, res) => {
  const cat = new Category({
    name: req.body.name,
    slug: req.body.slug,
    order: req.body.order,
    banner: req.file ? '/uploads/' + req.file.filename : ''
  });
  await cat.save();
  res.json({ success: true });
});

app.delete('/admin/categories/:id', isAdmin, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});


// -------------------------------
// Start the Server
// -------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Verify mailer transporter at startup (non-blocking)
verify().catch(() => {});
