#!/usr/bin/env node
/**
 * Update script for Trest Language
 * Checks for updates and installs the latest version from npm
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PACKAGE_NAME = 'treste';
const CURRENT_VERSION = require('../package.json').version;

console.log(`\n🔄 Trest Language Update Tool`);
console.log(`Current version: v${CURRENT_VERSION}\n`);

try {
  // Check latest version from npm
  console.log('📡 Checking for updates...');
  const latestVersion = execSync(`npm view ${PACKAGE_NAME} version`, { encoding: 'utf-8' }).trim();
  
  console.log(`Latest version: v${latestVersion}\n`);
  
  if (latestVersion === CURRENT_VERSION) {
    console.log('✅ You are already using the latest version!');
    console.log(`   Current: v${CURRENT_VERSION}`);
    console.log(`   Latest:  v${latestVersion}\n`);
    process.exit(0);
  }
  
  // Compare versions
  const currentParts = CURRENT_VERSION.split('.').map(Number);
  const latestParts = latestVersion.split('.').map(Number);
  
  let isNewer = false;
  for (let i = 0; i < 3; i++) {
    if (latestParts[i] > currentParts[i]) {
      isNewer = true;
      break;
    } else if (latestParts[i] < currentParts[i]) {
      break;
    }
  }
  
  if (!isNewer) {
    console.log('✅ You are using a newer or equal version!');
    console.log(`   Current: v${CURRENT_VERSION}`);
    console.log(`   Latest:  v${latestVersion}\n`);
    process.exit(0);
  }
  
  // Ask for confirmation
  console.log(`📦 New version available: v${latestVersion}`);
  console.log(`   Current: v${CURRENT_VERSION}`);
  console.log(`   Latest:  v${latestVersion}\n`);
  
  console.log('🚀 Updating to latest version...\n');
  
  // Update globally
  try {
    execSync(`npm install -g ${PACKAGE_NAME}@latest`, { stdio: 'inherit' });
    console.log('\n✅ Update completed successfully!');
    console.log(`   Updated from v${CURRENT_VERSION} to v${latestVersion}\n`);
    
    // Show version
    try {
      const newVersion = execSync(`${PACKAGE_NAME} --version`, { encoding: 'utf-8' }).trim();
      console.log(`📌 Installed version: ${newVersion}\n`);
    } catch (e) {
      // Ignore if command not found
    }
    
  } catch (error) {
    console.error('\n❌ Error updating package:');
    console.error('   Please run manually: npm install -g treste@latest\n');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Error checking for updates:');
  console.error('   Could not connect to npm registry');
  console.error('   Please check your internet connection\n');
  console.log('💡 To update manually, run:');
  console.log('   npm install -g treste@latest\n');
  process.exit(1);
}
