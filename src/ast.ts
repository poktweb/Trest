export type ASTNode =
  | Program
  | VariableDeclaration
  | FunctionDeclaration
  | ClassDeclaration
  | BlockStatement
  | IfStatement
  | SwitchStatement
  | CaseClause
  | DefaultClause
  | WhileStatement
  | ForStatement
  | ForOfStatement
  | ForInStatement
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
  | TernaryExpression
  | CallExpression
  | NewExpression
  | Identifier
  | Literal
  | ArrayLiteral
  | IndexExpression
  | ObjectLiteral
  | MemberExpression
  | FunctionExpression;

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
  async?: boolean;
}

export interface FunctionExpression {
  type: 'FunctionExpression';
  name?: string;
  params: string[];
  body: BlockStatement;
  async?: boolean;
}

export interface ClassDeclaration {
  type: 'ClassDeclaration';
  name: string;
  superClass?: Identifier;
  body: ClassBody;
}

export interface ClassBody {
  type: 'ClassBody';
  body: ClassMethod[];
}

export interface ClassMethod {
  type: 'ClassMethod';
  key: string;
  kind: 'constructor' | 'method';
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

export interface SwitchStatement {
  type: 'SwitchStatement';
  discriminant: Expression;
  cases: CaseClause[];
}

export interface CaseClause {
  type: 'CaseClause';
  test: Expression;
  consequent: ASTNode[];
}

export interface DefaultClause {
  type: 'DefaultClause';
  consequent: ASTNode[];
}

export interface ForStatement {
  type: 'ForStatement';
  init?: VariableDeclaration | ExpressionStatement;
  condition?: Expression;
  update?: Expression;
  body: BlockStatement;
}

export interface ForOfStatement {
  type: 'ForOfStatement';
  left: VariableDeclaration | Identifier;
  right: Expression;
  body: BlockStatement;
}

export interface ForInStatement {
  type: 'ForInStatement';
  left: VariableDeclaration | Identifier;
  right: Expression;
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
  | TernaryExpression
  | CallExpression
  | NewExpression
  | FunctionExpression
  | Identifier
  | Literal
  | ArrayLiteral
  | IndexExpression
  | ObjectLiteral
  | MemberExpression;

export interface AssignmentExpression {
  type: 'AssignmentExpression';
  left: Identifier | IndexExpression | MemberExpression;
  operator: '=' | '+=' | '-=' | '*=' | '/=' | '%=';
  right: Expression;
}

export interface NewExpression {
  type: 'NewExpression';
  callee: Identifier | MemberExpression;
  arguments: Expression[];
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

export interface TernaryExpression {
  type: 'TernaryExpression';
  test: Expression;
  consequent: Expression;
  alternate: Expression;
}

export interface CallExpression {
  type: 'CallExpression';
  callee: Identifier | MemberExpression;
  arguments: Expression[];
}

export interface Identifier {
  type: 'Identifier';
  name: string;
}

export interface Literal {
  type: 'Literal';
  value: string | number | boolean | null | undefined;
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
