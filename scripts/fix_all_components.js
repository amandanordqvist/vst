#!/usr/bin/env node
/**
 * Script to fix all component issues
 * 
 * Run with: node scripts/fix_all_components.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all .tsx files in the components directory and app directory
const files = glob.sync('{components,app}/**/*.tsx');

// Process each file
files.forEach(file => {
  console.log(`Processing ${file}...`);
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Fix import for Colors (colors -> Colors)
  if (content.includes("import { colors }")) {
    content = content.replace("import { colors }", "import { Colors }");
    content = content.replace(/colors\./g, "Colors.");
    modified = true;
    console.log(`  Fixed Colors import in ${file}`);
  }
  
  // Fix component import styles
  const componentImportPattern = /import\s+{\s*(Card|StatusBadge|Button|Input|MaintenanceItem|ChecklistItem)\s*}\s+from\s+['"](@\/components|\.)\/(Card|StatusBadge|Button|Input|MaintenanceItem|ChecklistItem)['"]/g;
  content = content.replace(componentImportPattern, (match, component, prefix, fileName) => {
    modified = true;
    console.log(`  Fixed component import for ${component} in ${file}`);
    return `import ${component} from '${prefix}/${fileName}'`;
  });
  
  // Fix duplicate Colors imports
  if (content.includes("import { Colors } from '../constants/colors';") && 
      content.includes("import { Colors } from '@/constants/colors';")) {
    content = content.replace("import { Colors } from '../constants/colors';", "");
    modified = true;
    console.log(`  Fixed duplicate Colors import in ${file}`);
  }
  
  // Fix letterSpacing with any suffix (Small, Medium, Large, etc.)
  const letterSpacingPattern = /letterSpacing:\s*([\d\.]+)([a-zA-Z]+)/g;
  content = content.replace(letterSpacingPattern, (match, spacing, suffix) => {
    modified = true;
    console.log(`  Fixed letterSpacing with ${suffix} suffix in ${file}`);
    return `letterSpacing: ${spacing}`;
  });
  
  // Fix duplicate fontWeight in style objects
  const fontWeightDuplicatePattern = /fontSize:\s*(\d+),\s*fontWeight:\s*["'](\d+)["'],\s*lineHeight:\s*(\d+),\s*letterSpacing:\s*([\d\.]+),\s*fontWeight:\s*["'](\d+)["']/g;
  content = content.replace(fontWeightDuplicatePattern, (match, fontSize, fontWeight1, lineHeight, letterSpacing, fontWeight2) => {
    modified = true;
    console.log(`  Fixed duplicate fontWeight in ${file}`);
    return `fontSize: ${fontSize}, fontWeight: "${fontWeight2}", lineHeight: ${lineHeight}, letterSpacing: ${letterSpacing}`;
  });
  
  // Fix conditional style application
  const conditionalStylePattern = /(icon|rightIcon)\s*&&\s*styles\.(inputWith\w+Icon)/g;
  content = content.replace(conditionalStylePattern, (match, condition, style) => {
    modified = true;
    console.log(`  Fixed conditional style in ${file}`);
    return `${condition} ? styles.${style} : null`;
  });
  
  // Fix missing color properties
  if (content.includes("Colors.text")) {
    content = content.replace(/Colors\.text/g, "Colors.textPrimary");
    modified = true;
    console.log(`  Fixed Colors.text to Colors.textPrimary in ${file}`);
  }
  
  if (content.includes("Colors.textTertiary")) {
    content = content.replace(/Colors\.textTertiary/g, "Colors.textSecondary");
    modified = true;
    console.log(`  Fixed Colors.textTertiary to Colors.textSecondary in ${file}`);
  }
  
  // Fix textPrimarySecondary typo
  if (content.includes("Colors.textPrimarySecondary")) {
    content = content.replace(/Colors\.textPrimarySecondary/g, "Colors.textSecondary");
    modified = true;
    console.log(`  Fixed Colors.textPrimarySecondary to Colors.textSecondary in ${file}`);
  }
  
  // Fix textPrimaryPrimarySecondary typo (double primary)
  if (content.includes("Colors.textPrimaryPrimarySecondary")) {
    content = content.replace(/Colors\.textPrimaryPrimarySecondary/g, "Colors.textSecondary");
    modified = true;
    console.log(`  Fixed Colors.textPrimaryPrimarySecondary to Colors.textSecondary in ${file}`);
  }
  
  // Fix lightGray property
  if (content.includes("Colors.lightGray")) {
    content = content.replace(/Colors\.lightGray/g, "Colors.gray");
    modified = true;
    console.log(`  Fixed Colors.lightGray to Colors.gray in ${file}`);
  }
  
  // Fix fontWeight strings
  const fontWeightPattern = /fontWeight:\s*theme\.fontWeight\.(\w+)/g;
  content = content.replace(fontWeightPattern, (match, weight) => {
    let weightValue = "400";
    if (weight === "medium") weightValue = "500";
    if (weight === "semibold") weightValue = "600";
    if (weight === "bold") weightValue = "700";
    modified = true;
    console.log(`  Fixed fontWeight in ${file}`);
    return `fontWeight: "${weightValue}"`;
  });
  
  // Fix duplicate properties in style objects
  const styleObjectPattern = /(fontSize:\s*\d+,\s*fontWeight:\s*["']\d+["'],\s*lineHeight:\s*\d+,\s*letterSpacing:\s*[\d\.]+),\s*fontWeight:\s*['"]([^'"]+)['"]/g;
  content = content.replace(styleObjectPattern, (match, beforeProps, fontWeightValue) => {
    modified = true;
    console.log(`  Fixed duplicate fontWeight in style object in ${file}`);
    return `fontSize: 16, fontWeight: "${fontWeightValue}", lineHeight: 24, letterSpacing: 0.15`;
  });
  
  // Write the updated content back to the file
  if (modified) {
    fs.writeFileSync(file, content);
  }
});

console.log('Component fixes complete!'); 