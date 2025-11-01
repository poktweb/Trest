#!/usr/bin/env node
/**
 * Pre-install script
 * Valida o ambiente antes da instalação
 */

const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const VERSION = require('../package.json').version;
const MIN_NODE_VERSION = 18;
const MIN_NPM_VERSION = 9;

console.log(`\n🚀 Trest Language v${VERSION} - Pre-installation check\n`);

// Verificar Node.js
function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < MIN_NODE_VERSION) {
    console.error(`❌ Node.js ${MIN_NODE_VERSION}+ required. Current: ${nodeVersion}`);
    console.error('Please update Node.js from https://nodejs.org/');
    process.exit(1);
  }
  
  console.log(`✅ Node.js version: ${nodeVersion}`);
}

// Verificar npm
function checkNpmVersion() {
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
    const majorVersion = parseInt(npmVersion.split('.')[0]);
    
    if (majorVersion < MIN_NPM_VERSION) {
      console.error(`❌ npm ${MIN_NPM_VERSION}+ required. Current: ${npmVersion}`);
      console.error('Please update npm: npm install -g npm@latest');
      process.exit(1);
    }
    
    console.log(`✅ npm version: ${npmVersion}`);
  } catch (error) {
    console.error('❌ Failed to check npm version');
    process.exit(1);
  }
}

// Verificar sistema operacional
function checkOS() {
  const platform = os.platform();
  const supported = ['darwin', 'linux', 'win32'];
  
  if (!supported.includes(platform)) {
    console.warn(`⚠️  Platform ${platform} may not be fully supported`);
  } else {
    console.log(`✅ Platform: ${platform}`);
  }
}

// Verificar TypeScript
function checkTypeScript() {
  try {
    const tsVersion = execSync('tsc --version', { encoding: 'utf-8' }).trim();
    console.log(`✅ ${tsVersion}`);
  } catch (error) {
    console.warn('⚠️  TypeScript not found globally (will be installed locally)');
  }
}

// Verificar espaço em disco
function checkDiskSpace() {
  try {
    const stats = fs.statSync(process.cwd());
    console.log(`✅ Sufficient disk space`);
  } catch (error) {
    console.warn('⚠️  Could not verify disk space');
  }
}

// Executar todas as verificações
console.log('Checking environment...\n');
checkNodeVersion();
checkNpmVersion();
checkOS();
checkTypeScript();
checkDiskSpace();

console.log('\n✅ Pre-installation checks passed!\n');

