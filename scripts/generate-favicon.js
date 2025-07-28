const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const png2ico = require('png2ico');

async function generateFavicon() {
  const inputPath = path.join(__dirname, '../public/web-app-manifest-192x192.png');
  const outputDir = path.join(__dirname, '../src/app');
  
  // Generate different sizes for the ICO file
  const sizes = [16, 32, 48];
  const buffers = [];
  
  for (const size of sizes) {
    const buffer = await sharp(inputPath)
      .resize(size, size)
      .toBuffer();
    buffers.push(buffer);
  }
  
  // Convert to ICO format
  const icoBuffer = png2ico(buffers);
  
  // Write the ICO file
  fs.writeFileSync(path.join(outputDir, 'favicon.ico'), icoBuffer);
  
  console.log('Favicon generated successfully!');
}

generateFavicon().catch(console.error);