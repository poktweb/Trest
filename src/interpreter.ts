import {
  ASTNode,
  Program,
  VariableDeclaration,
  FunctionDeclaration,
  ClassDeclaration,
  ForOfStatement,
  ForInStatement,
  BlockStatement,
  IfStatement,
  SwitchStatement,
  CaseClause,
  WhileStatement,
  ForStatement,
  ReturnStatement,
  ExpressionStatement,
  PrintStatement,
  Expression,
  AssignmentExpression,
  BinaryExpression,
  UnaryExpression,
  TernaryExpression,
  CallExpression,
  NewExpression,
  FunctionExpression,
  Identifier,
  Literal,
  ArrayLiteral,
  IndexExpression,
  MemberExpression,
} from './ast';
import { StdModules } from './std-native';
import * as fs from 'fs';
import * as path from 'path';
import { Lexer } from './lexer';
import { Parser } from './parser';

type RuntimeValue =
  | number
  | string
  | boolean
  | null
  | undefined
  | RuntimeValue[]
  | FunctionValue
  | { [key: string]: RuntimeValue | ((...args: any[]) => any) }
  | ((...args: any[]) => any);

interface FunctionValue {
  type: 'function';
  name: string;
  params: string[];
  body: BlockStatement;
  closure: Environment;
}

interface ClassValue {
  type: 'class';
  name: string;
  superClass?: ClassValue;
  methods: Map<string, FunctionValue>;
  constructor?: FunctionValue;
}

interface Environment {
  variables: Map<string, RuntimeValue>;
  functions: Map<string, FunctionValue>;
  classes: Map<string, ClassValue>;
  constants: Set<string>; // Track constant variables
  parent?: Environment;
}

export class Interpreter {
  private globalEnv: Environment;

  constructor() {
    this.globalEnv = {
      variables: new Map(),
      functions: new Map(),
      classes: new Map(),
      constants: new Set(),
    };
    
    // Registrar objetos globais JavaScript
    this.registerGlobalObjects();
    
    // Registrar módulos nativos
    this.registerNativeModules();
  }

  /**
   * Registra objetos globais JavaScript (Array, Object, etc.)
   */
  private registerGlobalObjects(): void {
    // Array global
    this.globalEnv.variables.set('Array', {
      isArray: Array.isArray.bind(Array),
      from: Array.from.bind(Array),
      of: Array.of.bind(Array),
    });

    // Object global
    this.globalEnv.variables.set('Object', {
      keys: Object.keys.bind(Object),
      values: Object.values.bind(Object),
      entries: Object.entries.bind(Object),
      assign: Object.assign.bind(Object),
    });

    // typeof function
    this.globalEnv.variables.set('typeof', (value: any) => {
      if (value === null) return 'null';
      if (Array.isArray(value)) return 'array';
      return typeof value;
    });

    // null e undefined
    this.globalEnv.variables.set('null', null);
    this.globalEnv.variables.set('нуль', null);
    this.globalEnv.variables.set('undefined', undefined);
    this.globalEnv.variables.set('неопределен', undefined);
  }

