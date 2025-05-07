#!/usr/bin/env node
/**
 * Script to fix component imports across all files
 * 
 * Run with: node scripts/fix_component_imports.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// List of components to fix their imports
const componentsToFix = [
  'Input',
  'Button',
  'Card',
  'StatusBadge',
  'ProgressBar',
  'MaintenanceItem',
  'ChecklistItem',
  'VesselCard',
  'WeatherCard',
  'SailorButton',
  'SailorCard'
];

// Process all TypeScript files
const files = glob.sync('**/*.tsx');

// Process each file
files.forEach(file => {
  console.log(`Processing ${file}...`);
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Fix import statements for each component
  componentsToFix.forEach(component => {
    const namedImportPattern = new RegExp(`import\\s+{\\s*${component}\\s*}\\s+from\\s+['"](@?\\/components\\/${component}|\\.\\.?\\/components\\/${component})['"]`, 'g');
    if (namedImportPattern.test(content)) {
      content = content.replace(
        namedImportPattern,
        `import ${component} from '$1'`
      );
      modified = true;
    }
  });
  
  // Fix textPrimarySecondary references
  if (content.includes('textPrimarySecondary')) {
    content = content.replace(/Colors\.textPrimarySecondary/g, 'Colors.textSecondary');
    modified = true;
  }
  
  // Fix typography spreading issues
  if (content.includes('...typography.')) {
    // Find cases where typography is spread into style objects and replace with explicit properties
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
  
  // Save the file if it was modified
  if (modified) {
    fs.writeFileSync(file, content);
  }
});

console.log('All component imports updated!'); 