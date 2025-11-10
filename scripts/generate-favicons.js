const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateFavicons() {
  const inputPath = path.join(__dirname, '../../DP.ico');
  const outputDir = path.join(__dirname, '../public');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Copy the original favicon.ico
    fs.copyFileSync(inputPath, path.join(outputDir, 'favicon.ico'));
    
    // Create other required sizes
    const sizes = [16, 32, 48, 180];
    
    for (const size of sizes) {
      const outputPath = size === 180 
        ? path.join(outputDir, 'apple-touch-icon.png')
        : path.join(outputDir, `favicon-${size}x${size}.png`);
      
      await sharp(inputPath)
        .resize(size, size)
        .toFile(outputPath);
      
      console.log(`Generated: ${path.basename(outputPath)}`);
    }
    
    console.log('Favicon generation complete!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
