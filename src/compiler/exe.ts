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
    // Criar wrapper que inclui o código diretamente e garante execução correta
    const jsCode = fs.readFileSync(jsPath, 'utf-8');
    
    // Detectar se o código usa GUI (Electron) ou servidor HTTP
    const usesGUI = /GUI\.|создатьОкно|createWindow|createProgrammaticWindow|manterRodando|keepRunning/i.test(jsCode);
    const usesServer = /createServer|\.listen\(/i.test(jsCode);
    
    // Criar wrapper que garante execução correta no Node.js
    let wrapperCode = `#!/usr/bin/env node
// Wrapper para executável Trest
'use strict';

// Capturar erros não tratados
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não tratado:', error.message);
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
  process.exit(1);
});

// Verificar se usa GUI ANTES de executar código
${usesGUI ? `
// Programa usa GUI - Electron não funciona com executáveis pkg
console.error('');
console.error('❌ Erro: Aplicações GUI não funcionam com executáveis criados via --mode exe');
console.error('');
console.error('💡 Soluções:');
console.error('   1. Execute diretamente: trest arquivo.trest');
console.error('   2. Para criar executável GUI, use electron-builder (não implementado ainda)');
console.error('');
process.exit(1);
` : `
// Executar código compilado
try {
${jsCode}
} catch (error) {
  console.error('❌ Erro ao executar código:', error.message);
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
}

// Gerenciar ciclo de vida do processo
${usesServer ? `
// Programa usa servidor - manter processo vivo
// O servidor gerencia o ciclo de vida através de .listen()
` : `
// Programa simples - aguardar um pouco para garantir que a saída seja exibida
// Aguardar um tempo maior para permitir operações assíncronas completarem
setTimeout(() => {
  process.exit(0);
}, 500);
`}
`}
`;

    return wrapperCode;
  }

  private async buildExecutable(wrapperPath: string, outputPath: string): Promise<void> {
    // Determinar plataforma e arquitetura
    const platform = process.platform === 'win32' ? 'win' : process.platform === 'darwin' ? 'macos' : 'linux';
    const arch = process.arch === 'x64' ? 'x64' : process.arch === 'ia32' ? 'x86' : 'x64';
    const target = `node18-${platform}-${arch}`;
    
    // Escapar caminhos para Windows
    const escapePath = (p: string) => p.replace(/\\/g, '/');
    const wrapperPathEscaped = escapePath(wrapperPath);
    const outputPathEscaped = escapePath(outputPath);
    
    // Tentar múltiplas estratégias para encontrar o pkg
    const strategies: Array<{ name: string; cmd: string | null }> = [
      // 1. Tentar npx pkg (funciona para local e global) - mais confiável
      { 
        name: 'npx', 
        cmd: `npx --yes pkg "${wrapperPathEscaped}" --target ${target} --output "${outputPathEscaped}"` 
      },
      // 2. Tentar pkg global no PATH
      { 
        name: 'global', 
        cmd: `pkg "${wrapperPathEscaped}" --target ${target} --output "${outputPathEscaped}"` 
      },
      // 3. Tentar pkg local em node_modules do projeto atual
      {
        name: 'project-local',
        cmd: (() => {
          // Tentar encontrar node_modules próximo ao dist/cli.js ou dist/compiler.js
          const possiblePaths = [
            path.join(__dirname, '..', 'node_modules', '.bin', 'pkg'),
            path.join(__dirname, '..', '..', 'node_modules', '.bin', 'pkg'),
            path.join(process.cwd(), 'node_modules', '.bin', 'pkg'),
          ];
          
          // No Windows, também tentar com .cmd
          if (process.platform === 'win32') {
            possiblePaths.push(
              path.join(__dirname, '..', 'node_modules', '.bin', 'pkg.cmd'),
              path.join(__dirname, '..', '..', 'node_modules', '.bin', 'pkg.cmd'),
              path.join(process.cwd(), 'node_modules', '.bin', 'pkg.cmd')
            );
          }
          
          for (const pkgPath of possiblePaths) {
            if (fs.existsSync(pkgPath)) {
              return `"${escapePath(pkgPath)}" "${wrapperPathEscaped}" --target ${target} --output "${outputPathEscaped}"`;
            }
          }
          return null;
        })()
      },
      // 4. Tentar pkg local em node_modules do diretório atual
      { 
        name: 'local', 
        cmd: (() => {
          const localPkg = path.join(process.cwd(), 'node_modules', '.bin', 'pkg');
          const localPkgCmd = path.join(process.cwd(), 'node_modules', '.bin', 'pkg.cmd');
          
          if (fs.existsSync(localPkg)) {
            return `"${escapePath(localPkg)}" "${wrapperPathEscaped}" --target ${target} --output "${outputPathEscaped}"`;
          }
          if (process.platform === 'win32' && fs.existsSync(localPkgCmd)) {
            return `"${escapePath(localPkgCmd)}" "${wrapperPathEscaped}" --target ${target} --output "${outputPathEscaped}"`;
          }
          return null;
        })()
      }
    ];

    // Tentar cada estratégia até uma funcionar
    for (const strategy of strategies) {
      if (!strategy.cmd) continue;
      
      try {
        console.log(`🔨 Tentando criar executável usando: ${strategy.name}...`);
        const { stdout, stderr } = await execAsync(strategy.cmd);
        
        if (stdout) {
          console.log(stdout);
        }
        
        if (stderr && !stderr.includes('warning') && !stderr.includes('Installing')) {
          console.warn(stderr);
        }
        
        // Verificar se o arquivo .exe foi criado
        if (fs.existsSync(outputPath)) {
          console.log(`✓ Executável criado com sucesso: ${outputPath}`);
          return;
        }
      } catch (error: any) {
        // Se falhar, tentar próxima estratégia
        continue;
      }
    }

    // Se nenhuma estratégia funcionou, usar método alternativo
    console.warn('⚠️  pkg não disponível ou não funcionou, tentando método alternativo...');
    await this.buildExecutableAlternative(wrapperPath, outputPath);
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

