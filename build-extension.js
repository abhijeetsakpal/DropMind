const fs = require('fs');
const path = require('path');

// Copy manifest and background script to dist
const distPath = './dist/drop-mind';
const srcPath = './src';

if (fs.existsSync(distPath)) {
  // Copy manifest.json
  fs.copyFileSync(
    path.join(srcPath, 'manifest.json'),
    path.join(distPath, 'manifest.json')
  );
  
  // Copy background.js
  fs.copyFileSync(
    path.join(srcPath, 'background.js'),
    path.join(distPath, 'background.js')
  );
  
  console.log('Chrome extension files copied to dist/');
} else {
  console.log('Build the Angular app first with: ng build');
}