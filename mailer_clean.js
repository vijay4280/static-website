const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = null;
let isEthereal = false;

// -------------------------------
// Initialize Transporter
// -------------------------------
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  (async () => {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      isEthereal = true;
      console.log('📧 Mailer: using Ethereal test account for development');
      console.log(`   Ethereal user=${testAccount.user}`);
    } catch (err) {
      console.warn('Mailer: failed to create Ethereal test account:', err && err.message);
    }
  })();
}

// -------------------------------
// Utility: wait until transporter is ready
// -------------------------------
async function waitForTransporter(timeout = 15000) {
  const start = Date.now();
  while (!transporter) {
    if (Date.now() - start > timeout)
      throw new Error('Timed out waiting for mail transporter to initialize');
    await new Promise((r) => setTimeout(r, 100));
  }
}

async function verify() {
  try {
    await waitForTransporter(5000);
    await transporter.verify();
    console.log('📨 Mailer: transporter verified');
  } catch (err) {
    console.warn('Mailer: transporter verification failed:', err && err.message);
  }
}

// -------------------------------
// Admin Notification Email
// -------------------------------
async function sendAdminNotification({ name, email, phone, message }) {
  const admin = process.env.ADMIN_EMAIL;
  if (!admin) {
    console.warn('Mailer: ADMIN_EMAIL is not configured — skipping admin notification');
    return null;
  }

  try {
    await waitForTransporter();

    const mailOptions = {
      from: process.env.FROM_EMAIL || '"Website Contact" <no-reply@localhost>',
      to: admin,
      subject: `[Website Contact] New Message from ${name}`,
      text: `
New contact message received:
----------------------------------
Name: ${name}
Email: ${email}
Phone: ${phone || '(not provided)'}
----------------------------------
Message:
${message}
      `,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone || '(not provided)'}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    if (isEthereal)
      console.log('Ethereal preview (admin):', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (err) {
    console.error('Mailer: failed to send admin notification:', err && err.message);
    return null;
  }
}

// -------------------------------
// User Confirmation Email
// -------------------------------
async function sendUserConfirmation({ name, email, phone, message }) {
  if (!email) {
    console.warn('Mailer: recipient email missing for user confirmation');
    return null;
  }

  try {
    await waitForTransporter();

    const mailOptions = {
      from: process.env.FROM_EMAIL || '"Website Contact" <no-reply@localhost>',
      to: email,
      subject: `Thank you for contacting us!`,
      text: `Hi ${name || 'there'},

Thanks for reaching out! We have received your message and will get back to you soon.

Here’s what we got:
----------------------------------
Your Phone: ${phone || '(not provided)'}
Message: ${message}

Best regards,
The Support Team
      `,
      html: `
        <p>Hi ${name || 'there'},</p>
        <p>Thanks for reaching out! We have received your message and will get back to you soon.</p>
        <p><strong>Your Phone:</strong> ${phone || '(not provided)'}</p>
        <blockquote>${message.replace(/\n/g, '<br>')}</blockquote>
        <p>Best regards,<br><strong>The Support Team</strong></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    if (isEthereal)
      console.log('Ethereal preview (user):', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (err) {
    console.error('Mailer: failed to send user confirmation:', err && err.message);
    return null;
  }
}

// -------------------------------
module.exports = { sendAdminNotification, sendUserConfirmation, verify };
