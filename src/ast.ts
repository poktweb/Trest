export type ASTNode =
  | Program
  | VariableDeclaration
  | FunctionDeclaration
  | BlockStatement
  | IfStatement
  | WhileStatement
  | ForStatement
  | ReturnStatement
  | ExpressionStatement
  | PrintStatement
  | ImportStatement
  | ExportStatement
  | BreakStatement
  | ContinueStatement
  | TryStatement
  | ThrowStatement
  | AssignmentExpression
  | BinaryExpression
  | UnaryExpression
  | CallExpression
  | Identifier
  | Literal
  | ArrayLiteral
  | IndexExpression
  | ObjectLiteral
  | MemberExpression;

export interface Program {
  type: 'Program';
  body: ASTNode[];
}

export interface VariableDeclaration {
  type: 'VariableDeclaration';
  kind: 'var' | 'let' | 'const';
  name: string;
  value?: Expression;
}

export interface FunctionDeclaration {
  type: 'FunctionDeclaration';
  name: string;
  params: string[];
  body: BlockStatement;
}

export interface BlockStatement {
  type: 'BlockStatement';
  body: ASTNode[];
}

export interface IfStatement {
  type: 'IfStatement';
  condition: Expression;
  consequent: BlockStatement;
  alternate?: BlockStatement | IfStatement;
}

export interface WhileStatement {
  type: 'WhileStatement';
  condition: Expression;
  body: BlockStatement;
}

export interface ForStatement {
  type: 'ForStatement';
  init?: VariableDeclaration | ExpressionStatement;
  condition?: Expression;
  update?: Expression;
  body: BlockStatement;
}

export interface ReturnStatement {
  type: 'ReturnStatement';
  argument?: Expression;
}

export interface ExpressionStatement {
  type: 'ExpressionStatement';
  expression: Expression;
}

export interface PrintStatement {
  type: 'PrintStatement';
  arguments: Expression[];
}

export interface ImportStatement {
  type: 'ImportStatement';
  specifiers: ImportSpecifier[];
  source: string;
}

export interface ImportSpecifier {
  imported: string;
  local?: string;
}

export interface ExportStatement {
  type: 'ExportStatement';
  declaration: FunctionDeclaration | VariableDeclaration;
}

export interface BreakStatement {
  type: 'BreakStatement';
}

export interface ContinueStatement {
  type: 'ContinueStatement';
}

export interface TryStatement {
  type: 'TryStatement';
  block: BlockStatement;
  handler?: CatchClause;
  finalizer?: BlockStatement;
}

export interface CatchClause {
  param?: string;
  body: BlockStatement;
}

export interface ThrowStatement {
  type: 'ThrowStatement';
  argument: Expression;
}

export type Expression =
  | AssignmentExpression
  | BinaryExpression
  | UnaryExpression
  | CallExpression
  | Identifier
  | Literal
  | ArrayLiteral
  | IndexExpression
  | ObjectLiteral
  | MemberExpression;

export interface AssignmentExpression {
  type: 'AssignmentExpression';
  left: Identifier | IndexExpression;
  operator: '=';
  right: Expression;
}

export interface BinaryExpression {
  type: 'BinaryExpression';
  left: Expression;
  operator: string;
  right: Expression;
}

export interface UnaryExpression {
  type: 'UnaryExpression';
  operator: string;
  argument: Expression;
}

export interface CallExpression {
  type: 'CallExpression';
  callee: Identifier;
  arguments: Expression[];
}

export interface Identifier {
  type: 'Identifier';
  name: string;
}

export interface Literal {
  type: 'Literal';
  value: string | number | boolean | null;
}

export interface ArrayLiteral {
  type: 'ArrayLiteral';
  elements: Expression[];
}

export interface IndexExpression {
  type: 'IndexExpression';
  object: Expression;
  index: Expression;
}

export interface ObjectLiteral {
  type: 'ObjectLiteral';
  properties: Property[];
}

export interface Property {
  key: string;
  value: Expression;
  computed?: boolean;
}

export interface MemberExpression {
  type: 'MemberExpression';
  object: Expression;
  property: string | Expression;
  computed: boolean;
}
