import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy static assets to public directory for seamless Vercel compatibility
const itemsToCopy = ['index.html', 'css', 'js', 'assets'];

for (const item of itemsToCopy) {
  const src = path.resolve(rootDir, item);
  const dest = path.resolve(publicDir, item);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true, force: true });
  }
}

console.log('[Build] Static assets generated in public/ and root successfully.');