  /**
   * Registra módulos nativos na runtime
   */
  private registerNativeModules(): void {
    // HTTP Module
    this.globalEnv.variables.set('HTTP', {
      GET: StdModules.HTTP.GET.bind(StdModules.HTTP),
      POST: StdModules.HTTP.POST.bind(StdModules.HTTP),
      PUT: StdModules.HTTP.PUT.bind(StdModules.HTTP),
      DELETE: StdModules.HTTP.DELETE.bind(StdModules.HTTP),
      создатьСервер: StdModules.HTTP.createServer.bind(StdModules.HTTP),
      fetch: StdModules.HTTP.fetch.bind(StdModules.HTTP),
    });

    // Async Module
    this.globalEnv.variables.set('Async', {
      создатьОбещание: StdModules.Async.createPromise.bind(StdModules.Async),
      всеОбещания: StdModules.Async.allPromises.bind(StdModules.Async),
      любоеОбещание: StdModules.Async.anyPromise.bind(StdModules.Async),
      отложить: StdModules.Async.delay.bind(StdModules.Async),
      повторятьИнтервал: StdModules.Async.repeatInterval.bind(StdModules.Async),
      очиститьПовторение: StdModules.Async.clearRepeat.bind(StdModules.Async),
    });

    // GUI Module
    this.globalEnv.variables.set('GUI', {
      создатьТерминал: StdModules.GUI.createTerminal.bind(StdModules.GUI),
      создатьОкно: StdModules.GUI.createWindow.bind(StdModules.GUI),
      создатьКнопку: StdModules.GUI.createButton.bind(StdModules.GUI),
      создатьТекст: StdModules.GUI.createText.bind(StdModules.GUI),
      создатьСписок: StdModules.GUI.createList.bind(StdModules.GUI),
    });

    // Database Module
    this.globalEnv.variables.set('DB', {
      открытьБД: StdModules.Database.openDB.bind(StdModules.Database),
      openDB: StdModules.Database.openDB.bind(StdModules.Database),
      открытьSQLite: StdModules.Database.openSQLite.bind(StdModules.Database),
      openSQLite: StdModules.Database.openSQLite.bind(StdModules.Database),
      открытьMySQL: StdModules.Database.openMySQL.bind(StdModules.Database),
      openMySQL: StdModules.Database.openMySQL.bind(StdModules.Database),
      открытьPostgreSQL: StdModules.Database.openPostgreSQL.bind(StdModules.Database),
      openPostgreSQL: StdModules.Database.openPostgreSQL.bind(StdModules.Database),
      создательЗапросов: StdModules.Database.createQueryBuilder.bind(StdModules.Database),
      createQueryBuilder: StdModules.Database.createQueryBuilder.bind(StdModules.Database),
      Модель: StdModules.Database.Model.bind(StdModules.Database),
      Model: StdModules.Database.Model.bind(StdModules.Database),
    });

    // FileSystem Module
    this.globalEnv.variables.set('FileSystem', {
      читатьФайл: StdModules.FileSystem.readFile.bind(StdModules.FileSystem),
      readFile: StdModules.FileSystem.readFile.bind(StdModules.FileSystem),
      писатьФайл: StdModules.FileSystem.writeFile.bind(StdModules.FileSystem),
      writeFile: StdModules.FileSystem.writeFile.bind(StdModules.FileSystem),
      существует: StdModules.FileSystem.exists.bind(StdModules.FileSystem),
      exists: StdModules.FileSystem.exists.bind(StdModules.FileSystem),
      удалитьФайл: StdModules.FileSystem.deleteFile.bind(StdModules.FileSystem),
      deleteFile: StdModules.FileSystem.deleteFile.bind(StdModules.FileSystem),
      списокДиректорий: StdModules.FileSystem.listDir.bind(StdModules.FileSystem),
      listDir: StdModules.FileSystem.listDir.bind(StdModules.FileSystem),
      createDir: StdModules.FileSystem.createDir.bind(StdModules.FileSystem),
      deleteDir: StdModules.FileSystem.deleteDir.bind(StdModules.FileSystem),
      getStats: StdModules.FileSystem.getStats.bind(StdModules.FileSystem),
    });

    // JSON Module
    this.globalEnv.variables.set('JSON', {
      parse: StdModules.JSON.parse.bind(StdModules.JSON),
      stringify: StdModules.JSON.stringify.bind(StdModules.JSON),
    });

    // Date Module
    this.globalEnv.variables.set('Date', {
      теперь: StdModules.Date.now.bind(StdModules.Date),
      timestamp: StdModules.Date.timestamp.bind(StdModules.Date),
      формат: StdModules.Date.format.bind(StdModules.Date),
      timezone: StdModules.Date.timezone.bind(StdModules.Date),
    });

    // Crypto Module
    this.globalEnv.variables.set('Crypto', {
      md5: StdModules.Crypto.md5.bind(StdModules.Crypto),
      sha256: StdModules.Crypto.sha256.bind(StdModules.Crypto),
      sha512: StdModules.Crypto.sha512.bind(StdModules.Crypto),
      случайныеБайты: StdModules.Crypto.randomBytes.bind(StdModules.Crypto),
      randomBytes: StdModules.Crypto.randomBytes.bind(StdModules.Crypto),
      зашифровать: StdModules.Crypto.encrypt.bind(StdModules.Crypto),
      encrypt: StdModules.Crypto.encrypt.bind(StdModules.Crypto),
      расшифровать: StdModules.Crypto.decrypt.bind(StdModules.Crypto),
      decrypt: StdModules.Crypto.decrypt.bind(StdModules.Crypto),
    });

    // RegEx Module
    this.globalEnv.variables.set('RegEx', {
      создать: StdModules.RegEx.create.bind(StdModules.RegEx),
      тест: StdModules.RegEx.test.bind(StdModules.RegEx),
      соответствие: StdModules.RegEx.match.bind(StdModules.RegEx),
      найтиВсе: StdModules.RegEx.findAll.bind(StdModules.RegEx),
      заменить: StdModules.RegEx.replace.bind(StdModules.RegEx),
      разделить: StdModules.RegEx.split.bind(StdModules.RegEx),
    });

    // Path Module
    this.globalEnv.variables.set('Path', {
      соединить: StdModules.Path.join.bind(StdModules.Path),
      решить: StdModules.Path.resolve.bind(StdModules.Path),
      директория: StdModules.Path.dirname.bind(StdModules.Path),
      базовоеИмя: StdModules.Path.basename.bind(StdModules.Path),
      расширение: StdModules.Path.extname.bind(StdModules.Path),
      нормализовать: StdModules.Path.normalize.bind(StdModules.Path),
      абсолютный: StdModules.Path.isAbsolute.bind(StdModules.Path),
      относительный: StdModules.Path.relative.bind(StdModules.Path),
      cwd: StdModules.Path.resolve.bind(StdModules.Path, '.'),
    });

    // Process Module
    this.globalEnv.variables.set('Process', {
      получитьEnv: StdModules.Process.getEnv.bind(StdModules.Process),
      всеEnv: StdModules.Process.getAllEnv.bind(StdModules.Process),
      установитьEnv: StdModules.Process.setEnv.bind(StdModules.Process),
      платформа: StdModules.Process.platform,
      архитектура: StdModules.Process.arch,
      версия: StdModules.Process.version,
      cwd: StdModules.Process.cwd,
      изменитьDir: StdModules.Process.chdir.bind(StdModules.Process),
      выход: StdModules.Process.exit.bind(StdModules.Process),
      pid: StdModules.Process.pid,
    });

    // IO Module
    this.globalEnv.variables.set('IO', {
      читать: StdModules.IO.read.bind(StdModules.IO),
      печать: StdModules.IO.print.bind(StdModules.IO),
      печатьВстроенный: StdModules.IO.printInline.bind(StdModules.IO),
    });

    // DOM Module
    this.globalEnv.variables.set('DOM', {
      selecionar: StdModules.DOM.selecionar.bind(StdModules.DOM),
      select: StdModules.DOM.select.bind(StdModules.DOM),
      evento: StdModules.DOM.evento.bind(StdModules.DOM),
      addEvent: StdModules.DOM.addEvent.bind(StdModules.DOM),
      texto: StdModules.DOM.texto.bind(StdModules.DOM),
      setText: StdModules.DOM.setText.bind(StdModules.DOM),
      html: StdModules.DOM.html.bind(StdModules.DOM),
      setHTML: StdModules.DOM.setHTML.bind(StdModules.DOM),
      valor: StdModules.DOM.valor.bind(StdModules.DOM),
      val: StdModules.DOM.val.bind(StdModules.DOM),
      criar: StdModules.DOM.criar.bind(StdModules.DOM),
      create: StdModules.DOM.create.bind(StdModules.DOM),
      adicionar: StdModules.DOM.adicionar.bind(StdModules.DOM),
      append: StdModules.DOM.append.bind(StdModules.DOM),
      remover: StdModules.DOM.remover.bind(StdModules.DOM),
      remove: StdModules.DOM.remove.bind(StdModules.DOM),
      atributo: StdModules.DOM.atributo.bind(StdModules.DOM),
      getAttr: StdModules.DOM.getAttr.bind(StdModules.DOM),
      definirАтрибут: StdModules.DOM.definirАтрибут.bind(StdModules.DOM),
      setAttr: StdModules.DOM.setAttr.bind(StdModules.DOM),
    });

    // Style Module
    this.globalEnv.variables.set('Style', {
      carregarCDN: StdModules.Style.carregarCDN.bind(StdModules.Style),
      loadCDN: StdModules.Style.loadCDN.bind(StdModules.Style),
      carregarАрхив: StdModules.Style.carregarАрхив.bind(StdModules.Style),
      loadFile: StdModules.Style.loadFile.bind(StdModules.Style),
      aplicar: StdModules.Style.aplicar.bind(StdModules.Style),
      apply: StdModules.Style.apply.bind(StdModules.Style),
      obter: StdModules.Style.obter.bind(StdModules.Style),
      get: StdModules.Style.get.bind(StdModules.Style),
      definir: StdModules.Style.definir.bind(StdModules.Style),
      set: StdModules.Style.set.bind(StdModules.Style),
      добавитьКласс: StdModules.Style.добавитьКласс.bind(StdModules.Style),
      addClass: StdModules.Style.addClass.bind(StdModules.Style),
      удалитьКласс: StdModules.Style.удалитьКласс.bind(StdModules.Style),
      removeClass: StdModules.Style.removeClass.bind(StdModules.Style),
      переключитьКласс: StdModules.Style.переключитьКласс.bind(StdModules.Style),
      toggleClass: StdModules.Style.toggleClass.bind(StdModules.Style),
    });

    // Test Module
    this.globalEnv.variables.set('Test', {
      descrever: StdModules.Test.descrever.bind(StdModules.Test),
      describe: StdModules.Test.describe.bind(StdModules.Test),
      afirmar: StdModules.Test.afirmar.bind(StdModules.Test),
      assert: StdModules.Test.assert.bind(StdModules.Test),
      igual: StdModules.Test.igual.bind(StdModules.Test),
      equal: StdModules.Test.equal.bind(StdModules.Test),
      verdadeiro: StdModules.Test.verdadeiro.bind(StdModules.Test),
      isTrue: StdModules.Test.isTrue.bind(StdModules.Test),
      ложь: StdModules.Test.ложь.bind(StdModules.Test),
      isFalse: StdModules.Test.isFalse.bind(StdModules.Test),
      выполнить: StdModules.Test.выполнить.bind(StdModules.Test),
      run: StdModules.Test.run.bind(StdModules.Test),
    });
  }

  public interpret(program: Program): void {
    for (const statement of program.body) {
      this.evaluateStatement(statement, this.globalEnv);
    }
  }

