#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import minimist from 'minimist';
import { WebCompiler } from './compiler/web';
import { ExeCompiler } from './compiler/exe';

const args = minimist(process.argv.slice(2));

async function main() {
  const inputFile = args._[0];
  const outputFile = args.output || args.o;
  const mode = args.mode || args.m || 'run';
  const minify = args.minify !== undefined;

  if (!inputFile) {
    console.error('Erro: Arquivo de entrada não especificado');
    console.log('Uso: trestc <arquivo.trest> [opções]');
    console.log('Opções:');
    console.log('  --mode, -m <run|web|exe>  Modo de compilação (padrão: run)');
    console.log('  --output, -o <arquivo>     Arquivo de saída');
    console.log('  --minify                   Minificar código');
    process.exit(1);
  }

  if (!fs.existsSync(inputFile)) {
    console.error(`Erro: Arquivo não encontrado: ${inputFile}`);
    process.exit(1);
  }

  try {
    switch (mode) {
      case 'web':
        await compileWeb(inputFile, outputFile, { minify });
        break;
      case 'exe':
        await compileExe(inputFile, outputFile, { minify });
        break;
      case 'run':
      default:
        console.log('Modo run: Use "trest <arquivo>" para executar diretamente');
        break;
    }
  } catch (error: any) {
    console.error('Erro:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function compileWeb(inputFile: string, outputFile?: string, options: { minify?: boolean } = {}) {
  const compiler = new WebCompiler(path.dirname(inputFile));
  const jsCode = compiler.compile(inputFile, { minify: options.minify, bundle: true });
  
  const finalOutput = outputFile || inputFile.replace('.trest', '.js');
  fs.writeFileSync(finalOutput, jsCode);
  console.log(`✓ Compilado para JavaScript: ${finalOutput}`);
}

async function compileExe(inputFile: string, outputFile?: string, options: { minify?: boolean } = {}) {
  const compiler = new ExeCompiler(path.dirname(inputFile));
  await compiler.compile(inputFile, outputFile, options);
}

main();

