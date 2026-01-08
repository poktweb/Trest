#!/usr/bin/env node
/**
 * Post-install script (Opcional - Manual)
 * Configura o ambiente após a instalação
 * 
 * NOTA: Este script NÃO é executado automaticamente para segurança.
 * Execute manualmente com: node scripts/postinstall.js
 */

const fs = require('fs');
const path = require('path');

const VERSION = require('../package.json').version;

console.log(`\n🎉 Trest Language v${VERSION} installed successfully!\n`);

// Criar arquivo de configuração se não existir
function createConfigFile() {
  const configPath = path.join(process.cwd(), '.trestrc');
  
  if (!fs.existsSync(configPath)) {
    const config = {
      version: VERSION,
      compiler: {
        web: {
          minify: false,
          bundle: true
        },
        exe: {
          minify: false,
          standalone: true
        }
      },
      runtime: {
        strictMode: false,
        debugMode: false
      }
    };
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('✅ Created .trestrc configuration file');
  }
}

// Verificar permissões dos binários
function checkBinPermissions() {
  const distPath = path.join(process.cwd(), 'dist');
  
  if (fs.existsSync(distPath)) {
    console.log('✅ Build artifacts found');
  } else {
    console.log('⚠️  Build artifacts not found, run: npm run build');
  }
}

// Verificar módulos std
function checkStdModules() {
  const stdPath = path.join(process.cwd(), 'src', 'std');
  
  if (fs.existsSync(stdPath)) {
    const modules = fs.readdirSync(stdPath).filter(f => f.endsWith('.trest'));
    console.log(`✅ Standard library: ${modules.length} modules found`);
  } else {
    console.error('❌ Standard library not found');
  }
}

// Mensagens de instrução
function showInstructions() {
  console.log('\n📚 Getting started:\n');
  console.log('  Run a Trest file:');
  console.log('    npx trest yourfile.trest\n');
  console.log('  Compile for web:');
  console.log('    npx trestc yourfile.trest --mode web\n');
  console.log('  Compile to executable:');
  console.log('    npx trestc yourfile.trest --mode exe\n');
  console.log('  For more information:');
  console.log('    npx trest --help\n');
  console.log('📖 Documentation: https://github.com/trest-language/trest\n');
}

// Executar configurações
try {
  createConfigFile();
  checkBinPermissions();
  checkStdModules();
  showInstructions();
} catch (error) {
  console.error('⚠️  Post-install setup had some issues:', error.message);
  console.log('You can manually configure later.\n');
}