  private evaluateStatement(
    statement: ASTNode,
    env: Environment
  ): RuntimeValue | null {
    switch (statement.type) {
      case 'VariableDeclaration':
        return this.evaluateVariableDeclaration(
          statement as VariableDeclaration,
          env
        );
      case 'FunctionDeclaration':
        return this.evaluateFunctionDeclaration(
          statement as FunctionDeclaration,
          env
        );
      case 'BlockStatement':
        return this.evaluateBlockStatement(statement as BlockStatement, env);
      case 'IfStatement':
        return this.evaluateIfStatement(statement as IfStatement, env);
      case 'SwitchStatement':
        return this.evaluateSwitchStatement(statement as SwitchStatement, env);
      case 'WhileStatement':
        return this.evaluateWhileStatement(statement as WhileStatement, env);
      case 'ForStatement':
        return this.evaluateForStatement(statement as ForStatement, env);
      case 'ForOfStatement':
        return this.evaluateForOfStatement(statement as ForOfStatement, env);
      case 'ForInStatement':
        return this.evaluateForInStatement(statement as ForInStatement, env);
      case 'ClassDeclaration':
        return this.evaluateClassDeclaration(statement as ClassDeclaration, env);
      case 'ReturnStatement':
        return this.evaluateReturnStatement(statement as ReturnStatement, env);
      case 'PrintStatement':
        return this.evaluatePrintStatement(statement as PrintStatement, env);
      case 'ExpressionStatement':
        return this.evaluateExpression(
          (statement as ExpressionStatement).expression,
          env
        );
      case 'BreakStatement':
        return { type: 'break' } as any;
      case 'ContinueStatement':
        return { type: 'continue' } as any;
      case 'TryStatement':
        return this.evaluateTryStatement(statement as any, env);
      case 'ThrowStatement':
        return this.evaluateThrowStatement(statement as any, env);
      case 'ImportStatement':
        return this.evaluateImportStatement(statement as any, env);
      case 'ExportStatement':
        // Para o interpreter, avaliamos a declaração normalmente
        // A declaração já é capturada pelo loadTrestModule
        const exportDecl = (statement as any).declaration;
        if (exportDecl) {
          this.evaluateStatement(exportDecl, env);
        }
        return null;
      default:
        throw new Error(`Tipo de declaração não suportado: ${(statement as any).type}`);
    }
  }

  private evaluateVariableDeclaration(
    decl: VariableDeclaration,
    env: Environment
  ): null {
    const name = decl.name;
    let value: RuntimeValue = null;

    if (decl.value) {
      value = this.evaluateExpression(decl.value, env);
    }

    // Verificar se está tentando reatribuir uma constante
    if (env.constants.has(name)) {
      throw new Error(`Variável constante '${name}' não pode ser reatribuída`);
    }

    // Marcar constantes
    if (decl.kind === 'const') {
      env.constants.add(name);
    }

    env.variables.set(name, value);
    return null;
  }

  private evaluateFunctionDeclaration(
    decl: FunctionDeclaration,
    env: Environment
  ): null {
    const funcValue: FunctionValue = {
      type: 'function',
      name: decl.name,
      params: decl.params,
      body: decl.body,
      closure: env,
    };

    env.functions.set(decl.name, funcValue);
    return null;
  }

  private evaluateBlockStatement(
    block: BlockStatement,
    env: Environment
  ): RuntimeValue | null {
    const newEnv: Environment = {
      variables: new Map(),
      functions: new Map(),
      classes: new Map(),
      constants: new Set(),
      parent: env,
    };

    for (const statement of block.body) {
      const result = this.evaluateStatement(statement, newEnv);
      if (result !== null && this.isReturnValue(result)) {
        return result;
      }
    }

    return null;
  }

  private evaluateIfStatement(
    stmt: IfStatement,
    env: Environment
  ): RuntimeValue | null {
    const condition = this.evaluateExpression(stmt.condition, env);

    if (this.isTruthy(condition)) {
      return this.evaluateBlockStatement(stmt.consequent, env);
    } else if (stmt.alternate) {
      if (stmt.alternate.type === 'IfStatement') {
        return this.evaluateIfStatement(stmt.alternate as IfStatement, env);
      } else {
        return this.evaluateBlockStatement(stmt.alternate, env);
      }
    }

    return null;
  }

  private evaluateSwitchStatement(
    stmt: SwitchStatement,
    env: Environment
  ): RuntimeValue | null {
    const discriminant = this.evaluateExpression(stmt.discriminant, env);
    let matched = false;

    for (const caseClause of stmt.cases) {
      // Se o test é __default__, sempre executa se ainda não matcheu
      if (caseClause.test && (caseClause.test as any).value === '__default__') {
        if (!matched) {
          for (const consequent of caseClause.consequent) {
            const result = this.evaluateStatement(consequent, env);
            if (result !== null) {
              if (this.isReturnValue(result)) {
                return result;
              }
              if ((result as any).type === 'break') {
                return null; // Break sai do switch
              }
            }
          }
        }
      } else {
        const testValue = this.evaluateExpression(caseClause.test, env);
        
        // Se matchou, executa todos os cases seguintes (fall-through)
        if (testValue === discriminant || matched) {
          matched = true;
          for (const consequent of caseClause.consequent) {
            const result = this.evaluateStatement(consequent, env);
            if (result !== null) {
              if (this.isReturnValue(result)) {
                return result;
              }
              if ((result as any).type === 'break') {
                return null; // Break sai do switch
              }
            }
          }
        }
      }
    }

    return null;
  }

  private evaluateReturnStatement(
    stmt: ReturnStatement,
    env: Environment
  ): RuntimeValue {
    const value = stmt.argument
      ? this.evaluateExpression(stmt.argument, env)
      : null;
    return { type: 'return', value } as any;
  }

  private evaluatePrintStatement(
    stmt: PrintStatement,
    env: Environment
  ): null {
    const values = stmt.arguments.map((arg) =>
      this.evaluateExpression(arg, env)
    );
    console.log(...values.map((v) => this.formatValue(v)));
    return null;
  }

  private evaluateExpression(
    expr: Expression,
    env: Environment
  ): RuntimeValue {
    switch (expr.type) {
      case 'AssignmentExpression':
        return this.evaluateAssignment(
          expr as AssignmentExpression,
          env
        );
      case 'BinaryExpression':
        return this.evaluateBinaryExpression(expr as BinaryExpression, env);
      case 'UnaryExpression':
        return this.evaluateUnaryExpression(expr as UnaryExpression, env);
      case 'TernaryExpression':
        return this.evaluateTernaryExpression(expr as TernaryExpression, env);
      case 'CallExpression':
        return this.evaluateCallExpression(expr as CallExpression, env);
      case 'NewExpression':
        return this.evaluateNewExpression(expr as NewExpression, env);
      case 'FunctionExpression':
        return this.evaluateFunctionExpression(expr as FunctionExpression, env);
      case 'Identifier':
        return this.evaluateIdentifier(expr as Identifier, env);
      case 'Literal':
        return (expr as Literal).value as RuntimeValue;
      case 'ArrayLiteral':
        return this.evaluateArrayLiteral(expr as ArrayLiteral, env);
      case 'IndexExpression':
        return this.evaluateIndexExpression(expr as IndexExpression, env);
      case 'MemberExpression':
        return this.evaluateMemberExpression(expr as any, env);
      case 'ObjectLiteral':
        return this.evaluateObjectLiteral(expr as any, env);
      default:
        throw new Error(`Tipo de expressão não suportado: ${(expr as any).type}`);
    }
  }

