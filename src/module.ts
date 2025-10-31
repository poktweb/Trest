import * as fs from 'fs';
import * as path from 'path';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { Program } from './ast';
import { ImportError } from './errors';

export interface Module {
  path: string;
  name: string;
  ast: Program;
  exports: Map<string, any>;
  dependencies: string[];
}

export class ModuleSystem {
  private modules: Map<string, Module> = new Map();
  private basePath: string;

  constructor(basePath: string = process.cwd()) {
    this.basePath = basePath;
  }

  public resolveModule(importPath: string, fromPath?: string): string {
    // Resolve caminho relativo
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      if (!fromPath) {
        throw new ImportError(
          `Não é possível resolver caminho relativo sem arquivo de origem`,
          0,
          0
        );
      }
      const dir = path.dirname(fromPath);
      const resolved = path.resolve(dir, importPath);
      return this.normalizePath(resolved);
    }

    // Resolve módulo absoluto ou da std
    if (importPath.startsWith('std/')) {
      const stdPath = path.join(__dirname, 'std', importPath.slice(4));
      return this.normalizePath(stdPath);
    }

    // Resolve do node_modules ou caminho absoluto
    return this.normalizePath(path.resolve(this.basePath, importPath));
  }

  private normalizePath(filePath: string): string {
    // Tenta com extensão .trest
    if (fs.existsSync(filePath + '.trest')) {
      return filePath + '.trest';
    }
    // Tenta sem extensão
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    // Tenta como diretório com index.trest
    const indexPath = path.join(filePath, 'index.trest');
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
    return filePath;
  }

  public loadModule(modulePath: string, fromPath?: string): Module {
    const resolved = this.resolveModule(modulePath, fromPath);

    if (this.modules.has(resolved)) {
      return this.modules.get(resolved)!;
    }

    if (!fs.existsSync(resolved)) {
      throw new ImportError(
        `Módulo não encontrado: ${modulePath} (resolvido para: ${resolved})`,
        0,
        0
      );
    }

    const source = fs.readFileSync(resolved, 'utf-8');
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const module: Module = {
      path: resolved,
      name: path.basename(resolved, '.trest'),
      ast,
      exports: new Map(),
      dependencies: [],
    };

    this.modules.set(resolved, module);
    return module;
  }

  public getModule(modulePath: string): Module | undefined {
    return this.modules.get(modulePath);
  }

  public getAllModules(): Module[] {
    return Array.from(this.modules.values());
  }
}

