#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { Interpreter } from './interpreter';
import { TrestError } from './errors';
import { ModuleSystem } from './module';
import minimist from 'minimist';

const VERSION = '2.0.0';

interface CliOptions {
  help?: boolean;
  h?: boolean;
  version?: boolean;
  v?: boolean;
  strict?: boolean;
  verbose?: boolean;
  debug?: boolean;
  _: string[];
}

function main() {
  const args: CliOptions = minimist(process.argv.slice(2)) as CliOptions;
  
  // Validação de argumentos
  if (args._.length === 0 && !args.help && !args.h && !args.version && !args.v) {
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

  try {
    const startTime = Date.now();
    
    // Ler arquivo
    const code = fs.readFileSync(filePath, 'utf-8');
    
    if (code.length === 0) {
      console.warn('⚠️  Warning: File is empty');
      process.exit(0);
    }
    
    const basePath = path.dirname(filePath);
    
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
    
    const duration = Date.now() - startTime;
    
    if (args.verbose || args.debug) {
      console.log(`\n✅ Execution completed in ${duration}ms`);
    }
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
  console.log('  --strict                Strict mode');
  console.log('  --verbose, -V           Verbose output');
  console.log('  --debug, -d             Debug mode');
  console.log('');
  console.log('Examples:');
  console.log('  trest программа.trest');
  console.log('  trest exemplos/hello_cyrillic.trest');
  console.log('  trest script.trest --verbose');
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
  --strict           Strict mode (show stack trace on errors)
  --verbose, -V      Verbose output
  --debug, -d        Debug mode (detailed execution info)

Examples:
  trest программа.trest
  trest exemplos/hello_cyrillic.trest --strict
  trest script.trest --verbose
  trest program.trest --debug

Compilation:
  trestc программа.trest --mode web    # Compile to JavaScript
  trestc программа.trest --mode exe    # Compile to executable

For more information visit: https://github.com/trest-language/trest
`);
}

function loadStdModules(moduleSystem: ModuleSystem): void {
  // Загрузка стандартных модулей при необходимости
  // Пока интерпретатор управляет этим внутренне
}

main();

