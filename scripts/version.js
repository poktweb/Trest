#!/usr/bin/env node
/**
 * Version bump script
 * Atualiza a versão em todos os lugares necessários
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function updateVersion() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const newVersion = process.env.npm_config_version || packageJson.version;
  
  console.log(`\n📦 Updating version to ${newVersion}\n`);
  
  // Atualizar package.json
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('✅ Updated package.json');
  
  // Atualizar README se necessário
  updateReadme(newVersion);
  
  // Criar tag git
  try {
    execSync(`git tag -a v${newVersion} -m "Release v${newVersion}"`, { stdio: 'inherit' });
    console.log(`✅ Created git tag v${newVersion}`);
  } catch (error) {
    console.warn('⚠️  Could not create git tag (may already exist)');
  }
  
  console.log(`\n✅ Version update complete!\n`);
}

function updateReadme(version) {
  const readmePath = path.join(__dirname, '..', 'README.md');
  
  if (fs.existsSync(readmePath)) {
    let content = fs.readFileSync(readmePath, 'utf-8');
    
    // Substituir referências de versão
    content = content.replace(/v\d+\.\d+\.\d+/g, `v${version}`);
    
    fs.writeFileSync(readmePath, content);
    console.log('✅ Updated README.md');
  }
}

updateVersion();