  private evaluateAssignment(
    expr: AssignmentExpression,
    env: Environment
  ): RuntimeValue {
    // Para operadores compostos, calcular o valor primeiro
    let value: RuntimeValue;
    if (expr.operator !== '=') {
      // Para +=, -=, *=, /=, %=, precisamos do valor atual
      if (expr.left.type === 'Identifier') {
        const name = (expr.left as Identifier).name;
        const currentValue = this.findEnvironment(name, env)?.variables.get(name) || env.variables.get(name);
        if (currentValue === undefined) {
          throw new Error(`Variável '${name}' não definida`);
        }
        // Verificar se é constante
        const targetEnv = this.findEnvironment(name, env) || env;
        if (targetEnv.constants.has(name)) {
          throw new Error(`Não é possível modificar constante '${name}'`);
        }
        // Calcular novo valor baseado no operador
        const rightValue = this.evaluateExpression(expr.right, env);
        const binaryOp = expr.operator.slice(0, -1) as '+' | '-' | '*' | '/' | '%';
        value = this.evaluateBinaryOperation(binaryOp, currentValue, rightValue);
      } else {
        // Para arrays, calcular normalmente
        const currentValue = this.evaluateExpression(expr.left, env);
        const rightValue = this.evaluateExpression(expr.right, env);
        const binaryOp = expr.operator.slice(0, -1) as '+' | '-' | '*' | '/' | '%';
        value = this.evaluateBinaryOperation(binaryOp, currentValue, rightValue);
      }
    } else {
      value = this.evaluateExpression(expr.right, env);
    }

    if (expr.left.type === 'Identifier') {
      const name = (expr.left as Identifier).name;
      const targetEnv = this.findEnvironment(name, env);
      
      // Verificar se é constante
      const checkEnv = targetEnv || env;
      if (checkEnv.constants.has(name)) {
        throw new Error(`Não é possível reatribuir constante '${name}'`);
      }
      
      if (targetEnv) {
        targetEnv.variables.set(name, value);
      } else {
        env.variables.set(name, value);
      }
    } else if (expr.left.type === 'IndexExpression') {
      const indexExpr = expr.left as IndexExpression;
      const object = this.evaluateExpression(indexExpr.object, env);
      const index = this.evaluateExpression(indexExpr.index, env);
      
      if (Array.isArray(object)) {
        // Para arrays
        const array = object as RuntimeValue[];
        const arrayIndex = index as number;
        
        if (arrayIndex < 0) {
          throw new Error(`Índice fora dos limites: ${arrayIndex}`);
        }
        
        // Permite expansão automática do array se o índice estiver além do tamanho atual
        if (arrayIndex >= array.length) {
          // Expande array até o índice necessário
          while (array.length <= arrayIndex) {
            array.push(null);
          }
        }
        
        array[arrayIndex] = value;
      } else if (typeof object === 'object' && object !== null) {
        // Para objetos
        const key = String(index);
        (object as any)[key] = value;
      } else {
        throw new Error('Indexação só é permitida em arrays ou objetos');
      }
    } else if (expr.left.type === 'MemberExpression') {
      const memberExpr = expr.left as MemberExpression;
      const object = this.evaluateExpression(memberExpr.object, env);
      const property = memberExpr.computed 
        ? this.evaluateExpression(memberExpr.property as Expression, env)
        : memberExpr.property;
      
      if (object === null || object === undefined) {
        throw new Error('Não é possível atribuir propriedade a null ou undefined');
      }
      
      const key = String(property);
      (object as any)[key] = value;
    }

    return value;
  }

  private evaluateBinaryOperation(
    operator: '+' | '-' | '*' | '/' | '%',
    left: RuntimeValue,
    right: RuntimeValue
  ): RuntimeValue {
    switch (operator) {
      case '+':
        if (typeof left === 'string' || typeof right === 'string') {
          return String(left) + String(right);
        }
        return (left as number) + (right as number);
      case '-':
        return (left as number) - (right as number);
      case '*':
        return (left as number) * (right as number);
      case '/':
        return (left as number) / (right as number);
      case '%':
        return (left as number) % (right as number);
      default:
        throw new Error(`Operador binário não suportado: ${operator}`);
    }
  }

  private evaluateBinaryExpression(
    expr: BinaryExpression,
    env: Environment
  ): RuntimeValue {
    const left = this.evaluateExpression(expr.left, env);
    const right = this.evaluateExpression(expr.right, env);

    switch (expr.operator) {
      case '+':
        if (typeof left === 'string' || typeof right === 'string') {
          return String(left) + String(right);
        }
        return (left as number) + (right as number);
      case '-':
        return (left as number) - (right as number);
      case '*':
        return (left as number) * (right as number);
      case '/':
        return (left as number) / (right as number);
      case '%':
        return (left as number) % (right as number);
      case '**':
        return Math.pow(left as number, right as number);
      case '==':
        return left === right;
      case '!=':
        return left !== right;
      case '<':
        return (left as number) < (right as number);
      case '<=':
        return (left as number) <= (right as number);
      case '>':
        return (left as number) > (right as number);
      case '>=':
        return (left as number) >= (right as number);
      case '&&':
        return this.isTruthy(left) && this.isTruthy(right);
      case '||':
        return this.isTruthy(left) || this.isTruthy(right);
      default:
        throw new Error(`Operador binário não suportado: ${expr.operator}`);
    }
  }

  private evaluateUnaryExpression(
    expr: UnaryExpression,
    env: Environment
  ): RuntimeValue {
    const operand = this.evaluateExpression(expr.argument, env);

    switch (expr.operator) {
      case '-':
        return -(operand as number);
      case '!':
        return !this.isTruthy(operand);
      default:
        throw new Error(`Operador unário não suportado: ${expr.operator}`);
    }
  }

  private evaluateTernaryExpression(
    expr: TernaryExpression,
    env: Environment
  ): RuntimeValue {
    const testValue = this.evaluateExpression(expr.test, env);
    const testResult = this.isTruthy(testValue);
    
    if (testResult) {
      return this.evaluateExpression(expr.consequent, env);
    } else {
      return this.evaluateExpression(expr.alternate, env);
    }
  }

  private evaluateCallExpression(
    expr: CallExpression,
    env: Environment
  ): RuntimeValue {
    const callee = this.evaluateExpression(expr.callee, env);

    // Check if callee is a function (native or Trest function)
    if (typeof callee === 'function') {
      // Native function (from std-native.ts)
      // Convert Trest FunctionValues to JS functions when passed as arguments
      const args = expr.arguments.map((arg) => {
        const value = this.evaluateExpression(arg, env);
        // If argument is a Trest function, convert it to a JS function
        if (value && typeof value === 'object' && 'type' in value && (value as any).type === 'function') {
          return this.convertTrestFunctionToJS(value as FunctionValue, env);
        }
        return value;
      });
      try {
        return callee(...args);
      } catch (error: any) {
        throw new Error(`Erro ao chamar função nativa: ${error.message}`);
      }
    }

    // Check if it's a Trest function
    if (typeof callee === 'object' && callee !== null && 'type' in callee && (callee as any).type === 'function') {
      const func = callee as FunctionValue;
      const args = expr.arguments.map((arg) => this.evaluateExpression(arg, env));

      if (args.length !== func.params.length) {
        throw new Error(
          `Número incorreto de argumentos. Esperado ${func.params.length}, recebido ${args.length}`
        );
      }

      const newEnv: Environment = {
        variables: new Map(),
        functions: new Map(),
        classes: new Map(),
        constants: new Set(),
        parent: func.closure,
      };

      for (let i = 0; i < func.params.length; i++) {
        newEnv.variables.set(func.params[i], args[i]);
      }

      const result = this.evaluateBlockStatement(func.body, newEnv);
      
      if (result !== null && this.isReturnValue(result)) {
        return (result as any).value;
      }

      return null;
    }

    // Melhorar mensagem de erro para MemberExpression também
    let calleeName = 'unknown';
    if (expr.callee.type === 'Identifier') {
      calleeName = (expr.callee as Identifier).name;
    } else if (expr.callee.type === 'MemberExpression') {
      const memberExpr = expr.callee as any;
      const objectName = memberExpr.object.type === 'Identifier' 
        ? (memberExpr.object as Identifier).name 
        : 'object';
      const propertyName = typeof memberExpr.property === 'string' 
        ? memberExpr.property 
        : (memberExpr.property.type === 'Identifier' 
          ? (memberExpr.property as Identifier).name 
          : 'property');
      calleeName = `${objectName}.${propertyName}`;
    }
    
    throw new Error(`Não é uma função: ${calleeName} (tipo: ${typeof callee})`);
  }

