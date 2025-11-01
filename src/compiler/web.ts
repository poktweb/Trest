import * as fs from 'fs';
import * as path from 'path';
import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { Program, ASTNode, Expression } from '../ast';
import { ModuleSystem } from '../module';

export class WebCompiler {
  private moduleSystem: ModuleSystem;
  private output: string[] = [];
  private indentLevel: number = 0;
  private imports: Set<string> = new Set();

  constructor(basePath: string = process.cwd()) {
    this.moduleSystem = new ModuleSystem(basePath);
  }

  public compile(filePath: string, options: { minify?: boolean; bundle?: boolean; expose?: boolean } = {}): string {
    const source = fs.readFileSync(filePath, 'utf-8');
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const program = parser.parse();

    this.output = [];
    this.imports.clear();
    this.indentLevel = 0;

    if (options.bundle) {
      this.compileProgramBundled(program, filePath, options.expose);
    } else {
      this.compileProgram(program, options.expose);
    }

    let result = this.output.join('');

    if (options.minify) {
      result = this.minify(result);
    }

    return result;
  }

  private compileProgram(program: Program, expose: boolean = false): void {
    if (expose) {
      // Expor funções e variáveis globalmente
      this.addLine('(function(window) {');
      this.indent();
      this.addLine('"use strict";');
    } else {
      this.addLine('(function() {');
      this.indent();
    }
    
    // Compilar declarações
    for (const node of program.body) {
      this.compileNode(node, expose);
    }

    if (expose) {
      // Expor funções e variáveis globais
      this.addLine('');
      this.addLine('// Expor funções e variáveis globais');
      for (const node of program.body) {
        if (node.type === 'FunctionDeclaration') {
          const funcName = (node as any).name;
          this.addLine(`window.${funcName} = ${funcName};`);
        } else if (node.type === 'VariableDeclaration' && !(node as any).value) {
          // Variáveis globais (sem valor inicial)
          const varName = (node as any).name;
          this.addLine(`window.${varName} = ${varName};`);
        }
      }
      this.dedent();
      this.addLine('})(typeof window !== "undefined" ? window : global);');
    } else {
      this.dedent();
      this.addLine('})();');
    }
  }

  private compileProgramBundled(program: Program, mainPath: string, expose: boolean = false): void {
    // Adicionar imports
    if (this.imports.size > 0) {
      for (const imp of this.imports) {
        this.addLine(`// Import: ${imp}`);
      }
      this.addLine('');
    }

    if (expose) {
      this.addLine('(function(window) {');
      this.indent();
      this.addLine('"use strict";');
    } else {
      this.addLine('(function() {');
      this.indent();
    }
    
    // Compilar módulos dependentes primeiro
    // TODO: Implementar resolução de dependências
    
    // Compilar programa principal
    for (const node of program.body) {
      this.compileNode(node, expose);
    }

    if (expose) {
      // Expor funções e variáveis globais
      this.addLine('');
      this.addLine('// Expor funções e variáveis globais');
      for (const node of program.body) {
        if (node.type === 'FunctionDeclaration') {
          const funcName = (node as any).name;
          this.addLine(`window.${funcName} = ${funcName};`);
        } else if (node.type === 'VariableDeclaration') {
          const varName = (node as any).name;
          this.addLine(`window.${varName} = ${varName};`);
        }
      }
      this.dedent();
      this.addLine('})(typeof window !== "undefined" ? window : global);');
    } else {
      this.dedent();
      this.addLine('})();');
    }
  }

