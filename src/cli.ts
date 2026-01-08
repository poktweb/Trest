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
    
    // Ler arquivo
    const code = fs.readFileSync(filePath, 'utf-8');
    
    if (code.length === 0) {
      console.warn('⚠️  Warning: File is empty');
      process.exit(0);
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