  /**
   * Converte uma função Trest (FunctionValue) em uma função JavaScript
   * Isso permite que funções Trest sejam passadas como callbacks para métodos nativos
   */
  private convertTrestFunctionToJS(trestFunc: FunctionValue, env: Environment): Function {
    return (...args: any[]) => {
      // Criar ambiente para executar a função Trest
      const newEnv: Environment = {
        variables: new Map(),
        functions: new Map(),
        classes: new Map(),
        constants: new Set(),
        parent: trestFunc.closure || env,
      };

      // Mapear argumentos para parâmetros
      for (let i = 0; i < trestFunc.params.length && i < args.length; i++) {
        newEnv.variables.set(trestFunc.params[i], args[i]);
      }

      // Executar corpo da função
      const result = this.evaluateBlockStatement(trestFunc.body, newEnv);
      
      // Retornar valor se houver
      if (result !== null && this.isReturnValue(result)) {
        return (result as any).value;
      }

      return null;
    };
  }

  private evaluateIdentifier(
    expr: Identifier,
    env: Environment
  ): RuntimeValue {
    const name = expr.name;
    const targetEnv = this.findEnvironment(name, env);
    
    if (targetEnv && targetEnv.variables.has(name)) {
      return targetEnv.variables.get(name)!;
    }
    
    // Procura função no ambiente atual e nos pais
    let current: Environment | undefined = env;
    while (current) {
      if (current.functions.has(name)) {
        return current.functions.get(name)!;
      }
      current = current.parent;
    }

    throw new Error(`Variável ou função não definida: ${name}`);
  }

  private evaluateArrayLiteral(
    expr: ArrayLiteral,
    env: Environment
  ): RuntimeValue[] {
    return expr.elements.map((el) => this.evaluateExpression(el, env));
  }

  private evaluateIndexExpression(
    expr: IndexExpression,
    env: Environment
  ): RuntimeValue {
    const array = this.evaluateExpression(expr.object, env);
    const index = this.evaluateExpression(expr.index, env);

    if (!Array.isArray(array) && (typeof array !== 'object' || array === null)) {
      throw new Error('Indexação só é permitida em arrays ou objetos');
    }

    if (Array.isArray(array)) {
      if (typeof index !== 'number') {
        throw new Error('Índice deve ser um número para arrays');
      }
      if (index < 0 || index >= array.length) {
        throw new Error(`Índice fora dos limites: ${index}`);
      }
      return array[index];
    }

    // Para objetos
    const key = String(index);
    return (array as any)[key];
  }

  private evaluateObjectLiteral(expr: any, env: Environment): RuntimeValue {
    const obj: any = {};
    for (const prop of expr.properties) {
      const key = prop.key;
      const value = this.evaluateExpression(prop.value, env);
      obj[key] = value;
    }
    return obj;
  }

  private evaluateMemberExpression(expr: any, env: Environment): RuntimeValue {
    const object = this.evaluateExpression(expr.object, env);
    
    const property = expr.computed
      ? this.evaluateExpression(expr.property, env)
      : expr.property;

    const key = String(property);
    
    // Suportar acesso a propriedades de classes estáticas também
    if (object === null || object === undefined) {
      throw new Error('Acesso a propriedade só é permitido em objetos (null ou undefined)');
    }
    
    // Permitir acesso em objetos, arrays, funções e classes
    return (object as any)[key];
  }

  private findEnvironment(
    name: string,
    env: Environment
  ): Environment | null {
    let current: Environment | undefined = env;

    while (current) {
      if (current.variables.has(name)) {
        return current;
      }
      current = current.parent;
    }

    return null;
  }

  private isTruthy(value: RuntimeValue): boolean {
    if (value === null || value === false) {
      return false;
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    if (typeof value === 'string') {
      return value.length > 0;
    }
    return true;
  }

  private isReturnValue(value: any): boolean {
    return value !== null && typeof value === 'object' && 'type' in value && (value as any).type === 'return';
  }

  private formatValue(value: RuntimeValue): string {
    if (Array.isArray(value)) {
      return '[' + value.map((v) => this.formatValue(v)).join(', ') + ']';
    }
    if (value === null) {
      return 'null';
    }
    if (typeof value === 'object' && 'type' in value && (value as any).type === 'function') {
      return '<função>';
    }
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const entries = Object.entries(value).map(([k, v]) => `${k}: ${this.formatValue(v as RuntimeValue)}`);
      return '{' + entries.join(', ') + '}';
    }
    return String(value);
  }

  private evaluateTryStatement(stmt: any, env: Environment): RuntimeValue | null {
    try {
      const result = this.evaluateBlockStatement(stmt.block, env);
      if (result !== null && (this.isReturnValue(result) || (result as any).type === 'break' || (result as any).type === 'continue')) {
        return result;
      }
      return null;
    } catch (error: any) {
      if (stmt.handler) {
        const newEnv: Environment = {
          variables: new Map(),
          functions: new Map(),
          classes: new Map(),
          constants: new Set(),
          parent: env,
        };
        if (stmt.handler.param) {
          newEnv.variables.set(stmt.handler.param, error.message || error);
        }
        return this.evaluateBlockStatement(stmt.handler.body, newEnv);
      }
      throw error;
    } finally {
      if (stmt.finalizer) {
        this.evaluateBlockStatement(stmt.finalizer, env);
      }
    }
  }

  private evaluateThrowStatement(stmt: any, env: Environment): RuntimeValue {
    const value = this.evaluateExpression(stmt.argument, env);
    throw new Error(String(value));
  }

  private evaluateWhileStatement(
    stmt: WhileStatement,
    env: Environment
  ): RuntimeValue | null {
    while (this.isTruthy(this.evaluateExpression(stmt.condition, env))) {
      const result = this.evaluateBlockStatement(stmt.body, env);
      if (result !== null) {
        if (this.isReturnValue(result)) {
          return result;
        }
        if ((result as any).type === 'break') {
          break;
        }
        if ((result as any).type === 'continue') {
          continue;
        }
      }
    }
    return null;
  }

  private evaluateForStatement(
    stmt: ForStatement,
    env: Environment
  ): RuntimeValue | null {
    const newEnv: Environment = {
      variables: new Map(),
      functions: new Map(),
      classes: new Map(),
      constants: new Set(),
      parent: env,
    };

    if (stmt.init) {
      this.evaluateStatement(stmt.init, newEnv);
    }

    while (
      stmt.condition === undefined ||
      this.isTruthy(this.evaluateExpression(stmt.condition, newEnv))
    ) {
      const result = this.evaluateBlockStatement(stmt.body, newEnv);
      if (result !== null) {
        if (this.isReturnValue(result)) {
          return result;
        }
        if ((result as any).type === 'break') {
          break;
        }
        if ((result as any).type === 'continue') {
          // Continue com update
          if (stmt.update) {
            this.evaluateExpression(stmt.update, newEnv);
          }
          continue;
        }
      }

      if (stmt.update) {
        this.evaluateExpression(stmt.update, newEnv);
      }
    }

    return null;
  }

  private evaluateForOfStatement(
    stmt: ForOfStatement,
    env: Environment
  ): RuntimeValue | null {
    const iterable = this.evaluateExpression(stmt.right, env);
    
    if (!Array.isArray(iterable)) {
      throw new Error('For...of só funciona com arrays');
    }
    
    const newEnv: Environment = {
      variables: new Map(),
      functions: new Map(),
      classes: new Map(),
      constants: new Set(),
      parent: env,
    };
    
    for (const item of iterable as RuntimeValue[]) {
      if (stmt.left.type === 'VariableDeclaration') {
        const decl = stmt.left;
        newEnv.variables.set(decl.name, item);
        if (decl.kind === 'const') {
          newEnv.constants.add(decl.name);
        }
      } else {
        newEnv.variables.set((stmt.left as Identifier).name, item);
      }
      
      const result = this.evaluateBlockStatement(stmt.body, newEnv);
      if (result !== null) {
        if (this.isReturnValue(result)) {
          return result;
        }
        if ((result as any).type === 'break') {
          break;
        }
        if ((result as any).type === 'continue') {
          continue;
        }
      }
    }
    
    return null;
  }

