import { writeFileSync } from 'node:fs';
// 1200x630 paper-colored PNG bytes as a minimal placeholder
// Using a 1x1 paper-colored PNG scaled via CSS is fine for v1.
const pxPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P8f4b9PwAG7gL4rFtXjQAAAABJRU5ErkJggg==',
  'base64'
);
writeFileSync('public/og.png', pxPng);
console.log('wrote public/og.png (placeholder)');
