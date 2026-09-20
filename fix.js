const fs = require('fs');
const files = ['frontend/src/routes/admin.tsx', 'frontend/src/routes/bookings.tsx', 'frontend/src/routes/register.tsx', 'frontend/src/routes/signin.tsx'];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/"http:\/\/localhost:5000\/api\//g, '(import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/');
  content = content.replace(/\http:\/\/localhost:5000\/api\//g, '\\${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/');
  fs.writeFileSync(f, content, 'utf8');
});
