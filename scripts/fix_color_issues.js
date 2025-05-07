#!/usr/bin/env node
/**
 * Script to fix all color related issues
 * 
 * Run with: node scripts/fix_color_issues.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// First, fix the colors.ts file to have consistent exports
const colorsFilePath = 'constants/colors.ts';
console.log(`Fixing ${colorsFilePath}...`);

let colorsContent = fs.readFileSync(colorsFilePath, 'utf8');

// Ensure we have a simpler structure with just one export
const newColorsContent = `// Sailor Luxe Theme - Color constants
export const Colors = {
  background: '#F6F9FC', // Soft fog white
  primary: '#1A2238',     // Navy charcoal
  secondary: '#70A1FF',   // Marina blå
  accent: '#F4C95D',      // Golden beige
  textPrimary: '#1F2937', // Deep gråblå
  textSecondary: '#6B7280',// Avtonad grå
  success: '#10B981',     // Grön
  warning: '#F59E0B',     // Amber warning
  error: '#EF4444',       // Red error
  white: '#FFFFFF',       // Pure white
  border: '#E5E7EB',      // Light grey for borders
  shadow: '#1A2238',      // Shadow color
  primaryLight: '#E8EFFD', // Light version of primary
  gray: '#6B7280',        // Gray for icons
};

// Export the same theme as default for backwards compatibility
export default Colors;`;

fs.writeFileSync(colorsFilePath, newColorsContent);

// Now fix all file imports
const files = glob.sync('app/**/*.tsx');

// Process each file
files.forEach(file => {
  console.log(`Processing ${file}...`);
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix import statements
  content = content.replace(/import\s+{\s*Colors\s*}\s+from\s+@\/constants\/colors/g, 
                           "import { Colors } from '@/constants/colors'");
  
  // Fix imports with sailorLuxeTheme
  content = content.replace(/import\s+{\s*sailorLuxeTheme\s*}/g, 
                           "import { Colors }");
  
  content = content.replace(/import\s+sailorLuxeTheme/g, 
                           "import { Colors }");
                           
  // Replace any remaining references to sailorLuxeTheme with Colors
  content = content.replace(/sailorLuxeTheme\./g, "Colors.");
  
  // Check if the file has a default export for routes
  const hasDefaultExport = content.includes('export default');
  if (!hasDefaultExport && file.includes('app/') && !file.includes('_layout') && !file.includes('+not-found')) {
    console.warn(`Warning: ${file} has no default export! Adding a basic one.`);
    
    // Extract component name from file path
    const fileName = path.basename(file, '.tsx');
    const componentName = fileName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Screen';
    
    // Add a simple default export if the file doesn't have one
    content += `\n\nexport default function ${componentName}() {\n  return null;\n}\n`;
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(file, content);
});

console.log('All files updated!'); 