  private compileNode(node: ASTNode, expose: boolean = false): void {
    switch (node.type) {
      case 'VariableDeclaration':
        this.compileVariableDeclaration(node);
        break;
      case 'FunctionDeclaration':
        this.compileFunctionDeclaration(node);
        break;
      case 'BlockStatement':
        this.compileBlockStatement(node, expose);
        break;
      case 'IfStatement':
        this.compileIfStatement(node);
        break;
      case 'WhileStatement':
        this.compileWhileStatement(node);
        break;
      case 'ForStatement':
        this.compileForStatement(node);
        break;
      case 'ReturnStatement':
        this.compileReturnStatement(node);
        break;
      case 'PrintStatement':
        this.compilePrintStatement(node);
        break;
      case 'ExpressionStatement':
        this.compileExpressionStatement(node);
        break;
      case 'ImportStatement':
        this.compileImportStatement(node);
        break;
      case 'BreakStatement':
        this.addLine('break;');
        break;
      case 'ContinueStatement':
        this.addLine('continue;');
        break;
      case 'TryStatement':
        this.compileTryStatement(node);
        break;
      case 'ThrowStatement':
        this.compileThrowStatement(node);
        break;
      default:
        throw new Error(`Tipo de nó não suportado: ${(node as any).type}`);
    }
  }

  private compileVariableDeclaration(node: any): void {
    const kind = node.kind === 'const' ? 'const' : node.kind === 'let' ? 'let' : 'var';
    let code = `${kind} ${node.name}`;
    if (node.value) {
      code += ` = ${this.compileExpression(node.value)}`;
    }
    this.addLine(code + ';');
  }

  private compileFunctionDeclaration(node: any): void {
    const params = node.params.join(', ');
    this.addLine(`function ${node.name}(${params}) {`);
    this.indent();
    this.compileBlockStatement(node.body);
    this.dedent();
    this.addLine('}');
  }

  private compileBlockStatement(node: any, expose: boolean = false): void {
    this.addLine('{');
    this.indent();
    for (const stmt of node.body) {
      this.compileNode(stmt, expose);
    }
    this.dedent();
    this.addLine('}');
  }

  private compileIfStatement(node: any): void {
    this.addLine(`if (${this.compileExpression(node.condition)}) {`);
    this.indent();
    this.compileBlockStatement(node.consequent);
    this.dedent();
    if (node.alternate) {
      this.addLine('} else {');
      this.indent();
      if (node.alternate.type === 'BlockStatement') {
        this.compileBlockStatement(node.alternate);
      } else {
        this.compileIfStatement(node.alternate);
      }
      this.dedent();
    }
    this.addLine('}');
  }

  private compileWhileStatement(node: any): void {
    this.addLine(`while (${this.compileExpression(node.condition)}) {`);
    this.indent();
    this.compileBlockStatement(node.body);
    this.dedent();
    this.addLine('}');
  }

  private compileForStatement(node: any): void {
    let init = '';
    if (node.init) {
      if (node.init.type === 'VariableDeclaration') {
        init = this.compileVariableDeclarationInline(node.init);
      } else {
        init = this.compileExpression(node.init.expression);
      }
    }

    const condition = node.condition ? this.compileExpression(node.condition) : '';
    const update = node.update ? this.compileExpression(node.update) : '';

    this.addLine(`for (${init}; ${condition}; ${update}) {`);
    this.indent();
    this.compileBlockStatement(node.body);
    this.dedent();
    this.addLine('}');
  }

  private compileVariableDeclarationInline(node: any): string {
    const kind = node.kind === 'const' ? 'const' : node.kind === 'let' ? 'let' : 'var';
    let code = `${kind} ${node.name}`;
    if (node.value) {
      code += ` = ${this.compileExpression(node.value)}`;
    }
    return code;
  }

  private compileReturnStatement(node: any): void {
    if (node.argument) {
      this.addLine(`return ${this.compileExpression(node.argument)};`);
    } else {
      this.addLine('return;');
    }
  }

  private compilePrintStatement(node: any): void {
    const args = node.arguments.map((arg: Expression) => this.compileExpression(arg)).join(', ');
    this.addLine(`console.log(${args});`);
  }

  private compileExpressionStatement(node: any): void {
    this.addLine(`${this.compileExpression(node.expression)};`);
  }

