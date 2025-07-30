const fs = require('fs');
const path = require('path');

// Function to extract text from HTML
function extractTextFromHTML(html) {
  // Remove HTML comments
  let text = html.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove script tags and their content
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
  
  // Remove style tags and their content
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  
  // Remove all HTML tags but keep their content
  text = text.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, ' ');
  
  // Remove extra whitespace and normalize
  text = text.replace(/\s+/g, ' ');
  text = text.trim();
  
  return text;
}

// Read the HTML file
const htmlFilePath = path.join(__dirname, 'vortexfdn');
const outputFilePath = path.join(__dirname, 'vortexfdn-text.txt');

try {
  // Read the HTML content
  const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
  
  // Extract text
  const extractedText = extractTextFromHTML(htmlContent);
  
  // Write the extracted text to a new file
  fs.writeFileSync(outputFilePath, extractedText, 'utf8');
  
  console.log('✅ Text extraction completed!');
  console.log(`📄 Output saved to: ${outputFilePath}`);
  console.log(`📊 Text length: ${extractedText.length} characters`);
  console.log('\n📝 First 500 characters of extracted text:');
  console.log('─'.repeat(50));
  console.log(extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''));
  console.log('─'.repeat(50));
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} 