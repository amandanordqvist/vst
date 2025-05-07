#!/usr/bin/env node
/**
 * Script to update colors imports and references
 * 
 * Run with: node scripts/fix_colors.js
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
  
  // Replace imports
  content = content.replace(/import\s+{\s*colors\s*}\s+from\s+['"](@\/constants\/colors|\.\.\/constants\/colors)['"]/g, 
                          'import { Colors } from $1');
  
  // Replace references with proper casing
  content = content.replace(/colors\./g, 'Colors.');
  
  // Replace outdated color properties
  content = content.replace(/Colors\.text/g, 'Colors.textPrimary');
  content = content.replace(/Colors\.textTertiary/g, 'Colors.textSecondary');
  
  // Handle cases where primaryLight and other properties might not exist
  content = content.replace(/Colors\.primaryLight/g, 'Colors.background');
  content = content.replace(/Colors\.primary/g, 'Colors.primary');
  content = content.replace(/Colors\.secondary/g, 'Colors.secondary');
  content = content.replace(/Colors\.error/g, 'Colors.accent');
  content = content.replace(/Colors\.gray/g, 'Colors.textSecondary');
  content = content.replace(/Colors\.border/g, 'Colors.textSecondary');
  content = content.replace(/Colors\.shadow/g, 'Colors.primary');
  
  // Write the updated content back to the file
  fs.writeFileSync(file, content);
});

console.log('All files updated!'); 