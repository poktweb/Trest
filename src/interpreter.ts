import {
  ASTNode,
  Program,
  VariableDeclaration,
  FunctionDeclaration,
  BlockStatement,
  IfStatement,
  WhileStatement,
  ForStatement,
  ReturnStatement,
  ExpressionStatement,
  PrintStatement,
  Expression,
  AssignmentExpression,
  BinaryExpression,
  UnaryExpression,
  CallExpression,
  Identifier,
  Literal,
  ArrayLiteral,
  IndexExpression,
} from './ast';

type RuntimeValue =
  | number
  | string
  | boolean
  | null
  | RuntimeValue[]
  | FunctionValue;

interface FunctionValue {
  type: 'function';
  name: string;
  params: string[];
  body: BlockStatement;
  closure: Environment;
}

interface Environment {
  variables: Map<string, RuntimeValue>;
  functions: Map<string, FunctionValue>;
  parent?: Environment;
}

export class Interpreter {
  private globalEnv: Environment;

  constructor() {
    this.globalEnv = {
      variables: new Map(),
      functions: new Map(),
    };
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
      case 'WhileStatement':
        return this.evaluateWhileStatement(statement as WhileStatement, env);
      case 'ForStatement':
        return this.evaluateForStatement(statement as ForStatement, env);
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
      case 'ExportStatement':
        // Imports/exports são tratados pelo compilador
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

    if (decl.kind === 'const' && env.variables.has(name)) {
      throw new Error(`Variável constante '${name}' não pode ser reatribuída`);
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
      case 'CallExpression':
        return this.evaluateCallExpression(expr as CallExpression, env);
      case 'Identifier':
        return this.evaluateIdentifier(expr as Identifier, env);
      case 'Literal':
        return (expr as Literal).value as RuntimeValue;
      case 'ArrayLiteral':
        return this.evaluateArrayLiteral(expr as ArrayLiteral, env);
      case 'IndexExpression':
        return this.evaluateIndexExpression(expr as IndexExpression, env);
      default:
        throw new Error(`Tipo de expressão não suportado: ${(expr as any).type}`);
    }
  }

  private evaluateAssignment(
    expr: AssignmentExpression,
    env: Environment
  ): RuntimeValue {
    const value = this.evaluateExpression(expr.right, env);

    if (expr.left.type === 'Identifier') {
      const name = (expr.left as Identifier).name;
      const targetEnv = this.findEnvironment(name, env);
      if (targetEnv) {
        targetEnv.variables.set(name, value);
      } else {
        env.variables.set(name, value);
      }
    } else if (expr.left.type === 'IndexExpression') {
      const indexExpr = expr.left as IndexExpression;
      const array = this.evaluateExpression(indexExpr.object, env) as RuntimeValue[];
      const index = this.evaluateExpression(indexExpr.index, env) as number;
      
      if (!Array.isArray(array)) {
        throw new Error('Indexação só é permitida em arrays');
      }
      
      if (index < 0 || index >= array.length) {
        throw new Error(`Índice fora dos limites: ${index}`);
      }
      
      array[index] = value;
    }

    return value;
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

  private evaluateCallExpression(
    expr: CallExpression,
    env: Environment
  ): RuntimeValue {
    const callee = this.evaluateExpression(expr.callee, env);

    if (typeof callee !== 'object' || callee === null || !('type' in callee) || (callee as any).type !== 'function') {
      throw new Error(`Não é uma função: ${(expr.callee as Identifier).name}`);
    }

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

  private evaluateIdentifier(
    expr: Identifier,
    env: Environment
  ): RuntimeValue {
    const name = expr.name;
    const targetEnv = this.findEnvironment(name, env);
    
    if (targetEnv && targetEnv.variables.has(name)) {
      return targetEnv.variables.get(name)!;
    }
    
    if (env.functions.has(name)) {
      return env.functions.get(name)!;
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

    if (!Array.isArray(array) && typeof array !== 'object') {
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
    
    if (object === null || (typeof object !== 'object' && !Array.isArray(object))) {
      throw new Error('Acesso a propriedade só é permitido em objetos');
    }

    const property = expr.computed
      ? this.evaluateExpression(expr.property, env)
      : expr.property;

    const key = String(property);
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
}

