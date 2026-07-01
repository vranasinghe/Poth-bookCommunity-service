const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\37ee6e0b-ae05-4229-879e-46b27ceb3640\\poth_app_icon_1782933224335.png';
const destDir = path.join(__dirname, '..', 'assets', 'images');
const destPath = path.join(destDir, 'logo.png');

try {
  if (fs.existsSync(srcPath)) {
    // Ensure destination directory exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcPath, destPath);
    console.log('Successfully copied Poth logo to assets/images/logo.png');
  } else {
    console.log('Source logo not found at: ' + srcPath);
  }
} catch (err) {
  console.error('Error copying logo asset:', err);
}
