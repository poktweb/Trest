import * as fs from 'fs';
import * as path from 'path';
import { WebCompiler } from './web';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class ExeCompiler {
  private webCompiler: WebCompiler;
  private tempDir: string;

  constructor(basePath: string = process.cwd()) {
    this.webCompiler = new WebCompiler(basePath);
    this.tempDir = path.join(basePath, '.trest-build');
  }

  public async compile(filePath: string, outputPath?: string, options: { minify?: boolean } = {}): Promise<string> {
    // Compilar para JavaScript
    const jsCode = this.webCompiler.compile(filePath, { minify: options.minify, bundle: true });
    
    // Criar diretório temporário se não existir
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }

    // Salvar JavaScript temporário
    const tempJsPath = path.join(this.tempDir, path.basename(filePath, '.trest') + '.js');
    fs.writeFileSync(tempJsPath, jsCode);

    // Criar arquivo wrapper para executável
    const wrapperPath = path.join(this.tempDir, 'wrapper.js');
    const wrapperCode = this.createWrapper(tempJsPath);
    fs.writeFileSync(wrapperPath, wrapperCode);

    // Determinar caminho de saída
    const finalOutputPath = outputPath || path.join(
      path.dirname(filePath),
      path.basename(filePath, '.trest') + '.exe'
    );

    // Usar pkg para criar executável
    try {
      await this.buildExecutable(wrapperPath, finalOutputPath);
      console.log(`✓ Executável criado: ${finalOutputPath}`);
      return finalOutputPath;
    } catch (error: any) {
      throw new Error(`Erro ao criar executável: ${error.message}`);
    }
  }

  private createWrapper(jsPath: string): string {
    return `
const fs = require('fs');
const path = require('path');

// Carregar e executar código compilado
const code = fs.readFileSync(__dirname + '/${path.basename(jsPath)}', 'utf-8');
eval(code);
`.trim();
  }

  private async buildExecutable(wrapperPath: string, outputPath: string): Promise<void> {
    const pkgPath = path.join(process.cwd(), 'node_modules', '.bin', 'pkg');
    const command = `"${pkgPath}" "${wrapperPath}" --target node18-win-x64 --output "${outputPath}"`;

    try {
      const { stdout, stderr } = await execAsync(command);
      if (stderr && !stderr.includes('warning')) {
        console.warn(stderr);
      }
    } catch (error: any) {
      // Se pkg não estiver disponível, tentar método alternativo
      console.warn('pkg não disponível, tentando método alternativo...');
      await this.buildExecutableAlternative(wrapperPath, outputPath);
    }
  }

  private async buildExecutableAlternative(wrapperPath: string, outputPath: string): Promise<void> {
    // Método alternativo: usar nexe ou criar um script Node.js standalone
    const outputDir = path.dirname(outputPath);
    const outputName = path.basename(outputPath, '.exe');
    
    // Criar um script batch para Windows que executa o Node.js
    const batPath = outputPath.replace('.exe', '.bat');
    const batContent = `@echo off
node "%~dp0${path.basename(wrapperPath)}" %*
`;

    fs.writeFileSync(batPath, batContent);
    console.log(`✓ Script batch criado: ${batPath}`);
    console.log(`  Nota: Para um executável real .exe, instale pkg: npm install -g pkg`);
  }

  public async compileStandalone(filePath: string, outputPath?: string): Promise<string> {
    // Compilar tudo em um único arquivo JavaScript standalone
    const jsCode = this.webCompiler.compile(filePath, { minify: false, bundle: true });
    
    const finalOutputPath = outputPath || path.join(
      path.dirname(filePath),
      path.basename(filePath, '.trest') + '.js'
    );

    fs.writeFileSync(finalOutputPath, jsCode);
    console.log(`✓ JavaScript standalone criado: ${finalOutputPath}`);
    
    // Criar arquivo de inicialização
    const initPath = finalOutputPath.replace('.js', '_init.js');
    const initContent = `#!/usr/bin/env node
${jsCode}
`;

    fs.writeFileSync(initPath, initContent);
    fs.chmodSync(initPath, 0o755);
    
    return finalOutputPath;
  }
}

