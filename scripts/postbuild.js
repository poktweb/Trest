#!/usr/bin/env node
/**
 * Post-build script
 * Configurações após a compilação
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔨 Post-build configuration...\n');

// Adicionar shebang aos binários
function addShebang() {
  const bins = [
    path.join(__dirname, '..', 'dist', 'cli.js'),
    path.join(__dirname, '..', 'dist', 'compiler.js')
  ];
  
  bins.forEach(bin => {
    if (fs.existsSync(bin)) {
      let content = fs.readFileSync(bin, 'utf-8');
      
      // Adicionar shebang se não existir
      if (!content.startsWith('#!/usr/bin/env node')) {
        content = '#!/usr/bin/env node\n' + content;
        fs.writeFileSync(bin, content);
      }
      
      console.log(`✅ Configured ${path.basename(bin)}`);
    }
  });
}

// Verificar arquivos gerados
function verifyBuild() {
  const requiredFiles = [
    'dist/index.js',
    'dist/cli.js',
    'dist/compiler.js',
    'dist/lexer.js',
    'dist/parser.js',
    'dist/interpreter.js'
  ];
  
  let allOk = true;
  
  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing: ${file}`);
      allOk = false;
    }
  });
  
  if (allOk) {
    console.log('✅ All build artifacts present');
  }
}

// Copiar módulos std para dist se necessário
function copyStdModules() {
  const srcStd = path.join(__dirname, '..', 'src', 'std');
  const distStd = path.join(__dirname, '..', 'dist', 'std');
  
  if (fs.existsSync(srcStd) && !fs.existsSync(distStd)) {
    fs.mkdirSync(distStd, { recursive: true });
    
    const files = fs.readdirSync(srcStd);
    files.forEach(file => {
      if (file.endsWith('.trest')) {
        const srcPath = path.join(srcStd, file);
        const distPath = path.join(distStd, file);
        fs.copyFileSync(srcPath, distPath);
        console.log(`✅ Copied ${file}`);
      }
    });
  }
}

// Executar configurações
try {
  addShebang();
  verifyBuild();
  copyStdModules();
  console.log('\n✅ Post-build complete!\n');
} catch (error) {
  console.error('❌ Post-build error:', error.message);
  process.exit(1);
}