  private evaluateForInStatement(
    stmt: ForInStatement,
    env: Environment
  ): RuntimeValue | null {
    const object = this.evaluateExpression(stmt.right, env);
    
    if (typeof object !== 'object' || object === null || Array.isArray(object)) {
      throw new Error('For...in só funciona com objetos');
    }
    
    const newEnv: Environment = {
      variables: new Map(),
      functions: new Map(),
      classes: new Map(),
      constants: new Set(),
      parent: env,
    };
    
    const obj = object as { [key: string]: RuntimeValue };
    for (const key in obj) {
      if (stmt.left.type === 'VariableDeclaration') {
        const decl = stmt.left;
        newEnv.variables.set(decl.name, key);
        if (decl.kind === 'const') {
          newEnv.constants.add(decl.name);
        }
      } else {
        newEnv.variables.set((stmt.left as Identifier).name, key);
      }
      
      const result = this.evaluateBlockStatement(stmt.body, newEnv);
      if (result !== null) {
        if (this.isReturnValue(result)) {
          return result;
        }
        if ((result as any).type === 'break') {
          break;
        }
        if ((result as any).type === 'continue') {
          continue;
        }
      }
    }
    
    return null;
  }

  private evaluateClassDeclaration(
    stmt: ClassDeclaration,
    env: Environment
  ): RuntimeValue | null {
    const methods = new Map<string, FunctionValue>();
    let constructor: FunctionValue | undefined;
    
    // Avaliar métodos da classe
    for (const method of stmt.body.body) {
      const funcValue: FunctionValue = {
        type: 'function',
        name: method.key,
        params: method.params,
        body: method.body,
        closure: env,
      };
      
      if (method.kind === 'constructor') {
        constructor = funcValue;
      } else {
        methods.set(method.key, funcValue);
      }
    }
    
    const classValue: ClassValue = {
      type: 'class',
      name: stmt.name,
      methods,
      constructor,
    };
    
    // Se tem superclasse, resolver
    if (stmt.superClass) {
      const superClass = env.classes.get(stmt.superClass.name);
      if (!superClass) {
        throw new Error(`Classe pai '${stmt.superClass.name}' não encontrada`);
      }
      classValue.superClass = superClass;
    }
    
    env.classes.set(stmt.name, classValue);
    return null;
  }

  private evaluateNewExpression(
    expr: NewExpression,
    env: Environment
  ): RuntimeValue {
    const calleeName = (expr.callee as Identifier).name;
    const classValue = this.findClass(calleeName, env);
    
    if (!classValue) {
      throw new Error(`Classe '${calleeName}' não encontrada`);
    }
    
    return this.instantiateClass(classValue, expr.arguments, env);
  }

  private findClass(name: string, env: Environment): ClassValue | null {
    if (env.classes.has(name)) {
      return env.classes.get(name)!;
    }
    if (env.parent) {
      return this.findClass(name, env.parent);
    }
    return null;
  }

  private instantiateClass(
    classValue: ClassValue,
    args: Expression[],
    env: Environment
  ): RuntimeValue {
    const instance: any = {};
    
    // Se tem superclasse, criar instância pai
    if (classValue.superClass) {
      instance.__proto__ = this.instantiateClass(classValue.superClass, [], env);
    }
    
    // Executar construtor se existir
    if (classValue.constructor) {
      const constructorEnv: Environment = {
        variables: new Map(),
        functions: new Map(),
        classes: new Map(),
        constants: new Set(),
        parent: env,
      };
      
      // Adicionar 'это' (this) ao ambiente
      constructorEnv.variables.set('это', instance);
      constructorEnv.variables.set('this', instance);
      
      // Mapear argumentos
      for (let i = 0; i < classValue.constructor.params.length; i++) {
        const paramName = classValue.constructor.params[i];
        const argValue = i < args.length 
          ? this.evaluateExpression(args[i], env)
          : null;
        constructorEnv.variables.set(paramName, argValue);
      }
      
      // Executar construtor
      this.evaluateBlockStatement(classValue.constructor.body, constructorEnv);
    }
    
    // Adicionar métodos ao objeto
    for (const [methodName, method] of classValue.methods) {
      const methodFunc = (...methodArgs: RuntimeValue[]) => {
        const methodEnv: Environment = {
          variables: new Map(),
          functions: new Map(),
          classes: new Map(),
          constants: new Set(),
          parent: env,
        };
        
        methodEnv.variables.set('это', instance);
        methodEnv.variables.set('this', instance);
        
        for (let i = 0; i < method.params.length; i++) {
          methodEnv.variables.set(method.params[i], methodArgs[i] || null);
        }
        
        const result = this.evaluateBlockStatement(method.body, methodEnv);
        if (result !== null && this.isReturnValue(result)) {
          return (result as any).value;
        }
        return null;
      };
      
      instance[methodName] = methodFunc;
    }
    
    return instance;
  }

  private evaluateFunctionExpression(
    expr: FunctionExpression,
    env: Environment
  ): RuntimeValue {
    const funcValue: FunctionValue = {
      type: 'function',
      name: expr.name || '<anonymous>',
      params: expr.params,
      body: expr.body,
      closure: env,
    };
    
    return funcValue;
  }

