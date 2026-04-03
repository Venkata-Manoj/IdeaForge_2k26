// Simple test script to generate a sample PDF certificate
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCertificate } from '../src/api/_lib/pdfGenerator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testPDFGeneration() {
  console.log('Testing PDF Generation...\n');

  const testData = {
    participantName: 'John Doe',
    eventType: 'Technical',
    certificateId: 'IF2K26-ABCD-EFGH',
    eventDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  };

  console.log('Input Data:');
  console.log(`  Name: ${testData.participantName}`);
  console.log(`  Event Type: ${testData.eventType}`);
  console.log(`  Certificate ID: ${testData.certificateId}`);
  console.log(`  Date: ${testData.eventDate}\n`);

  try {
    const pdfBytes = await generateCertificate(testData);
    
    // Save to file
    const outputPath = path.join(__dirname, '..', 'test_certificate.pdf');
    fs.writeFileSync(outputPath, pdfBytes);
    
    console.log('✓ PDF generated successfully!');
    console.log(`  Saved to: ${outputPath}`);
    console.log(`  File size: ${(pdfBytes.length / 1024).toFixed(2)} KB\n`);
    console.log('Please check the PDF to verify:');
    console.log('  - Name is correctly displayed and centered');
    console.log('  - Event Type (Technical/Non-Technical) is correctly displayed');
    console.log('  - All elements are properly aligned');
    
  } catch (error) {
    console.error('✗ Error generating PDF:', error);
    process.exit(1);
  }
}

testPDFGeneration();