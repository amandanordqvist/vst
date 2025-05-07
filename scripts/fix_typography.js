#!/usr/bin/env node
/**
 * Script to fix typography and font weight issues
 * 
 * Run with: node scripts/fix_typography.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all .tsx files 
const files = glob.sync('app/**/*.tsx');

// Process each file
files.forEach(file => {
  console.log(`Processing ${file}...`);
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Fix fontWeight values to ensure they're string literals with quotes
  const fontWeightPattern = /fontWeight:\s*["']?(\d+)["']?/g;
  content = content.replace(fontWeightPattern, (match, weight) => {
    modified = true;
    return `fontWeight: "${weight}"`;
  });
  
  // Fix any instances of 0.15Small or similar typos
  const letterSpacingPattern = /letterSpacing:\s*([\d\.]+)([a-zA-Z]+)/g;
  content = content.replace(letterSpacingPattern, (match, spacing, suffix) => {
    modified = true;
    console.log(`  Fixed letterSpacing typo: ${match}`);
    return `letterSpacing: ${spacing}`;
  });
  
  // Replace typography spread with direct values
  if (content.includes('...typography.')) {
    content = content.replace(/\.\.\.typography\.body/g, 'fontSize: 16, fontWeight: "400", lineHeight: 24, letterSpacing: 0.15');
    content = content.replace(/\.\.\.typography\.bodyMedium/g, 'fontSize: 16, fontWeight: "500", lineHeight: 24, letterSpacing: 0.15');
    content = content.replace(/\.\.\.typography\.bodySmall/g, 'fontSize: 14, fontWeight: "400", lineHeight: 20, letterSpacing: 0.1');
    content = content.replace(/\.\.\.typography\.h1/g, 'fontSize: 32, fontWeight: "700", lineHeight: 40, letterSpacing: -0.5');
    content = content.replace(/\.\.\.typography\.h2/g, 'fontSize: 28, fontWeight: "700", lineHeight: 36, letterSpacing: -0.25');
    content = content.replace(/\.\.\.typography\.h3/g, 'fontSize: 24, fontWeight: "600", lineHeight: 32, letterSpacing: 0');
    content = content.replace(/\.\.\.typography\.subtitle/g, 'fontSize: 18, fontWeight: "600", lineHeight: 26, letterSpacing: 0.15');
    content = content.replace(/\.\.\.typography\.caption/g, 'fontSize: 12, fontWeight: "400", lineHeight: 16, letterSpacing: 0.4');
    modified = true;
  }

  // Write the updated content back to the file
  if (modified) {
    fs.writeFileSync(file, content);
  }
});

console.log('Typography fixes complete!'); 