  /**
   * Avalia import statement
   */
  private evaluateImportStatement(statement: any, env: Environment): null {
    const specifiers = statement.specifiers;
    const source = statement.source;
    
    // Para imports std/, sempre usar implementações nativas (mais robustas)
    if (source.startsWith('std/')) {
      for (const spec of specifiers) {
        if (spec.imported === '*') {
          const localName = spec.local || '*';
          
          // Sempre usar módulos nativos para std/ (mais robusto e performático)
          let moduleName = source.replace('std/', '').replace('.trest', '');
          if (moduleName === 'index') {
            moduleName = '';
          }
          
          const moduleMap: { [key: string]: any } = {
            '': {  // std/index
              HTTP: StdModules.HTTP,
              Async: StdModules.Async,
              GUI: StdModules.GUI,
              DB: StdModules.Database,
              FileSystem: StdModules.FileSystem,
              JSON: StdModules.JSON,
              Date: StdModules.Date,
              Crypto: StdModules.Crypto,
              RegEx: StdModules.RegEx,
              Path: StdModules.Path,
              Process: StdModules.Process,
              IO: StdModules.IO,
              DOM: StdModules.DOM,
              Style: StdModules.Style,
              Test: StdModules.Test,
            },
            'http': {
              GET: StdModules.HTTP.GET.bind(StdModules.HTTP),
              POST: StdModules.HTTP.POST.bind(StdModules.HTTP),
              создатьСервер: StdModules.HTTP.createServer.bind(StdModules.HTTP),
            },
            'async': {
              отложить: StdModules.Async.delay.bind(StdModules.Async),
              создатьОбещание: StdModules.Async.createPromise.bind(StdModules.Async),
            },
            'gui': {
              criarТерминал: StdModules.GUI.createTerminal.bind(StdModules.GUI),
              создатьТерминал: StdModules.GUI.createTerminal.bind(StdModules.GUI),
              создатьОкно: StdModules.GUI.createWindow.bind(StdModules.GUI),
              criarJanela: StdModules.GUI.createWindow.bind(StdModules.GUI),
              criarJanelaProgramática: StdModules.GUI.createProgrammaticWindow.bind(StdModules.GUI),
              criarJanelaProgramatica: StdModules.GUI.createProgrammaticWindow.bind(StdModules.GUI),
              создатьКнопку: StdModules.GUI.createButton.bind(StdModules.GUI),
              criarBotão: StdModules.GUI.createButton.bind(StdModules.GUI),
              Button: StdModules.GUI.Button.bind(StdModules.GUI),
              создатьТекст: StdModules.GUI.createText.bind(StdModules.GUI),
              criarTexto: StdModules.GUI.createText.bind(StdModules.GUI),
              Input: StdModules.GUI.Input.bind(StdModules.GUI),
              criarCampoTexto: StdModules.GUI.Input.bind(StdModules.GUI),
              создатьСписок: StdModules.GUI.createList.bind(StdModules.GUI),
              criarLista: StdModules.GUI.createList.bind(StdModules.GUI),
              Label: StdModules.GUI.Label.bind(StdModules.GUI),
              criarRótulo: StdModules.GUI.Label.bind(StdModules.GUI),
              VBox: StdModules.GUI.VBox.bind(StdModules.GUI),
              criarVBox: StdModules.GUI.VBox.bind(StdModules.GUI),
              HBox: StdModules.GUI.HBox.bind(StdModules.GUI),
              criarHBox: StdModules.GUI.HBox.bind(StdModules.GUI),
              Grid: StdModules.GUI.Grid.bind(StdModules.GUI),
              criarGrid: StdModules.GUI.Grid.bind(StdModules.GUI),
              Widget: StdModules.GUI.Widget.bind(StdModules.GUI),
              criarWidget: StdModules.GUI.Widget.bind(StdModules.GUI),
              компонентКонтейнер: StdModules.GUI.componentContainer.bind(StdModules.GUI),
              container: StdModules.GUI.componentContainer.bind(StdModules.GUI),
              компонентМетка: StdModules.GUI.componentLabel.bind(StdModules.GUI),
              label: StdModules.GUI.componentLabel.bind(StdModules.GUI),
              компонентИзображение: StdModules.GUI.componentImage.bind(StdModules.GUI),
              imagem: StdModules.GUI.componentImage.bind(StdModules.GUI),
              manterRodando: StdModules.GUI.keepRunning.bind(StdModules.GUI),
              mantenerEjecutando: StdModules.GUI.keepRunning.bind(StdModules.GUI),
              keepRunning: StdModules.GUI.keepRunning.bind(StdModules.GUI),
              renderizarComponente: StdModules.GUI.renderComponentToHTML.bind(StdModules.GUI),
              renderComponent: StdModules.GUI.renderComponentToHTML.bind(StdModules.GUI),
            },
            'database': {
              открытьБД: StdModules.Database.openDB.bind(StdModules.Database),
              openDB: StdModules.Database.openDB.bind(StdModules.Database),
              открытьSQLite: StdModules.Database.openSQLite.bind(StdModules.Database),
              openSQLite: StdModules.Database.openSQLite.bind(StdModules.Database),
              открытьMySQL: StdModules.Database.openMySQL.bind(StdModules.Database),
              openMySQL: StdModules.Database.openMySQL.bind(StdModules.Database),
              открытьPostgreSQL: StdModules.Database.openPostgreSQL.bind(StdModules.Database),
              openPostgreSQL: StdModules.Database.openPostgreSQL.bind(StdModules.Database),
              создательЗапросов: StdModules.Database.createQueryBuilder.bind(StdModules.Database),
              createQueryBuilder: StdModules.Database.createQueryBuilder.bind(StdModules.Database),
              Модель: StdModules.Database.Model.bind(StdModules.Database),
              Model: StdModules.Database.Model.bind(StdModules.Database),
            },
            'crypto': {
              md5: StdModules.Crypto.md5.bind(StdModules.Crypto),
              sha256: StdModules.Crypto.sha256.bind(StdModules.Crypto),
              sha512: StdModules.Crypto.sha512.bind(StdModules.Crypto),
              случайныеБайты: StdModules.Crypto.randomBytes.bind(StdModules.Crypto),
              randomBytes: StdModules.Crypto.randomBytes.bind(StdModules.Crypto),
              зашифровать: StdModules.Crypto.encrypt.bind(StdModules.Crypto),
              encrypt: StdModules.Crypto.encrypt.bind(StdModules.Crypto),
              расшифровать: StdModules.Crypto.decrypt.bind(StdModules.Crypto),
              decrypt: StdModules.Crypto.decrypt.bind(StdModules.Crypto),
            },
            'filesystem': {
              читатьФайл: StdModules.FileSystem.readFile.bind(StdModules.FileSystem),
              readFile: StdModules.FileSystem.readFile.bind(StdModules.FileSystem),
              писатьФайл: StdModules.FileSystem.writeFile.bind(StdModules.FileSystem),
              writeFile: StdModules.FileSystem.writeFile.bind(StdModules.FileSystem),
              существует: StdModules.FileSystem.exists.bind(StdModules.FileSystem),
              exists: StdModules.FileSystem.exists.bind(StdModules.FileSystem),
              удалитьФайл: StdModules.FileSystem.deleteFile.bind(StdModules.FileSystem),
              deleteFile: StdModules.FileSystem.deleteFile.bind(StdModules.FileSystem),
              списокДиректорий: StdModules.FileSystem.listDir.bind(StdModules.FileSystem),
              listDir: StdModules.FileSystem.listDir.bind(StdModules.FileSystem),
              createDir: StdModules.FileSystem.createDir.bind(StdModules.FileSystem),
              deleteDir: StdModules.FileSystem.deleteDir.bind(StdModules.FileSystem),
              getStats: StdModules.FileSystem.getStats.bind(StdModules.FileSystem),
            },
            'json': {
              parse: StdModules.JSON.parse.bind(StdModules.JSON),
              stringify: StdModules.JSON.stringify.bind(StdModules.JSON),
            },
            'date': {
              теперь: StdModules.Date.now.bind(StdModules.Date),
              timestamp: StdModules.Date.timestamp.bind(StdModules.Date),
              формат: StdModules.Date.format.bind(StdModules.Date),
              timezone: StdModules.Date.timezone.bind(StdModules.Date),
            },
            'regex': {
              создать: StdModules.RegEx.create.bind(StdModules.RegEx),
              тест: StdModules.RegEx.test.bind(StdModules.RegEx),
              соответствие: StdModules.RegEx.match.bind(StdModules.RegEx),
              найтиВсе: StdModules.RegEx.findAll.bind(StdModules.RegEx),
              заменить: StdModules.RegEx.replace.bind(StdModules.RegEx),
              разделить: StdModules.RegEx.split.bind(StdModules.RegEx),
            },
            'path': {
              соединить: StdModules.Path.join.bind(StdModules.Path),
              решить: StdModules.Path.resolve.bind(StdModules.Path),
              директория: StdModules.Path.dirname.bind(StdModules.Path),
              базовоеИмя: StdModules.Path.basename.bind(StdModules.Path),
              расширение: StdModules.Path.extname.bind(StdModules.Path),
              нормализовать: StdModules.Path.normalize.bind(StdModules.Path),
              абсолютный: StdModules.Path.isAbsolute.bind(StdModules.Path),
              относительный: StdModules.Path.relative.bind(StdModules.Path),
              cwd: StdModules.Path.resolve.bind(StdModules.Path, '.'),
            },
            'process': {
              получитьEnv: StdModules.Process.getEnv.bind(StdModules.Process),
              всеEnv: StdModules.Process.getAllEnv.bind(StdModules.Process),
              установитьEnv: StdModules.Process.setEnv.bind(StdModules.Process),
              платформа: StdModules.Process.platform,
              архитектура: StdModules.Process.arch,
              версия: StdModules.Process.version,
              cwd: StdModules.Process.cwd,
              изменитьDir: StdModules.Process.chdir.bind(StdModules.Process),
              выход: StdModules.Process.exit.bind(StdModules.Process),
              pid: StdModules.Process.pid,
            },
            'io': {
              читать: StdModules.IO.read.bind(StdModules.IO),
              печать: StdModules.IO.print.bind(StdModules.IO),
              печатьВстроенный: StdModules.IO.printInline.bind(StdModules.IO),
            },
            'dom': {
              selecionar: StdModules.DOM.selecionar.bind(StdModules.DOM),
              select: StdModules.DOM.select.bind(StdModules.DOM),
              evento: StdModules.DOM.evento.bind(StdModules.DOM),
              addEvent: StdModules.DOM.addEvent.bind(StdModules.DOM),
              texto: StdModules.DOM.texto.bind(StdModules.DOM),
              setText: StdModules.DOM.setText.bind(StdModules.DOM),
              html: StdModules.DOM.html.bind(StdModules.DOM),
              setHTML: StdModules.DOM.setHTML.bind(StdModules.DOM),
              valor: StdModules.DOM.valor.bind(StdModules.DOM),
              val: StdModules.DOM.val.bind(StdModules.DOM),
              criar: StdModules.DOM.criar.bind(StdModules.DOM),
              create: StdModules.DOM.create.bind(StdModules.DOM),
              adicionar: StdModules.DOM.adicionar.bind(StdModules.DOM),
              append: StdModules.DOM.append.bind(StdModules.DOM),
              remover: StdModules.DOM.remover.bind(StdModules.DOM),
              remove: StdModules.DOM.remove.bind(StdModules.DOM),
              atributo: StdModules.DOM.atributo.bind(StdModules.DOM),
              getAttr: StdModules.DOM.getAttr.bind(StdModules.DOM),
              definirАтрибут: StdModules.DOM.definirАтрибут.bind(StdModules.DOM),
              setAttr: StdModules.DOM.setAttr.bind(StdModules.DOM),
            },
            'style': {
              carregarCDN: StdModules.Style.carregarCDN.bind(StdModules.Style),
              loadCDN: StdModules.Style.loadCDN.bind(StdModules.Style),
              carregarАрхив: StdModules.Style.carregarАрхив.bind(StdModules.Style),
              loadFile: StdModules.Style.loadFile.bind(StdModules.Style),
              aplicar: StdModules.Style.aplicar.bind(StdModules.Style),
              apply: StdModules.Style.apply.bind(StdModules.Style),
              obter: StdModules.Style.obter.bind(StdModules.Style),
              get: StdModules.Style.get.bind(StdModules.Style),
              definir: StdModules.Style.definir.bind(StdModules.Style),
              set: StdModules.Style.set.bind(StdModules.Style),
              добавитьКласс: StdModules.Style.добавитьКласс.bind(StdModules.Style),
              addClass: StdModules.Style.addClass.bind(StdModules.Style),
              удалитьКласс: StdModules.Style.удалитьКласс.bind(StdModules.Style),
              removeClass: StdModules.Style.removeClass.bind(StdModules.Style),
              переключитьКласс: StdModules.Style.переключитьКласс.bind(StdModules.Style),
              toggleClass: StdModules.Style.toggleClass.bind(StdModules.Style),
            },
            'test': {
              descrever: StdModules.Test.descrever.bind(StdModules.Test),
              describe: StdModules.Test.describe.bind(StdModules.Test),
              afirmar: StdModules.Test.afirmar.bind(StdModules.Test),
              assert: StdModules.Test.assert.bind(StdModules.Test),
              igual: StdModules.Test.igual.bind(StdModules.Test),
              equal: StdModules.Test.equal.bind(StdModules.Test),
              verdadeiro: StdModules.Test.verdadeiro.bind(StdModules.Test),
              isTrue: StdModules.Test.isTrue.bind(StdModules.Test),
              ложь: StdModules.Test.ложь.bind(StdModules.Test),
              isFalse: StdModules.Test.isFalse.bind(StdModules.Test),
              выполнить: StdModules.Test.выполнить.bind(StdModules.Test),
              run: StdModules.Test.run.bind(StdModules.Test),
            },
            'math': {
              abs: Math.abs,
              max: Math.max,
              min: Math.min,
              pow: Math.pow,
              sqrt: Math.sqrt,
              ceil: Math.ceil,
              floor: Math.floor,
              round: Math.round,
              PI: Math.PI,
              E: Math.E,
            },
            'string': {
              size: (str: string) => str.length,
              размер: (str: string) => str.length,
              upper: (str: string) => str.toUpperCase(),
              верхний: (str: string) => str.toUpperCase(),
              lower: (str: string) => str.toLowerCase(),
              нижний: (str: string) => str.toLowerCase(),
              trim: (str: string) => str.trim(),
              substring: (str: string, start: number, end?: number) => str.substring(start, end),
              разделить: (str: string, separator: string) => str.split(separator),
              split: (str: string, separator: string) => str.split(separator),
              заменить: (str: string, search: string, replace: string) => str.replace(new RegExp(search, 'g'), replace),
              replace: (str: string, search: string, replace: string) => str.replace(new RegExp(search, 'g'), replace),
            },
            'array': {
              длина: (arr: any[]) => arr.length,
              length: (arr: any[]) => arr.length,
              push: (arr: any[], item: any) => { arr.push(item); return arr; },
              добавить: (arr: any[], item: any) => { arr.push(item); return arr; },
              pop: (arr: any[]) => arr.pop(),
              sort: (arr: any[]) => [...arr].sort((a, b) => a > b ? 1 : a < b ? -1 : 0),
              отсортировать: (arr: any[]) => [...arr].sort((a, b) => a > b ? 1 : a < b ? -1 : 0),
              reverse: (arr: any[]) => [...arr].reverse(),
              обратить: (arr: any[]) => [...arr].reverse(),
            },
          };
          
          const moduleValue = moduleMap[moduleName] || {};
          if (moduleValue && Object.keys(moduleValue).length > 0) {
            env.variables.set(localName, moduleValue);
            return null; // Módulo nativo carregado com sucesso
          }
        }
      }
      // Se chegou aqui e não encontrou módulo nativo, tentar carregar .trest como fallback
      // (mas para std/ sempre priorizar nativos, então apenas log se debug)
    }
    
    // Para módulos não-std, continuar com o carregamento normal de .trest
    return null;
  }

