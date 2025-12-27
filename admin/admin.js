document.getElementById('loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const res = await fetch('/admin/login', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      username: form.username.value,
      password: form.password.value
    })
  });
  if(res.ok) location.href = 'dashboard.html';
  else document.getElementById('error').innerText = 'Invalid login';
});
