#!/usr/bin/env node

/**
 * Update script for Trest Language
 * Checks latest version from NPM and updates if needed
 */

const https = require('https');
const { execSync } = require('child_process');
const packageJson = require('../package.json');

const CURRENT_VERSION = packageJson.version;
const PACKAGE_NAME = packageJson.name;
const NPM_REGISTRY = `https://registry.npmjs.org/${PACKAGE_NAME}`;

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║   🔄 TREST LANGUAGE - CHECKING FOR UPDATES                  ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log(`📦 Package: ${PACKAGE_NAME}`);
console.log(`📌 Current version: ${CURRENT_VERSION}\n`);

console.log('🔍 Checking NPM for latest version...\n');

// Fetch latest version from NPM
https.get(NPM_REGISTRY, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const packageInfo = JSON.parse(data);
      const latestVersion = packageInfo['dist-tags'].latest;
      const versions = packageInfo.versions || {};
      
      console.log(`✅ Latest version available: ${latestVersion}\n`);

      // Compare versions
      if (latestVersion === CURRENT_VERSION) {
        console.log('╔═══════════════════════════════════════════════════════════════╗');
        console.log('║   ✅ YOU ARE UP TO DATE!                                    ║');
        console.log('╚═══════════════════════════════════════════════════════════════╝\n');
        console.log(`You are already running the latest version: ${CURRENT_VERSION}`);
        process.exit(0);
      }

      // Check if current version is newer (unlikely but possible)
      const versionCompare = compareVersions(latestVersion, CURRENT_VERSION);
      if (versionCompare < 0) {
        console.log('╔═══════════════════════════════════════════════════════════════╗');
        console.log('║   ℹ️  YOU HAVE A NEWER VERSION                              ║');
        console.log('╚═══════════════════════════════════════════════════════════════╝\n');
        console.log(`Current: ${CURRENT_VERSION} (newer than NPM: ${latestVersion})`);
        console.log('You are running a development or pre-release version.');
        process.exit(0);
      }

      // Update available!
      console.log('╔═══════════════════════════════════════════════════════════════╗');
      console.log('║   🆕 UPDATE AVAILABLE!                                      ║');
      console.log('╚═══════════════════════════════════════════════════════════════╝\n');
      console.log(`📌 Current: ${CURRENT_VERSION}`);
      console.log(`🚀 Latest:  ${latestVersion}`);
      console.log('');
      
      // Show changelog if available
      if (versions[latestVersion] && versions[latestVersion].changelog) {
        console.log('📝 What\'s new in this version:');
        console.log('   ' + versions[latestVersion].changelog);
        console.log('');
      }

      console.log('🔄 Updating treste...\n');

      try {
        // Update globally if installed globally
        execSync('npm list -g --depth=0', { stdio: 'ignore' });
        
        console.log('📦 Installing latest version globally...');
        execSync(`npm install -g ${PACKAGE_NAME}@${latestVersion}`, { 
          stdio: 'inherit',
          cwd: process.cwd()
        });
        
        console.log('\n╔═══════════════════════════════════════════════════════════════╗');
        console.log('║   ✅ UPDATE COMPLETE!                                      ║');
        console.log('╚═══════════════════════════════════════════════════════════════╝\n');
        console.log(`🎉 Successfully updated to ${latestVersion}!`);
        console.log('\n🔧 Verifying installation...');
        execSync('trest --version', { stdio: 'inherit' });
        
      } catch (error) {
        console.log('\n⚠️  Could not update automatically.');
        console.log('\nPlease run manually:');
        console.log(`  npm install -g ${PACKAGE_NAME}@${latestVersion}`);
        process.exit(1);
      }

    } catch (error) {
      console.error('❌ Error parsing NPM response:', error.message);
      process.exit(1);
    }
  });
}).on('error', (error) => {
  console.error('❌ Error checking for updates:', error.message);
  console.log('\nCould not connect to NPM registry.');
  console.log('Please check your internet connection and try again.');
  process.exit(1);
});

/**
 * Compare two semantic versions
 * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  
  return 0;
}

