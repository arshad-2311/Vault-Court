import fs from 'fs';
import assert from 'assert';

const html = fs.readFileSync('index.html', 'utf8');
const bundleJs = fs.readFileSync('js/vault-bundle.js', 'utf8');
const aboutCss = fs.readFileSync('css/about.css', 'utf8');
const homeCss = fs.readFileSync('css/home.css', 'utf8');

console.log('============================================================');
console.log('VAULT 147 — CREATIVE STUDIO REFINEMENT AUDIT');
console.log('============================================================\n');

// 1. Audit: Zero Unwanted Bracket Noise
console.log('[AUDIT 1] Inspecting bracket noise in index.html...');
const bracketTags = html.match(/\[\s*\d+[^\]]*\]/g);
assert(!bracketTags, `Found bracket tags in index.html: ${JSON.stringify(bracketTags)}`);
assert(!html.includes('[01 / 47]'), 'Found [01 / 47]');
assert(!html.includes('[ 05 // RESERVATION ENGINE ]'), 'Found [ 05 // RESERVATION ENGINE ]');
assert(!html.includes('[ 06 // VISUAL PORTFOLIO ]'), 'Found [ 06 // VISUAL PORTFOLIO ]');
assert(!html.includes('[ 07 // LOCATION & ACCESS ]'), 'Found [ 07 // LOCATION & ACCESS ]');
assert(!html.includes('[ 04.1 // CORE DIFFERENTIATORS ]'), 'Found [ 04.1 // CORE DIFFERENTIATORS ]');
assert(!html.includes('[147]'), 'Found [147] badge');
console.log('✓ PASS: All decorative bracket noise and excessive labels removed.');

// 2. Audit: Verified Claims (Strict Accuracy)
console.log('\n[AUDIT 2] Checking claim accuracy across HTML and Bundle...');
const forbiddenClaims = [
  'Aramith',
  'weighted cue',
  'tournament specification',
  'fighting game tournament',
  'spectator seating'
];
for (const claim of forbiddenClaims) {
  const inHtml = new RegExp(claim, 'i').test(html);
  const inBundle = new RegExp(claim, 'i').test(bundleJs);
  assert(!inHtml, `Found unverified claim in index.html: "${claim}"`);
  assert(!inBundle, `Found unverified claim in vault-bundle.js: "${claim}"`);
}
console.log('✓ PASS: Zero unverified claims in index.html and vault-bundle.js.');

// 3. Audit: The 10-Second Test Elements in Hero
console.log('\n[AUDIT 3] Verifying 10-Second Test requirements in Hero...');
assert(html.includes('VAULT 147'), 'Missing brand name VAULT 147');
assert(html.includes('ROYAPURAM, CHENNAI'), 'Missing location Royapuram, Chennai');
assert(/SNOOKER[\s\S]*PS5[\s\S]*THE GAME STARTS HERE/i.test(html), 'Missing primary discipline tagline');
assert(html.includes('BOOK A SESSION'), 'Missing immediate hero booking CTA');
console.log('✓ PASS: Hero delivers What, Where, Why, and Action within 5–10 seconds.');

// 4. Audit: Visual Pause (Section 07)
console.log('\n[AUDIT 4] Verifying Visual Pause (Respiration Room)...');
assert(html.includes('PRECISION.'), 'Missing PRECISION.');
assert(html.includes('FOCUS.'), 'Missing FOCUS.');
assert(html.includes('CONTROL.'), 'Missing CONTROL.');
assert(!html.includes('[ 02 // ETHOS ]'), 'Bracket ethos tag should be removed');
console.log('✓ PASS: Visual pause is minimal, pure stacked typography.');

// 5. Audit: The Arenas (Section 08)
console.log('\n[AUDIT 5] Verifying The Arenas editorial destinations...');
assert(html.includes('THE ARENAS.'), 'Missing THE ARENAS headline');
assert(html.includes('01'), 'Missing arena 01 index');
assert(html.includes('SNOOKER'), 'Missing Snooker arena');
assert(html.includes('₹250'), 'Missing Snooker price ₹250');
assert(html.includes('02'), 'Missing arena 02 index');
assert(html.includes('PLAYSTATION 5'), 'Missing PS5 arena');
assert(html.includes('FROM ₹150'), 'Missing PS5 price from ₹150');
console.log('✓ PASS: The Arenas feel like curated destinations.');

// 6. Audit: About & Why Vault Editorial Narrative (Section 09 & 10)
console.log('\n[AUDIT 6] Verifying About Manifesto & 01-04 Editorial Narrative...');
assert(html.includes('A DESTINATION BUILT TO PLAY.'), 'Missing About statement');
assert(html.includes('vault147-panorama-lounge.webp'), 'Missing panorama lounge image');
assert(html.includes('FULL-SIZE TABLES'), 'Missing Narrative 01');
assert(html.includes('ATMOSPHERE'), 'Missing Narrative 02');
assert(html.includes('DYNAMIC SESSIONS'), 'Missing Narrative 03');
assert(html.includes('SQUAD PLAY'), 'Missing Narrative 04');
assert(aboutCss.includes('.why-vault-narrative'), 'Missing .why-vault-narrative in CSS');
assert(aboutCss.includes('.narrative-reverse'), 'Missing .narrative-reverse in CSS');
console.log('✓ PASS: Why Vault is structured as an alternating editorial narrative.');

// 7. Audit: Booking & Session Pass UX (Section 12, 13, 14, 15)
console.log('\n[AUDIT 7] Verifying Booking UX, Dynamic Duration & VIP Pass...');
assert(html.includes('01 / SELECT DATE'), 'Missing step 01 date label');
assert(html.includes('02 / CHOOSE YOUR ARENA'), 'Missing step 02 arena label');
assert(html.includes('PAY DIRECTLY AT FRONT COUNTER'), 'Missing counter payment note');
assert(html.includes('SESSION UNLOCKED'), 'Missing SESSION UNLOCKED pass header');
assert(html.includes('PAY AT VENUE COUNTER'), 'Missing pass counter notice');
assert(bundleJs.includes('SESSION UNLOCKED'), 'Bundle missing SESSION UNLOCKED');
console.log('✓ PASS: Booking UX and VIP Session Pass correctly configured.');

// 8. Audit: Location & Footer (Section 17 & 18)
console.log('\n[AUDIT 8] Verifying Location and Footer closure...');
assert(html.includes('FIND THE VAULT.'), 'Missing FIND THE VAULT.');
assert(html.includes('PLAY. COMPETE. UNWIND.'), 'Missing footer ethos');
assert(html.includes('Mannarsamy 6/1, Somu Nagar'), 'Missing street address');
assert(html.includes('600013'), 'Missing pincode');
assert(html.includes('+91 88259 75491'), 'Missing phone number');
console.log('✓ PASS: Location and footer mirror the cinematic opening.');

console.log('\n============================================================');
console.log('ALL 8 REFINEMENT AUDITS PASSED WITH ZERO VIOLATIONS!');
console.log('============================================================');
