const fs = require('fs');
const path = require('path');

const assetsDir = 'E:\\IdeaForge_2k26\\src\\assets';

// Read the PNG files
const logo1 = fs.readFileSync(path.join(assetsDir, 'logo1.png'));
const logo2 = fs.readFileSync(path.join(assetsDir, 'logo2.png'));
const signature = fs.readFileSync(path.join(assetsDir, 'signature.png'));

// Convert to base64
const logo1Base64 = logo1.toString('base64');
const logo2Base64 = logo2.toString('base64');
const signatureBase64 = signature.toString('base64');

// Generate the output file content
const output = `// Auto-generated from src/assets/*.png
// Do not edit manually - run 'node scripts/convert-images.js' to regenerate

export const logo1Base64 = '${logo1Base64}';

export const logo2Base64 = '${logo2Base64}';

export const signatureBase64 = '${signatureBase64}';
`;

// Write to imageAssets.js
fs.writeFileSync('E:\\IdeaForge_2k26\\src\\api\\_lib\\imageAssets.js', output);
console.log('✅ imageAssets.js updated successfully');
console.log(`   Logo1: ${logo1Base64.length} chars`);
console.log(`   Logo2: ${logo2Base64.length} chars`);
console.log(`   Signature: ${signatureBase64.length} chars`);
