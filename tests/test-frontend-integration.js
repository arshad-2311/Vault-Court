import assert from 'assert';

async function verifyFrontend() {
  const res = await fetch('http://localhost:8080/index.html');
  const html = await res.text();

  assert(html.includes('id="cust-email"'), 'Missing #cust-email in index.html');
  assert(html.includes('id="pass-email-val"'), 'Missing #pass-email-val in index.html');
  assert(/vault-bundle\.js\?v=\d+/.test(html), 'Missing vault-bundle.js in index.html');
  assert(!html.includes('checkout.razorpay.com'), 'Razorpay checkout script must be absent from index.html');
  assert(html.includes('PAY DIRECTLY AT FRONT COUNTER'), 'Missing counter payment notice in index.html');
  console.log('✓ index.html has required counter payment and email elements (zero Razorpay scripts).');

  const bundleRes = await fetch('http://localhost:8080/js/vault-bundle.js?v=8');
  const bundleJs = await bundleRes.text();

  assert(bundleJs.includes('cust-email'), 'vault-bundle.js missing cust-email');
  assert(bundleJs.includes('customerEmail'), 'vault-bundle.js missing customerEmail');
  assert(bundleJs.includes('pass-email-val'), 'vault-bundle.js missing pass-email-val');
  assert(!bundleJs.toLowerCase().includes('razorpay'), 'vault-bundle.js must not contain any Razorpay references');
  console.log('✓ vault-bundle.js is completely clean of Razorpay and serves counter booking logic.');

  const healthRes = await fetch('http://localhost:5000/api/health');
  const health = await healthRes.json();
  assert(health.status === 'ONLINE', 'Backend health check failed');
  console.log('✓ Backend API is healthy (status: ONLINE) and reachable at port 5000.');

  console.log('\nALL VERIFICATIONS PASSED SUCCESSFULLY!');
}

verifyFrontend().catch(err => {
  console.error(err);
  process.exit(1);
});
