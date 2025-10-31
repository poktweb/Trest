#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { Interpreter } from './interpreter';
import { TrestError } from './errors';
import { ModuleSystem } from './module';
import minimist from 'minimist';

function main() {
  const args = minimist(process.argv.slice(2));
  
  if (args._.length === 0 && !args.help && !args.h) {
    console.log('Trest Language v2.0.0');
    console.log('');
    console.log('Использование: trest <файл.trest> [опции]');
    console.log('');
    console.log('Опции:');
    console.log('  --help, -h              Показать помощь');
    console.log('  --version, -v          Показать версию');
    console.log('  --strict               Строгий режим');
    console.log('');
    console.log('Пример:');
    console.log('  trest программа.trest');
    console.log('  trest exemplos/hello_cyrillic.trest');
    console.log('');
    console.log('Для компиляции:');
    console.log('  trestc программа.trest --mode web');
    console.log('  trestc программа.trest --mode exe');
    process.exit(1);
  }

  if (args.help || args.h) {
    showHelp();
    process.exit(0);
  }

  if (args.version || args.v) {
    console.log('Trest Language v2.0.0');
    process.exit(0);
  }

  const filePath = args._[0];

  if (!fs.existsSync(filePath)) {
    console.error(`Ошибка: Файл не найден: ${filePath}`);
    process.exit(1);
  }

  try {
    const code = fs.readFileSync(filePath, 'utf-8');
    const basePath = path.dirname(filePath);
    
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    
    const parser = new Parser(tokens);
    const program = parser.parse();
    
    const moduleSystem = new ModuleSystem(basePath);
    
    // Carregar módulos std se necessário
    loadStdModules(moduleSystem);
    
    const interpreter = new Interpreter();
    interpreter.interpret(program);
  } catch (error: any) {
    if (error instanceof TrestError) {
      console.error(error.format());
    } else {
      console.error('Erro:', error.message);
      if (args.strict && error.stack) {
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
Trest Language - Интерпретатор

Использование:
  trest <файл.trest> [опции]

Опции:
  --help, -h         Показать эту помощь
  --version, -v      Показать версию
  --strict           Строгий режим (показать stack trace)

Примеры:
  trest программа.trest
  trest exemplos/hello_cyrillic.trest --strict

Компиляция:
  trestc программа.trest --mode web    # Компилировать в JavaScript
  trestc программа.trest --mode exe    # Компилировать в исполняемый файл
`);
}

function loadStdModules(moduleSystem: ModuleSystem): void {
  // Загрузка стандартных модулей при необходимости
  // Пока интерпретатор управляет этим внутренне
}

main();

