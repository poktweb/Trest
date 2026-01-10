#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { Interpreter } from './interpreter';
import { TrestError } from './errors';
import { ModuleSystem } from './module';
import minimist from 'minimist';

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));
const VERSION = packageJson.version;

interface CliOptions {
  help?: boolean;
  h?: boolean;
  version?: boolean;
  v?: boolean;
  update?: boolean;
  u?: boolean;
  strict?: boolean;
  verbose?: boolean;
  debug?: boolean;
  e?: string;
  execute?: string;
  mode?: string;
  m?: string;
  output?: string;
  o?: string;
  _: string[];
}

function main() {
  const args: CliOptions = minimist(process.argv.slice(2)) as CliOptions;
  
  // Validação de argumentos
  if (args._.length === 0 && !args.help && !args.h && !args.version && !args.v && !args.update && !args.u && !args.e && !args.execute) {
    showUsage();
    process.exit(1);
  }

  if (args.help || args.h) {
    showHelp();
    process.exit(0);
  }

  if (args.version || args.v) {
    console.log(`Trest Language v${VERSION}`);
    process.exit(0);
  }

  if (args.update || args.u) {
    // Run update script
    const updateScript = path.join(__dirname, '../scripts/update.js');
    if (fs.existsSync(updateScript)) {
      execSync(`node "${updateScript}"`, { stdio: 'inherit' });
    } else {
      console.error('❌ Update script not found');
      console.log('Please run: npm install -g treste@latest');
      process.exit(1);
    }
    process.exit(0);
  }

  // Modo execute inline: trest -e "печать('Olá')"
  if (args.e || args.execute) {
    const code = args.e || args.execute;
    if (!code) {
      console.error('❌ Error: No code provided for -e flag');
      process.exit(1);
    }
    executeCode(code, process.cwd(), args);
    process.exit(0);
  }

  // Se há flags de compilação (--mode ou -m), redirecionar para o compilador
  if (args.mode || args.m) {
    const { spawn } = require('child_process');
    const compilerPath = path.join(__dirname, 'compiler.js');
    const compilerArgs = process.argv.slice(2);
    
    const compilerProcess = spawn('node', [compilerPath, ...compilerArgs], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    compilerProcess.on('close', (code: number | null) => {
      process.exit(code || 0);
    });
    
    compilerProcess.on('error', (err: any) => {
      console.error('❌ Erro ao executar compilador:', err.message);
      process.exit(1);
    });
    
    return;
  }

  const filePath = args._[0];

  // Validações de arquivo
  if (!filePath) {
    console.error('❌ Error: No file specified');
    console.error('Usage: trest <файл.trest> [опции]');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const fileStats = fs.statSync(filePath);
  if (!fileStats.isFile()) {
    console.error(`❌ Error: ${filePath} is not a file`);
    process.exit(1);
  }

  // Log verbose
  if (args.verbose || args.debug) {
    console.log(`📄 Executing: ${filePath}`);
    console.log(`📊 File size: ${fileStats.size} bytes`);
    console.log('');
  }

  executeFile(filePath, args);
}

function executeFile(filePath: string, args: CliOptions) {
  try {
    const startTime = Date.now();
    
    // Se há flags de compilação (--mode), redirecionar para o compilador
    const mode = args.mode || args.m;
    if (mode) {
      const { spawn } = require('child_process');
      const compilerPath = path.join(__dirname, 'compiler.js');
      const compilerArgs = process.argv.slice(2);
      
      const compilerProcess = spawn('node', [compilerPath, ...compilerArgs], {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      compilerProcess.on('close', (code: number | null) => {
        process.exit(code || 0);
      });
      
      compilerProcess.on('error', (err: any) => {
        console.error('❌ Erro ao executar compilador:', err.message);
        process.exit(1);
      });
      
      return;
    }
    
    // Ler arquivo
    const code = fs.readFileSync(filePath, 'utf-8');
    
    if (code.length === 0) {
      console.warn('⚠️  Warning: File is empty');
      process.exit(0);
    }
    
    // Detectar se usa GUI (Electron precisa ser processo principal)
    const usesGUI = /GUI\.|импорт.*GUI|import.*GUI|создатьОкно|createWindow/i.test(code);
    
    if (args.debug || args.verbose) {
      console.log(`🔍 GUI detectado: ${usesGUI}, Electron disponível: ${!!process.versions.electron}`);
    }
    
    // Se usar GUI e não estiver no Electron, executar através do Electron
    // Mas apenas se não estiver em modo de compilação
    const isCompilationMode = args.mode || args.m;
    if (usesGUI && !process.versions.electron && !isCompilationMode) {
      try {
        const electronPath = require.resolve('electron');
        if (electronPath) {
          console.log('🖥️  Detectado uso de GUI - executando através do Electron...\n');
          
          // Criar script temporário que executa o Trest code no Electron
          const tempScript = path.join(__dirname, '..', 'scripts', 'electron-run.js');
          const resolvedFilePath = path.resolve(filePath);
          const basePath = path.dirname(resolvedFilePath);
          
          const distPath = path.join(__dirname, '..', 'dist').replace(/\\/g, '/');
          const scriptContent = `const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const distPath = ${JSON.stringify(distPath)};
const filePath = ${JSON.stringify(resolvedFilePath.replace(/\\/g, '/'))};
const basePath = ${JSON.stringify(basePath.replace(/\\/g, '/'))};

const { Interpreter } = require(path.join(distPath, 'interpreter'));
const { Lexer } = require(path.join(distPath, 'lexer'));
const { Parser } = require(path.join(distPath, 'parser'));
const { ModuleSystem } = require(path.join(distPath, 'module'));

app.whenReady().then(() => {
  try {
    const code = fs.readFileSync(filePath, 'utf-8');
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const program = parser.parse();
    
    const moduleSystem = new ModuleSystem(basePath);
    const interpreter = new Interpreter();
    interpreter.interpret(program);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.stack) console.error(error.stack);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
`;
          
          // Criar pasta scripts se não existir
          const scriptsDir = path.dirname(tempScript);
          if (!fs.existsSync(scriptsDir)) {
            fs.mkdirSync(scriptsDir, { recursive: true });
          }
          
          fs.writeFileSync(tempScript, scriptContent);
          
          // Executar através do Electron
          const { spawn } = require('child_process');
          
          // Tentar encontrar o binário do electron
          let electronCmd: string;
          let electronArgs: string[] = [];
          
          try {
            // Tentar encontrar o executável do electron usando o package.json do electron
            const electronPackageJson = require.resolve('electron/package.json');
            const electronPackageDir = path.dirname(electronPackageJson);
            const electronExe = path.join(electronPackageDir, 'dist', 'electron.exe');
            const electronCli = path.join(electronPackageDir, 'cli.js');
            
            // No Windows, usar o .exe diretamente se existir
            if (process.platform === 'win32' && fs.existsSync(electronExe)) {
              electronCmd = electronExe;
              electronArgs = [tempScript];
            } else if (fs.existsSync(electronCli)) {
              // Usar node para executar o cli.js do electron (funciona em todos os sistemas)
              electronCmd = process.execPath;
              electronArgs = [electronCli, tempScript];
            } else {
              // Usar npx como fallback
              electronCmd = 'npx';
              electronArgs = ['--yes', 'electron', tempScript];
            }
          } catch (e: any) {
            // Usar npx como fallback
            electronCmd = 'npx';
            electronArgs = ['--yes', 'electron', tempScript];
          }
          
          console.log(`🚀 Executando Electron: ${electronCmd} ${electronArgs.join(' ')}`);
          
          const electronProcess = spawn(electronCmd, electronArgs, {
            stdio: 'inherit',
            cwd: path.dirname(__dirname),
            shell: process.platform === 'win32'
          });
          
          electronProcess.on('close', (code: number | null) => {
            // Limpar script temporário
            try {
              if (fs.existsSync(tempScript)) {
                fs.unlinkSync(tempScript);
              }
            } catch (e) {
              // Ignorar erros de limpeza
            }
            process.exit(code || 0);
          });
          
          electronProcess.on('error', (err: any) => {
            console.error('❌ Erro ao executar Electron:', err.message);
            console.error('💡 Tentando executar normalmente...\n');
            // Limpar script temporário
            try {
              if (fs.existsSync(tempScript)) {
                fs.unlinkSync(tempScript);
              }
            } catch (e) {
              // Ignorar erros de limpeza
            }
            // Fallback: executar normalmente
            try {
              const basePath = path.dirname(filePath);
              executeCode(code, basePath, args);
            } catch (execError: any) {
              handleError(execError, args);
              process.exit(1);
            }
          });
          
          return;
        }
      } catch (e: any) {
        // Electron não disponível ou erro ao executar - continuar normalmente
        console.warn('⚠️  Aviso: GUI detectado mas Electron não disponível. Executando normalmente...\n');
      }
    }
    
    const basePath = path.dirname(filePath);
    executeCode(code, basePath, args);
    
    const duration = Date.now() - startTime;
    
    if (args.verbose || args.debug) {
      console.log(`\n✅ Execution completed in ${duration}ms`);
    }
  } catch (error: any) {
    handleError(error, args);
    process.exit(1);
  }
}

function executeCode(code: string, basePath: string, args: CliOptions) {
  try {
    // Log verbose
    if (args.verbose || args.debug) {
      console.log(`📄 Executing code...`);
      console.log('');
    }
    
    // Lexer
    if (args.debug) console.log('🔤 Tokenizing...');
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    if (args.debug) console.log(`✅ Generated ${tokens.length} tokens`);
    
    // Parser
    if (args.debug) console.log('🌳 Parsing...');
    const parser = new Parser(tokens);
    const program = parser.parse();
    if (args.debug) console.log('✅ AST generated successfully');
    
    const moduleSystem = new ModuleSystem(basePath);
    
    // Carregar módulos std se necessário
    if (args.debug) console.log('📦 Loading modules...');
    loadStdModules(moduleSystem);
    
    // Interpreter
    if (args.debug) console.log('⚡ Executing...\n');
    const interpreter = new Interpreter();
    interpreter.interpret(program);
  } catch (error: any) {
    handleError(error, args);
    process.exit(1);
  }
}

function handleError(error: any, args: CliOptions) {
  if (error instanceof TrestError) {
    console.error(error.format());
  } else {
    console.error('❌ Error:', error.message);
    
    if (args.strict || args.debug) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    
    if (args.debug) {
      console.error('\nDebug info:');
      console.error('Error type:', error.constructor.name);
      if (error.code) {
        console.error('Error code:', error.code);
      }
    }
  }
}

function showUsage() {
  console.log(`Trest Language v${VERSION}`);
  console.log('');
  console.log('Usage: trest <файл.trest> [опции]');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h              Show help');
  console.log('  --version, -v           Show version');
  console.log('  --update, -u            Update to latest version');
  console.log('  -e, --execute           Execute code inline');
  console.log('  --strict                Strict mode');
  console.log('  --verbose, -V           Verbose output');
  console.log('  --debug, -d             Debug mode');
  console.log('');
  console.log('Examples:');
  console.log('  trest программа.trest');
  console.log('  trest exemplos/hello_cyrillic.trest');
  console.log('  trest script.trest --verbose');
  console.log('  trest -e "печать(\'Olá\')"          # Execute inline');
  console.log('  trest --update                      # Update to latest');
  console.log('');
  console.log('Compilation:');
  console.log('  trestc программа.trest --mode web');
  console.log('  trestc программа.trest --mode exe');
}

function showHelp() {
  console.log(`
Trest Language v${VERSION} - Interpreter

Usage:
  trest <файл.trest> [опции]

Options:
  --help, -h         Show this help message
  --version, -v      Show version number
  --update, -u       Check and update to latest version from NPM
  -e, --execute      Execute code inline (без файла)
  --strict           Strict mode (show stack trace on errors)
  --verbose, -V      Verbose output
  --debug, -d        Debug mode (detailed execution info)

Examples:
  trest программа.trest
  trest exemplos/hello_cyrillic.trest --strict
  trest script.trest --verbose
  trest program.trest --debug
  trest -e "печать('Olá, Mundo')"
  trest -e "пусть x = 10; печать(x)"
  trest --update

Compilation:
  trestc программа.trest --mode web    # Compile to JavaScript
  trestc программа.trest --mode exe    # Compile to executable

Update:
  trest --update     # Automatically check and update from NPM

For more information visit: https://trest-site.vercel.app
`);
}

function loadStdModules(moduleSystem: ModuleSystem): void {
  // Загрузка стандартных модулей при необходимости
  // Пока интерпретатор управляет этим внутренне
}

main();

