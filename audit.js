const API_URL = 'https://velocityrental.onrender.com/api';
async function runAudit() {
  console.log('\n?? Starting Full Project Audit... \n');
  
  // 1. Check Vehicles
  try {
    const res = await fetch(API_URL + '/vehicles');
    if(res.ok) console.log('? [Public API] Vehicles endpoint working!');
    else console.log('? [Public API] Vehicles failed with status', res.status);
  } catch(e) { console.log('? [Public API] Vehicles error', e.message); }

  // 2. Check Login
  let token = null;
  try {
    const res = await fetch(API_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@rental.test', password: 'demo1234' })
    });
    if(res.ok) {
      const data = await res.json();
      token = data.token;
      console.log('? [Auth API] Admin login successful!');
    } else console.log('? [Auth API] Admin login failed', res.status);
  } catch(e) { console.log('? [Auth API] Login error', e.message); }

  // 3. Check Admin Stats (Requires Auth)
  if (token) {
    try {
      const res = await fetch(API_URL + '/admin/stats', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if(res.ok) console.log('? [Admin API] Secure stats endpoint working!');
      else console.log('? [Admin API] Stats failed', res.status);
    } catch(e) { console.log('? [Admin API] Stats error', e.message); }
  }

  console.log('\n?? Audit Completed!');
}
runAudit();
