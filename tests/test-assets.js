import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

async function testAllAssets() {
  const urls = new Set();
  const linkMatches = [...html.matchAll(/href=["']([^"']+)["']/g)];
  for (const m of linkMatches) {
    const val = m[1];
    if (!val.startsWith('http') && !val.startsWith('#') && !val.startsWith('tel:') && !val.startsWith('mailto:')) {
      urls.add(val);
    }
  }

  const srcMatches = [...html.matchAll(/src=["']([^"']+)["']/g)];
  for (const m of srcMatches) {
    const val = m[1];
    if (!val.startsWith('http')) {
      urls.add(val);
    }
  }

  console.log(`Checking ${urls.size} local assets against http://localhost:8080...`);
  let failed = 0;
  for (const u of urls) {
    try {
      const res = await fetch('http://localhost:8080/' + u);
      if (res.status !== 200) {
        console.error(`✗ FAIL (${res.status}): ${u}`);
        failed++;
      } else {
        console.log(`✓ OK (200): ${u}`);
      }
    } catch (e) {
      console.error(`✗ ERROR: ${u} - ${e.message}`);
      failed++;
    }
  }

  if (failed === 0) {
    console.log(`\nALL ${urls.size} ASSETS RETURNED HTTP 200 OK!`);
  } else {
    console.error(`\n${failed} ASSETS FAILED!`);
    process.exit(1);
  }
}

testAllAssets();