  /**
   * Resolve path for std modules
   */
  private resolveStdPath(modulePath: string): string | null {
    // Try multiple possible locations
    const possiblePaths = [
      // Development paths
      path.join(__dirname, '..', 'src', 'std', modulePath.replace('std/', '') + '.trest'),
      path.join(process.cwd(), 'src', 'std', modulePath.replace('std/', '') + '.trest'),
      // Production paths
      path.join(__dirname, 'std', modulePath.replace('std/', '') + '.trest'),
      // Relative to dist
      path.join(__dirname, '..', 'std', modulePath.replace('std/', '') + '.trest'),
    ];
    
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
    
    return null;
  }

  /**
   * Load a .trest module file
   */
  private loadTrestModule(filePath: string): { [key: string]: any } {
    const source = fs.readFileSync(filePath, 'utf-8');
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    // Create isolated environment for module
    const moduleEnv: Environment = {
      variables: new Map(),
      functions: new Map(),
      classes: new Map(),
      constants: new Set(),
    };
    
    // Evaluate module statements
    for (const statement of ast.body) {
      this.evaluateStatement(statement, moduleEnv);
    }
    
    // Collect exports
    const exports: { [key: string]: any } = {};
    for (const [key, value] of moduleEnv.variables) {
      exports[key] = value;
    }
    for (const [key, value] of moduleEnv.functions) {
      exports[key] = value;
    }
    
    return exports;
  }
}

