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
  private basePath: string;

  constructor(basePath: string = process.cwd()) {
    this.moduleSystem = new ModuleSystem(basePath);
    this.basePath = basePath;
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
    // Atualizar basePath para o diretório do arquivo sendo compilado
    this.basePath = path.dirname(path.resolve(filePath));

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
    const asyncKeyword = node.async ? 'async ' : '';
    this.addLine(`${asyncKeyword}function ${node.name}(${params}) {`);
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
    const isPkg = node.isPkg || false;
    
    if (isPkg) {
      // Importação de pacote NPM - usar require() ou import ES6
      for (const spec of node.specifiers) {
        if (spec.imported === '*') {
          const localName = spec.local || '*';
          this.addLine(`const ${localName} = require('${node.source}');`);
        } else {
          const localName = spec.local || spec.imported;
          this.addLine(`const { ${spec.imported}: ${localName} } = require('${node.source}');`);
        }
      }
    } else {
      // Importação de módulo Trest - marcar para bundling
      this.imports.add(node.source);
      this.addLine(`// import ${node.specifiers.map((s: any) => s.local || s.imported).join(', ')} from '${node.source}'`);
    }
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
      case 'FunctionExpression':
        return this.compileFunctionExpression(expr);
      default:
        throw new Error(`Tipo de expressão não suportado: ${(expr as any).type}`);
    }
  }

  private compileBinaryExpression(expr: any): string {
    return `(${this.compileExpression(expr.left)} ${expr.operator} ${this.compileExpression(expr.right)})`;
  }

  private compileUnaryExpression(expr: any): string {
    // Suporte a await
    if (expr.operator === 'await') {
      return `await ${this.compileExpression(expr.argument)}`;
    }
    return `${expr.operator}${this.compileExpression(expr.argument)}`;
  }

  private compileCallExpression(expr: any): string {
    const callee = this.compileExpression(expr.callee);
    const args = expr.arguments.map((arg: Expression) => this.compileExpression(arg)).join(', ');
    
    // Compilar chamadas DOM para JavaScript nativo do navegador
    if (callee.startsWith('DOM.')) {
      return this.compileDOMCall(callee, args);
    }
    
    // Compilar chamadas Style para JavaScript nativo do navegador
    if (callee.startsWith('Style.')) {
      return this.compileStyleCall(callee, args);
    }
    
    return `${callee}(${args})`;
  }

  /**
   * Compila chamadas DOM para JavaScript nativo do navegador
   */
  private compileDOMCall(callee: string, args: string): string {
    const method = callee.replace('DOM.', '');
    
    // Mapear métodos Trest para JavaScript nativo
    const domMap: { [key: string]: string } = {
      'selecionar': 'document.querySelector',
      'select': 'document.querySelector',
      'evento': 'addEventListener',
      'addEvent': 'addEventListener',
      'texto': 'innerText',
      'setText': 'innerText',
      'html': 'innerHTML',
      'setHTML': 'innerHTML',
      'valor': 'value',
      'val': 'value',
      'criar': 'document.createElement',
      'create': 'document.createElement',
      'adicionar': 'appendChild',
      'append': 'appendChild',
      'remover': 'remove',
      'remove': 'remove',
      'atributo': 'getAttribute',
      'getAttr': 'getAttribute',
      'definirАтрибут': 'setAttribute',
      'setAttr': 'setAttribute',
    };
    
    const jsMethod = domMap[method] || method;
    
    // Métodos que retornam propriedades (getters)
    if (['texto', 'setText', 'html', 'setHTML', 'valor', 'val', 'atributo', 'getAttr'].includes(method)) {
      if (args) {
        // Setter: elemento.innerText = valor
        return `${args.split(',')[0]}.${jsMethod} = ${args.split(',')[1] || args.split(',')[0]}`;
      } else {
        // Getter: elemento.innerText
        return `${args}.${jsMethod}`;
      }
    }
    
    // Métodos que são chamadas de função
    if (jsMethod.includes('.')) {
      // document.querySelector, document.createElement
      return `${jsMethod}(${args})`;
    } else {
      // addEventListener, appendChild, etc (métodos de elemento)
      const element = args.split(',')[0];
      const restArgs = args.split(',').slice(1).join(',');
      return `${element}.${jsMethod}(${restArgs})`;
    }
  }

  /**
   * Compila chamadas Style para JavaScript nativo do navegador
   */
  private compileStyleCall(callee: string, args: string): string {
    const method = callee.replace('Style.', '');
    
    // Mapear métodos Trest para JavaScript nativo
    const styleMap: { [key: string]: string } = {
      'carregarCDN': 'loadCDN',
      'loadCDN': 'loadCDN',
      'carregarАрхив': 'loadFile',
      'loadFile': 'loadFile',
      'aplicar': 'apply',
      'apply': 'apply',
      'obter': 'getComputedStyle',
      'get': 'getComputedStyle',
      'definir': 'style',
      'set': 'style',
      'добавитьКласс': 'classList.add',
      'addClass': 'classList.add',
      'удалитьКласс': 'classList.remove',
      'removeClass': 'classList.remove',
      'переключитьКласс': 'classList.toggle',
      'toggleClass': 'classList.toggle',
    };
    
    const jsMethod = styleMap[method] || method;
    
    // Carregar CDN - criar elemento <link>
    if (method === 'carregarCDN' || method === 'loadCDN') {
      return `(function() { const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = ${args}; document.head.appendChild(link); })()`;
    }
    
    // Carregar arquivo - ler CSS do disco e injetar como <style>
    if (method === 'carregарАрхив' || method === 'loadFile') {
      // Extrair o caminho do arquivo do argumento
      const cssPath = this.extractStringFromArgs(args);
      if (cssPath) {
        // Resolver caminho relativo ao arquivo fonte
        const resolvedPath = path.resolve(this.basePath, cssPath);
        
        // Verificar se arquivo existe
        if (fs.existsSync(resolvedPath)) {
          // Ler conteúdo do CSS
          const cssContent = fs.readFileSync(resolvedPath, 'utf-8');
          // Minificar CSS básico (remover espaços extras)
          const minifiedCSS = cssContent
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remover comentários
            .replace(/\s+/g, ' ') // Comprimir espaços
            .replace(/;\s*}/g, ';}') // Remover espaços antes de }
            .replace(/\s*{\s*/g, '{') // Remover espaços em {
            .replace(/\s*:\s*/g, ':') // Remover espaços em :
            .trim();
          
          // Escapar para JavaScript string
          const escapedCSS = minifiedCSS
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r');
          
          // Retornar código que injeta o CSS como <style>
          return `(function() { const style = document.createElement('style'); style.textContent = '${escapedCSS}'; document.head.appendChild(style); })()`;
        } else {
          // Arquivo não encontrado - avisar mas não quebrar
          console.warn(`[Web Compiler] Arquivo CSS não encontrado: ${resolvedPath}`);
          return `(function() { console.warn('CSS file not found: ${cssPath}'); })()`;
        }
      }
      // Fallback para comportamento antigo se não conseguir extrair caminho
      return `(function() { const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = ${args}; document.head.appendChild(link); })()`;
    }
    
    // Aplicar estilos - aplicar objeto de estilos
    if (method === 'aplicar' || method === 'apply') {
      const [element, styles] = args.split(',').map(a => a.trim());
      return `(function() { const el = ${element}; const s = ${styles}; for (const k in s) { el.style[k] = s[k]; } })()`;
    }
    
    // Obter estilo computado
    if (method === 'obter' || method === 'get') {
      const [element, property] = args.split(',').map(a => a.trim());
      return `window.getComputedStyle(${element}).${property}`;
    }
    
    // Definir estilo
    if (method === 'definir' || method === 'set') {
      const [element, property, value] = args.split(',').map(a => a.trim());
      return `${element}.style.${property} = ${value}`;
    }
    
    // Classes CSS
    if (method.includes('classList')) {
      const [element, className] = args.split(',').map(a => a.trim());
      const action = method.includes('add') ? 'add' : method.includes('remove') ? 'remove' : 'toggle';
      return `${element}.classList.${action}(${className})`;
    }
    
    return `Style.${method}(${args})`;
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

  private compileFunctionExpression(expr: any): string {
    const name = expr.name || '';
    const params = expr.params.join(', ');
    const asyncKeyword = expr.async ? 'async ' : '';
    
    // Criar função anônima ou nomeada
    const funcName = name ? `${asyncKeyword}function ${name}` : `${asyncKeyword}function`;
    
    // Compilar o corpo da função em um buffer separado
    const funcBodyBuffer: string[] = [];
    const savedOutput = this.output;
    const savedIndent = this.indentLevel;
    
    // Compilar apenas o conteúdo do bloco (sem as chaves externas)
    this.output = funcBodyBuffer;
    this.indentLevel = 0; // Sem indentação extra, pois será formatado aqui
    
    // Compilar as declarações dentro do bloco
    for (const stmt of expr.body.body) {
      this.compileNode(stmt, false);
    }
    
    // Restaurar output e indent originais
    this.output = savedOutput;
    this.indentLevel = savedIndent;
    
    // Juntar o corpo e adicionar indentação correta
    const bodyLines = funcBodyBuffer.join('').split('\n').filter(line => line.trim().length > 0);
    const indentedBody = bodyLines.map(line => {
      // Remover indentação existente e adicionar indentação correta para função
      const trimmed = line.trim();
      return trimmed ? '    ' + trimmed : '';
    }).join('\n');
    
    // Retornar como string de função (com formatação correta)
    return `${funcName}(${params}) {\n${indentedBody}\n  }`;
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

  /**
   * Extrai string literal dos argumentos (para Style.loadFile)
   */
  private extractStringFromArgs(args: string): string | null {
    // Remover espaços e tentar extrair string
    const trimmed = args.trim();
    // Se começa e termina com aspas simples ou duplas
    if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || 
        (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
      return trimmed.slice(1, -1);
    }
    return null;
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