  private compileImportStatement(node: any): void {
    // Marcar como importado para bundling
    this.imports.add(node.source);
    // Em compilação web, imports podem ser convertidos para require ou import ES6
    this.addLine(`// import ${node.specifiers.map((s: any) => s.local || s.imported).join(', ')} from '${node.source}'`);
  }

  private compileTryStatement(node: any): void {
    this.addLine('try {');
    this.indent();
    this.compileBlockStatement(node.block);
    this.dedent();
    if (node.handler) {
      const param = node.handler.param || 'error';
      this.addLine(`} catch (${param}) {`);
      this.indent();
      this.compileBlockStatement(node.handler.body);
      this.dedent();
    }
    if (node.finalizer) {
      this.addLine('} finally {');
      this.indent();
      this.compileBlockStatement(node.finalizer);
      this.dedent();
    }
    this.addLine('}');
  }

  private compileThrowStatement(node: any): void {
    this.addLine(`throw ${this.compileExpression(node.argument)};`);
  }

  private compileExpression(expr: Expression): string {
    switch (expr.type) {
      case 'Identifier':
        return (expr as any).name;
      case 'Literal':
        return this.formatLiteral((expr as any).value);
      case 'BinaryExpression':
        return this.compileBinaryExpression(expr);
      case 'UnaryExpression':
        return this.compileUnaryExpression(expr);
      case 'CallExpression':
        return this.compileCallExpression(expr);
      case 'AssignmentExpression':
        return this.compileAssignmentExpression(expr);
      case 'ArrayLiteral':
        return this.compileArrayLiteral(expr);
      case 'IndexExpression':
        return this.compileIndexExpression(expr);
      case 'ObjectLiteral':
        return this.compileObjectLiteral(expr);
      case 'MemberExpression':
        return this.compileMemberExpression(expr);
      default:
        throw new Error(`Tipo de expressão não suportado: ${(expr as any).type}`);
    }
  }

  private compileBinaryExpression(expr: any): string {
    return `(${this.compileExpression(expr.left)} ${expr.operator} ${this.compileExpression(expr.right)})`;
  }

  private compileUnaryExpression(expr: any): string {
    return `${expr.operator}${this.compileExpression(expr.argument)}`;
  }

  private compileCallExpression(expr: any): string {
    const callee = this.compileExpression(expr.callee);
    const args = expr.arguments.map((arg: Expression) => this.compileExpression(arg)).join(', ');
    return `${callee}(${args})`;
  }

  private compileAssignmentExpression(expr: any): string {
    const left = this.compileExpression(expr.left);
    const right = this.compileExpression(expr.right);
    return `${left} = ${right}`;
  }

  private compileArrayLiteral(expr: any): string {
    const elements = expr.elements.map((el: Expression) => this.compileExpression(el)).join(', ');
    return `[${elements}]`;
  }

  private compileIndexExpression(expr: any): string {
    return `${this.compileExpression(expr.object)}[${this.compileExpression(expr.index)}]`;
  }

  private compileObjectLiteral(expr: any): string {
    const props = expr.properties.map((p: any) => {
      const key = p.computed ? `[${this.compileExpression(p.key)}]` : p.key;
      return `${key}: ${this.compileExpression(p.value)}`;
    }).join(', ');
    return `{${props}}`;
  }

  private compileMemberExpression(expr: any): string {
    const obj = this.compileExpression(expr.object);
    const prop = expr.computed 
      ? `[${this.compileExpression(expr.property)}]` 
      : `.${expr.property}`;
    return `${obj}${prop}`;
  }

  private formatLiteral(value: any): string {
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'string') return JSON.stringify(value);
    return String(value);
  }

  private addLine(line: string): void {
    const indent = '  '.repeat(this.indentLevel);
    this.output.push(indent + line + '\n');
  }

  private indent(): void {
    this.indentLevel++;
  }

  private dedent(): void {
    this.indentLevel--;
  }

  private minify(code: string): string {
    // Minificação básica
    return code
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, ';}')
      .replace(/{\s+/g, '{')
      .replace(/\s+}/g, '}')
      .trim();
  }
}

