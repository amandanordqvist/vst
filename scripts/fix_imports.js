#!/usr/bin/env node
/**
 * Script to fix incorrect imports for Colors
 * 
 * Run with: node scripts/fix_imports.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all .tsx files in the app directory
const files = glob.sync('app/**/*.tsx');

// Process each file
files.forEach(file => {
  console.log(`Processing ${file}...`);
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix import statements
  content = content.replace(/import\s+{\s*Colors\s*}\s+from\s+@\/constants\/colors/g, 
                           "import { Colors } from '@/constants/colors'");
  
  // Check if the file has a default export
  const hasDefaultExport = content.includes('export default');
  if (!hasDefaultExport) {
    console.warn(`Warning: ${file} has no default export!`);
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(file, content);
});

console.log('All files updated!'); 