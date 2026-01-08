#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import minimist from 'minimist';
import { WebCompiler } from './compiler/web';
import { ExeCompiler } from './compiler/exe';

const VERSION = '2.0.0';

interface CompilerOptions {
  mode?: string;
  m?: string;
  output?: string;
  o?: string;
  minify?: boolean;
  expose?: boolean;
  verbose?: boolean;
  debug?: boolean;
  help?: boolean;
  h?: boolean;
  version?: boolean;
  v?: boolean;
  _: string[];
}

async function main() {
  const args: CompilerOptions = minimist(process.argv.slice(2)) as CompilerOptions;

  // Help
  if (args.help || args.h) {
    showHelp();
    process.exit(0);
  }

  // Version
  if (args.version || args.v) {
    console.log(`Trest Compiler v${VERSION}`);
    process.exit(0);
  }

  const inputFile = args._[0];
  const outputFile = args.output || args.o;
  const mode = args.mode || args.m || 'run';
  const minify = args.minify !== undefined;
  const expose = args.expose !== undefined;

  if (!inputFile) {
    showUsage();
    process.exit(1);
  }

  // Validações
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Error: File not found: ${inputFile}`);
    process.exit(1);
  }

  const fileStats = fs.statSync(inputFile);
  if (!fileStats.isFile()) {
    console.error(`❌ Error: ${inputFile} is not a file`);
    process.exit(1);
  }

  try {
    if (args.verbose || args.debug) {
      console.log(`📄 Compiling: ${inputFile}`);
      console.log(`📊 File size: ${fileStats.size} bytes`);
      console.log(`🎯 Mode: ${mode}`);
      console.log('');
    }

    const startTime = Date.now();

    switch (mode) {
      case 'web':
        await compileWeb(inputFile, outputFile, { minify, expose }, args.verbose || args.debug);
        break;
      case 'exe':
        await compileExe(inputFile, outputFile, { minify }, args.verbose || args.debug);
        break;
      case 'run':
      default:
        console.log('💡 Tip: Use "trest <arquivo>" to run directly');
        process.exit(0);
    }

    const duration = Date.now() - startTime;
    if (args.verbose || args.debug) {
      console.log(`\n✅ Compilation completed in ${duration}ms`);
    }
  } catch (error: any) {
    console.error('❌ Compilation error:', error.message);
    if (args.debug && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

function showUsage() {
  console.log(`Trest Compiler v${VERSION}`);
  console.log('');
  console.log('Usage: trestc <файл.trest> [опции]');
  console.log('');
  console.log('Options:');
  console.log('  --mode, -m <web|exe>   Compilation mode');
  console.log('  --output, -o <файл>    Output file');
  console.log('  --minify               Minify code');
  console.log('  --expose               Expose functions globally (web only)');
  console.log('  --verbose, -V          Verbose output');
  console.log('  --debug, -d            Debug mode');
  console.log('  --help, -h             Show help');
  console.log('  --version, -v          Show version');
  console.log('');
  console.log('Examples:');
  console.log('  trestc program.trest --mode web');
  console.log('  trestc script.trest --mode exe -o app.exe');
}

function showHelp() {
  console.log(`
Trest Compiler v${VERSION}

Usage:
  trestc <файл.trest> [опции]

Compilation Modes:
  web                 Compile to JavaScript
  exe                 Compile to executable (.exe)

Options:
  --mode, -m <mode>   Compilation mode (web or exe)
  --output, -o <file> Output file path
  --minify            Minify output code
  --expose            Expose functions globally (web only)
  --verbose, -V       Verbose output
  --debug, -d         Debug mode
  --help, -h          Show this help message
  --version, -v       Show version number

Examples:
  trestc program.trest --mode web -o app.js
  trestc script.trest --mode exe -o app.exe
  trestc app.trest --mode web --minify --expose

For more information visit: https://trest-site.vercel.app
`);
}

async function compileWeb(
  inputFile: string,
  outputFile: string | undefined,
  options: { minify?: boolean; expose?: boolean } = {},
  verbose = false
) {
  try {
    if (verbose) console.log('🔤 Loading and parsing...');
    
    const compiler = new WebCompiler(path.dirname(inputFile));
    const jsCode = compiler.compile(inputFile, {
      minify: options.minify,
      bundle: true,
      expose: options.expose
    });
    
    const finalOutput = outputFile || inputFile.replace(/\.trest$/, '.js');
    
    if (verbose) {
      console.log(`📝 Writing output: ${finalOutput}`);
      console.log(`📊 Output size: ${jsCode.length} bytes`);
    }
    
    fs.writeFileSync(finalOutput, jsCode);
    console.log(`✅ Compiled to JavaScript: ${finalOutput}`);
  } catch (error: any) {
    throw new Error(`Web compilation failed: ${error.message}`);
  }
}

async function compileExe(
  inputFile: string,
  outputFile: string | undefined,
  options: { minify?: boolean } = {},
  verbose = false
) {
  try {
    if (verbose) console.log('🔧 Building executable...');
    
    const compiler = new ExeCompiler(path.dirname(inputFile));
    await compiler.compile(inputFile, outputFile, options);
    
    const finalOutput = outputFile || inputFile.replace(/\.trest$/, '.exe');
    console.log(`✅ Compiled to executable: ${finalOutput}`);
  } catch (error: any) {
    throw new Error(`Executable compilation failed: ${error.message}`);
  }
}

main();

