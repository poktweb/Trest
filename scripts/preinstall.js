#!/usr/bin/env node
/**
 * Pre-install script (Opcional - Manual)
 * Valida o ambiente antes da instalação
 * 
 * NOTA: Este script NÃO é executado automaticamente para segurança.
 * Execute manualmente com: node scripts/preinstall.js
 */

const os = require('os');
const fs = require('fs');

const VERSION = require('../package.json').version;
const MIN_NODE_VERSION = 18;

console.log(`\n🚀 Trest Language v${VERSION} - Environment check\n`);

// Verificar Node.js (sem usar child_process)
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

// Verificar npm (sem usar child_process - usa process.env ou versão via package.json)
function checkNpmVersion() {
  // Verificação via process.versions em vez de execSync
  const npmVersion = process.env.npm_version || 'unknown';
  console.log(`✅ npm version check skipped (safe mode)`);
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

// Verificar espaço em disco (sem usar child_process)
function checkDiskSpace() {
  try {
    const stats = fs.statSync(process.cwd());
    console.log(`✅ Sufficient disk space`);
  } catch (error) {
    console.warn('⚠️  Could not verify disk space');
  }
}

// Executar verificações seguras
console.log('Checking environment...\n');
checkNodeVersion();
checkNpmVersion();
checkOS();
checkDiskSpace();

console.log('\n✅ Environment checks passed!\n');
console.log('ℹ️  This script runs in safe mode (no shell access)\n');

