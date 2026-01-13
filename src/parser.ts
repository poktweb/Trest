import { Token, TokenType } from './lexer';
import {
  ASTNode,
  Program,
  VariableDeclaration,
  FunctionDeclaration,
  ClassDeclaration,
  ClassBody,
  ClassMethod,
  BlockStatement,
  IfStatement,
  SwitchStatement,
  CaseClause,
  DefaultClause,
  WhileStatement,
  ForStatement,
  ForOfStatement,
  ForInStatement,
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

export class Parser {
  private tokens: Token[];
  private position: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private currentToken(): Token {
    return this.tokens[this.position];
  }

  private peekToken(): Token {
    return this.position < this.tokens.length - 1
      ? this.tokens[this.position + 1]
      : this.tokens[this.tokens.length - 1];
  }

  private advance(): Token {
    if (this.position < this.tokens.length - 1) {
      this.position++;
    }
    return this.tokens[this.position];
  }

  private expect(type: TokenType, message?: string): Token {
    const token = this.currentToken();
    if (token.type !== type) {
      throw new Error(
        message ||
        `Esperado ${type}, mas encontrado ${token.type} na linha ${token.line}, coluna ${token.column}`
      );
    }
    this.advance();
    return token;
  }

  private skipNewlines(): void {
    while (
      this.position < this.tokens.length &&
      (this.currentToken().type === TokenType.NEWLINE ||
        this.currentToken().type === TokenType.SEMICOLON)
    ) {
      this.advance();
    }
  }

  public parse(): Program {
    const body: ASTNode[] = [];
    this.skipNewlines();

    while (this.currentToken().type !== TokenType.EOF) {
      const stmt = this.parseStatement();
      if (stmt) {
        body.push(stmt);
      }
      this.skipNewlines();
    }

    return { type: 'Program', body };
  }

  private parseStatement(): ASTNode | null {
    this.skipNewlines();

    const token = this.currentToken();

    switch (token.type) {
      case TokenType.VAR:
      case TokenType.LET:
      case TokenType.CONST:
        return this.parseVariableDeclaration();
      case TokenType.FUNC:
        return this.parseFunctionDeclaration();
      case TokenType.CLASS:
        return this.parseClassDeclaration();
      case TokenType.IF:
        return this.parseIfStatement();
      case TokenType.SWITCH:
        return this.parseSwitchStatement();
      case TokenType.WHILE:
        return this.parseWhileStatement();
      case TokenType.FOR:
        return this.parseForStatement();
      case TokenType.RETURN:
        return this.parseReturnStatement();
      case TokenType.PRINT:
        return this.parsePrintStatement();
      case TokenType.IMPORT:
        return this.parseImportStatement();
      case TokenType.EXPORT:
        return this.parseExportStatement();
      case TokenType.BREAK:
        return this.parseBreakStatement();
      case TokenType.CONTINUE:
        return this.parseContinueStatement();
      case TokenType.TRY:
        return this.parseTryStatement();
      case TokenType.THROW:
        return this.parseThrowStatement();
      case TokenType.NEWLINE:
      case TokenType.SEMICOLON:
        this.advance();
        return null;
      default:
        return this.parseExpressionStatement();
    }
  }

  private parseVariableDeclaration(skipNewlines: boolean = true): VariableDeclaration {
    const kind = this.currentToken().value as 'var' | 'let' | 'const';
    this.advance();
    const name = this.expect(TokenType.IDENTIFIER).value as string;
    let value: Expression | undefined;

    if (this.currentToken().type === TokenType.ASSIGN) {
      this.advance();
      value = this.parseExpression();
    }

    if (skipNewlines) {
      this.skipNewlines();
    }

    return {
      type: 'VariableDeclaration',
      kind,
      name,
      value,
    };
  }

  private parseFunctionDeclaration(): FunctionDeclaration {
    // Verificar se é função async
    const isAsync = this.currentToken().type === TokenType.ASYNC;
    if (isAsync) {
      this.advance(); // Consumir ASYNC
    }
    
    this.expect(TokenType.FUNC);
    const name = this.expect(TokenType.IDENTIFIER).value as string;
    this.expect(TokenType.LPAREN);

    const params: string[] = [];
    if (this.currentToken().type !== TokenType.RPAREN) {
      params.push(this.expect(TokenType.IDENTIFIER).value as string);
      while (this.currentToken().type === TokenType.COMMA) {
        this.advance();
        params.push(this.expect(TokenType.IDENTIFIER).value as string);
      }
    }

    this.expect(TokenType.RPAREN);
    const body = this.parseBlockStatement();

    return {
      type: 'FunctionDeclaration',
      name,
      params,
      body,
      async: isAsync || undefined,
    };
  }

  private parseBlockStatement(): BlockStatement {
    this.expect(TokenType.LBRACE);
    this.skipNewlines();

    const body: ASTNode[] = [];

    while (this.currentToken().type !== TokenType.RBRACE) {
      const stmt = this.parseStatement();
      if (stmt) {
        body.push(stmt);
      }
      this.skipNewlines();
    }

    this.expect(TokenType.RBRACE);
    this.skipNewlines();

    return { type: 'BlockStatement', body };
  }

  private parseIfStatement(): IfStatement {
    this.expect(TokenType.IF);
    this.expect(TokenType.LPAREN);
    const condition = this.parseExpression();
    this.expect(TokenType.RPAREN);

    const consequent = this.parseBlockStatement();
    let alternate: BlockStatement | IfStatement | undefined;

    if (this.currentToken().type === TokenType.ELSE) {
      this.advance();
      if (this.currentToken().type === TokenType.IF) {
        alternate = this.parseIfStatement();
      } else {
        alternate = this.parseBlockStatement();
      }
    }

    return {
      type: 'IfStatement',
      condition,
      consequent,
      alternate,
    };
  }

  private parseSwitchStatement(): SwitchStatement {
    this.expect(TokenType.SWITCH);
    this.expect(TokenType.LPAREN);
    const discriminant = this.parseExpression();
    this.expect(TokenType.RPAREN);
    this.expect(TokenType.LBRACE);

    const cases: CaseClause[] = [];
    let defaultAdded = false;

    while (this.currentToken().type !== TokenType.RBRACE) {
      if (this.currentToken().type === TokenType.CASE) {
        this.advance();
        const test = this.parseExpression();
        this.expect(TokenType.COLON);
        
        const consequent: ASTNode[] = [];
        while (this.currentToken().type !== TokenType.CASE && 
               this.currentToken().type !== TokenType.DEFAULT && 
               this.currentToken().type !== TokenType.RBRACE) {
          const stmt = this.parseStatement();
          if (stmt !== null) {
            consequent.push(stmt);
          }
        }
        
        cases.push({ type: 'CaseClause', test, consequent });
      } else if (this.currentToken().type === TokenType.DEFAULT && !defaultAdded) {
        this.advance();
        this.expect(TokenType.COLON);
        
        const consequent: ASTNode[] = [];
        while (this.currentToken().type !== TokenType.RBRACE) {
          const stmt = this.parseStatement();
          if (stmt !== null) {
            consequent.push(stmt);
          }
        }
        
        cases.push({ type: 'CaseClause', test: { type: 'Literal', value: '__default__' as any }, consequent });
        defaultAdded = true;
      } else {
        break;
      }
    }

    this.expect(TokenType.RBRACE);

    return {
      type: 'SwitchStatement',
      discriminant,
      cases,
    };
  }

  private parseWhileStatement(): WhileStatement {
    this.expect(TokenType.WHILE);
    this.expect(TokenType.LPAREN);
    const condition = this.parseExpression();
    this.expect(TokenType.RPAREN);
    const body = this.parseBlockStatement();

    return {
      type: 'WhileStatement',
      condition,
      body,
    };
  }

  private parseForStatement(): ForStatement | ForOfStatement | ForInStatement {
    this.expect(TokenType.FOR);
    this.expect(TokenType.LPAREN);

    // Verificar se é for...of ou for...in
    // Precisamos verificar 2 tokens à frente: após LET/VAR/CONST + IDENTIFIER deve vir OF/IN
    const currentIsVarLetConst = this.currentToken().type === TokenType.VAR ||
                                  this.currentToken().type === TokenType.LET ||
                                  this.currentToken().type === TokenType.CONST;
    
    let isForOfOrIn = false;
    if (currentIsVarLetConst) {
      // Se temos LET/VAR/CONST, verificar se o token após o IDENTIFIER é OF/IN
      const peek1 = this.peekToken(); // Deveria ser IDENTIFIER
      if (peek1 && peek1.type === TokenType.IDENTIFIER) {
        // Verificar token após o IDENTIFIER (posição + 2)
        const positionAfterId = this.position + 2;
        if (positionAfterId < this.tokens.length) {
          const tokenAfterId = this.tokens[positionAfterId];
          isForOfOrIn = tokenAfterId.type === TokenType.OF || tokenAfterId.type === TokenType.IN;
        }
      }
    } else if (this.currentToken().type === TokenType.IDENTIFIER) {
      // Se já temos IDENTIFIER, verificar se o próximo é OF/IN
      isForOfOrIn = this.peekToken().type === TokenType.OF || this.peekToken().type === TokenType.IN;
    }

    if (isForOfOrIn) {
      // Parse for...of ou for...in
      let left: VariableDeclaration | Identifier;
      
      if (currentIsVarLetConst) {
        // Para for...of/for...in, não deve haver atribuição na declaração
        const kind = this.currentToken().value as 'var' | 'let' | 'const';
        this.advance(); // Consumir VAR/LET/CONST
        const name = this.expect(TokenType.IDENTIFIER).value as string;
        left = {
          type: 'VariableDeclaration',
          kind,
          name,
        };
      } else {
        left = {
          type: 'Identifier',
          name: this.expect(TokenType.IDENTIFIER).value as string,
        };
      }

      // Pular newlines antes de verificar OF/IN
      this.skipNewlines();
      
      const isOf = this.currentToken().type === TokenType.OF;
      if (!isOf && this.currentToken().type !== TokenType.IN) {
        throw new Error(`Esperado 'из' ou 'в', mas encontrado: ${this.currentToken().type} na linha ${this.currentToken().line}`);
      }
      this.advance(); // Consumir OF ou IN
      
      const right = this.parseExpression();
      this.expect(TokenType.RPAREN);
      const body = this.parseBlockStatement();

      if (isOf) {
        return {
          type: 'ForOfStatement',
          left,
          right,
          body,
        };
      } else {
        return {
          type: 'ForInStatement',
          left,
          right,
          body,
        };
      }
    }

    // For loop tradicional
    let init: VariableDeclaration | ExpressionStatement | undefined;
    if (this.currentToken().type !== TokenType.SEMICOLON) {
      if (
        this.currentToken().type === TokenType.VAR ||
        this.currentToken().type === TokenType.LET ||
        this.currentToken().type === TokenType.CONST
      ) {
        init = this.parseVariableDeclaration();
        // Consumir SEMICOLON se presente (para for loops)
        if (this.currentToken().type === TokenType.SEMICOLON) {
          this.advance();
        }
      } else {
        init = {
          type: 'ExpressionStatement',
          expression: this.parseExpression(),
        };
        // Consumir SEMICOLON se presente
        if (this.currentToken().type === TokenType.SEMICOLON) {
          this.advance();
        }
      }
    } else {
      this.advance(); // Consumir SEMICOLON vazio
    }

    let condition: Expression | undefined;
    if (this.currentToken().type !== TokenType.SEMICOLON) {
      condition = this.parseExpression();
    }

    this.expect(TokenType.SEMICOLON);

    let update: Expression | undefined;
    if (this.currentToken().type !== TokenType.RPAREN) {
      update = this.parseExpression();
    }

    this.expect(TokenType.RPAREN);
    const body = this.parseBlockStatement();

    return {
      type: 'ForStatement',
      init,
      condition,
      update,
      body,
    };
  }

  private parseReturnStatement(): ReturnStatement {
    this.expect(TokenType.RETURN);
    let argument: Expression | undefined;

    if (this.currentToken().type !== TokenType.NEWLINE && this.currentToken().type !== TokenType.SEMICOLON) {
      argument = this.parseExpression();
    }

    this.skipNewlines();

    return {
      type: 'ReturnStatement',
      argument,
    };
  }

  private parsePrintStatement(): PrintStatement {
    this.expect(TokenType.PRINT);
    this.expect(TokenType.LPAREN);

    const args: Expression[] = [];
    if (this.currentToken().type !== TokenType.RPAREN) {
      args.push(this.parseExpression());
      while (this.currentToken().type === TokenType.COMMA) {
        this.advance();
        args.push(this.parseExpression());
      }
    }

    this.expect(TokenType.RPAREN);
    this.skipNewlines();

    return {
      type: 'PrintStatement',
      arguments: args,
    };
  }

  private parseExpressionStatement(): ExpressionStatement {
    const expression = this.parseExpression();
    this.skipNewlines();
    return {
      type: 'ExpressionStatement',
      expression,
    };
  }

  private parseExpression(): Expression {
    return this.parseAssignment();
  }

  private parseAssignment(): Expression {
    let expr = this.parseLogicalOr();

    // Verificar operadores de atribuição compostos
    if (
      this.currentToken().type === TokenType.ASSIGN ||
      this.currentToken().type === TokenType.PLUS_ASSIGN ||
      this.currentToken().type === TokenType.MINUS_ASSIGN ||
      this.currentToken().type === TokenType.MULTIPLY_ASSIGN ||
      this.currentToken().type === TokenType.DIVIDE_ASSIGN ||
      this.currentToken().type === TokenType.MODULO_ASSIGN
    ) {
      let operator: '=' | '+=' | '-=' | '*=' | '/=' | '%=' = '=';
      
      switch (this.currentToken().type) {
        case TokenType.ASSIGN:
          operator = '=';
          break;
        case TokenType.PLUS_ASSIGN:
          operator = '+=';
          break;
        case TokenType.MINUS_ASSIGN:
          operator = '-=';
          break;
        case TokenType.MULTIPLY_ASSIGN:
          operator = '*=';
          break;
        case TokenType.DIVIDE_ASSIGN:
          operator = '/=';
          break;
        case TokenType.MODULO_ASSIGN:
          operator = '%=';
          break;
      }
      
      this.advance();
      const right = this.parseAssignment();

      if (expr.type === 'Identifier' || expr.type === 'IndexExpression' || expr.type === 'MemberExpression') {
        // Para operadores compostos, transformar em expressão binária + atribuição
        if (operator !== '=') {
          const binaryOp = operator.slice(0, -1) as '+' | '-' | '*' | '/' | '%';
          return {
            type: 'AssignmentExpression',
            left: expr,
            operator,
            right: {
              type: 'BinaryExpression',
              operator: binaryOp,
              left: expr,
              right,
            },
          };
        }
        
        return {
          type: 'AssignmentExpression',
          left: expr,
          operator,
          right,
        };
      }

      throw new Error('Lado esquerdo da atribuição deve ser um identificador, índice de array ou membro de objeto');
    }

    return expr;
  }

  private parseLogicalOr(): Expression {
    let expr = this.parseTernary();

    while (this.currentToken().type === TokenType.OR) {
      const operator = this.currentToken().value as string;
      this.advance();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right: this.parseTernary(),
      };
    }

    return expr;
  }

  private parseLogicalAnd(): Expression {
    let expr = this.parseEquality();

    while (this.currentToken().type === TokenType.AND) {
      const operator = this.currentToken().value as string;
      this.advance();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right: this.parseEquality(),
      };
    }

    return expr;
  }

  private parseTernary(): Expression {
    let expr = this.parseLogicalAnd();

    if (this.currentToken().type === TokenType.Q_MARK) {
      this.advance();
      const consequent = this.parseTernary();
      this.expect(TokenType.COLON);
      const alternate = this.parseTernary();
      
      return {
        type: 'TernaryExpression',
        test: expr,
        consequent,
        alternate,
      };
    }

    return expr;
  }

  private parseEquality(): Expression {
    let expr = this.parseComparison();

    while (
      this.currentToken().type === TokenType.EQUAL ||
      this.currentToken().type === TokenType.NOT_EQUAL
    ) {
      const operator = this.currentToken().value as string;
      this.advance();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right: this.parseComparison(),
      };
    }

    return expr;
  }

  private parseComparison(): Expression {
    let expr = this.parseAddition();

    while (
      this.currentToken().type === TokenType.LESS ||
      this.currentToken().type === TokenType.LESS_EQUAL ||
      this.currentToken().type === TokenType.GREATER ||
      this.currentToken().type === TokenType.GREATER_EQUAL
    ) {
      const operator = this.currentToken().value as string;
      this.advance();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right: this.parseAddition(),
      };
    }

    return expr;
  }

  private parseAddition(): Expression {
    let expr = this.parseMultiplication();

    while (
      this.currentToken().type === TokenType.PLUS ||
      this.currentToken().type === TokenType.MINUS
    ) {
      const operator = this.currentToken().value as string;
      this.advance();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right: this.parseMultiplication(),
      };
    }

    return expr;
  }

  private parseMultiplication(): Expression {
    let expr = this.parseExponentiation();

    while (
      this.currentToken().type === TokenType.MULTIPLY ||
      this.currentToken().type === TokenType.DIVIDE ||
      this.currentToken().type === TokenType.MODULO
    ) {
      const operator = this.currentToken().value as string;
      this.advance();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right: this.parseExponentiation(),
      };
    }

    return expr;
  }

  private parseExponentiation(): Expression {
    let expr = this.parseUnary();

    while (this.currentToken().type === TokenType.POW) {
      const operator = this.currentToken().value as string;
      this.advance();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right: this.parseUnary(),
      };
    }

    return expr;
  }

  private parseUnary(): Expression {
    // Suporte a await (ожидать)
    if (this.currentToken().type === TokenType.AWAIT) {
      this.advance();
      return {
        type: 'UnaryExpression',
        operator: 'await',
        argument: this.parseUnary(),
      };
    }
    
    if (
      this.currentToken().type === TokenType.MINUS ||
      this.currentToken().type === TokenType.NOT
    ) {
      const operator = this.currentToken().value as string;
      this.advance();
      return {
        type: 'UnaryExpression',
        operator,
        argument: this.parseUnary(),
      };
    }

    return this.parsePostfix();
  }

  private parsePostfix(): Expression {
    // Verificar se é 'new' expression
    if (this.currentToken().type === TokenType.NEW) {
      return this.parseNewExpression();
    }
    
    // Verificar se é função anônima
    if (this.currentToken().type === TokenType.FUNC) {
      return this.parseFunctionExpression();
    }
    
    let expr = this.parsePrimary();

    while (true) {
      if (this.currentToken().type === TokenType.LPAREN) {
        expr = this.parseCallExpression(expr);
      } else if (this.currentToken().type === TokenType.LBRACKET) {
        expr = this.parseIndexExpression(expr);
      } else if (this.currentToken().type === TokenType.DOT) {
        this.advance();
        const property = this.expect(TokenType.IDENTIFIER).value as string;
        expr = {
          type: 'MemberExpression',
          object: expr,
          property,
          computed: false,
        };
      } else {
        break;
      }
    }

    return expr;
  }

  private parseCallExpression(callee: Expression): CallExpression {
    this.expect(TokenType.LPAREN);

    const args: Expression[] = [];
    if (this.currentToken().type !== TokenType.RPAREN) {
      args.push(this.parseExpression());
      while (this.currentToken().type === TokenType.COMMA) {
        this.advance();
        args.push(this.parseExpression());
      }
    }

    this.expect(TokenType.RPAREN);

    return {
      type: 'CallExpression',
      callee: callee as Identifier,
      arguments: args,
    };
  }

  private parseIndexExpression(object: Expression): IndexExpression {
    this.expect(TokenType.LBRACKET);
    const index = this.parseExpression();
    this.expect(TokenType.RBRACKET);

    return {
      type: 'IndexExpression',
      object,
      index,
    };
  }

  private parsePrimary(): Expression {
    const token = this.currentToken();

    switch (token.type) {
      case TokenType.NUMBER:
      case TokenType.STRING:
      case TokenType.TRUE:
      case TokenType.FALSE:
        this.advance();
        return {
          type: 'Literal',
          value:
            token.type === TokenType.TRUE
              ? true
              : token.type === TokenType.FALSE
              ? false
              : token.value,
        };

      case TokenType.NULL:
      case TokenType.UNDEFINED:
        this.advance();
        return {
          type: 'Literal',
          value: token.type === TokenType.NULL ? null : undefined,
        };

      case TokenType.IDENTIFIER:
      case TokenType.THIS:
        const name = token.type === TokenType.THIS ? 'это' : (token.value as string);
        this.advance();
        return { type: 'Identifier', name };

      case TokenType.LPAREN:
        this.advance();
        const expr = this.parseExpression();
        this.expect(TokenType.RPAREN);
        return expr;

      case TokenType.LBRACKET:
        return this.parseArrayLiteral();

      case TokenType.LBRACE:
        return this.parseObjectLiteral();

      default:
        throw new Error(
          `Token inesperado: ${token.type} na linha ${token.line}, coluna ${token.column}`
        );
    }
  }

  private parseArrayLiteral(): ArrayLiteral {
    this.expect(TokenType.LBRACKET);

    const elements: Expression[] = [];
    if (this.currentToken().type !== TokenType.RBRACKET) {
      elements.push(this.parseExpression());
      while (this.currentToken().type === TokenType.COMMA) {
        this.advance();
        elements.push(this.parseExpression());
      }
    }

    this.expect(TokenType.RBRACKET);

    return {
      type: 'ArrayLiteral',
      elements,
    };
  }

  private parseImportStatement(): any {
    this.expect(TokenType.IMPORT);
    
    const specifiers: any[] = [];
    
    // Parse import specifiers - check for * or identifier
    if (this.currentToken().type === TokenType.MULTIPLY) {
      // import * as name from "module"
      this.advance(); // consume *
      
      if (this.currentToken().type === TokenType.AS) {
        this.advance(); // consume as
        const local = this.expect(TokenType.IDENTIFIER).value as string;
        specifiers.push({ imported: '*', local });
      } else {
        specifiers.push({ imported: '*', local: '*' });
      }
    } else if (this.currentToken().type === TokenType.IDENTIFIER) {
      // import name from "module" or import { name } from "module"
      const imported = this.currentToken().value as string;
      this.advance();
      let local = imported;
      
      if (this.currentToken().type === TokenType.AS) {
        this.advance();
        local = this.expect(TokenType.IDENTIFIER).value as string;
      }
      
      specifiers.push({ imported, local });
      
      while (this.currentToken().type === TokenType.COMMA) {
        this.advance();
        const imported2 = this.expect(TokenType.IDENTIFIER).value as string;
        let local2 = imported2;
        
        if (this.currentToken().type === TokenType.AS) {
          this.advance();
          local2 = this.expect(TokenType.IDENTIFIER).value as string;
        }
        
        specifiers.push({ imported: imported2, local: local2 });
      }
    }
    
    // Verificar se é изpkg ou измодуля
    const fromToken = this.currentToken();
    const isPkg = fromToken.value === 'изpkg' || fromToken.value === 'fromPkg';
    
    this.expect(TokenType.FROM);
    const source = this.expect(TokenType.STRING).value as string;
    this.skipNewlines();
    
    return {
      type: 'ImportStatement',
      specifiers,
      source,
      isPkg: isPkg || false,  // Marcar se é importação de pacote NPM
    };
  }

  private parseExportStatement(): any {
    this.expect(TokenType.EXPORT);
    
    const token = this.currentToken();
    let declaration;
    
    // Parse function or variable based on current token
    if (token.type === TokenType.FUNC) {
      declaration = this.parseFunctionDeclaration();
    } else if (token.type === TokenType.VAR || token.type === TokenType.LET || token.type === TokenType.CONST) {
      declaration = this.parseVariableDeclaration();
    } else {
      throw new Error('exporte só pode ser usado com funções ou variáveis');
    }
    
    return {
      type: 'ExportStatement',
      declaration,
    };
  }

  private parseBreakStatement(): any {
    this.expect(TokenType.BREAK);
    this.skipNewlines();
    return {
      type: 'BreakStatement',
    };
  }

  private parseContinueStatement(): any {
    this.expect(TokenType.CONTINUE);
    this.skipNewlines();
    return {
      type: 'ContinueStatement',
    };
  }

  private parseTryStatement(): any {
    this.expect(TokenType.TRY);
    const block = this.parseBlockStatement();
    
    let handler: any = undefined;
    if (this.currentToken().type === TokenType.CATCH) {
      this.advance();
      this.expect(TokenType.LPAREN);
      let param: string | undefined = undefined;
      if (this.currentToken().type === TokenType.IDENTIFIER) {
        param = this.currentToken().value as string;
        this.advance();
      }
      this.expect(TokenType.RPAREN);
      const body = this.parseBlockStatement();
      handler = { param, body };
    }
    
    let finalizer: any = undefined;
    if (this.currentToken().type === TokenType.FINALLY) {
      this.advance();
      finalizer = this.parseBlockStatement();
    }
    
    return {
      type: 'TryStatement',
      block,
      handler,
      finalizer,
    };
  }

  private parseThrowStatement(): any {
    this.expect(TokenType.THROW);
    const argument = this.parseExpression();
    this.skipNewlines();
    return {
      type: 'ThrowStatement',
      argument,
    };
  }

  private parseObjectLiteral(): any {
    this.expect(TokenType.LBRACE);

    const properties: any[] = [];
    this.skipNewlines();

    while (this.currentToken().type !== TokenType.RBRACE) {
      const key = this.expect(TokenType.IDENTIFIER).value as string;
      this.expect(TokenType.ASSIGN);
      const value = this.parseExpression();
      properties.push({ key, value, computed: false });

      this.skipNewlines();
      if (this.currentToken().type === TokenType.COMMA) {
        this.advance();
        this.skipNewlines();
      }
    }

    this.expect(TokenType.RBRACE);

      return {
        type: 'ObjectLiteral',
        properties,
      };
    }

  private parseClassDeclaration(): ClassDeclaration {
    this.expect(TokenType.CLASS);
    const name = this.expect(TokenType.IDENTIFIER).value as string;
    
    let superClass: Identifier | undefined;
    if (this.currentToken().type === TokenType.EXTENDS) {
      this.advance();
      superClass = {
        type: 'Identifier',
        name: this.expect(TokenType.IDENTIFIER).value as string,
      };
    }
    
    this.expect(TokenType.LBRACE);
    const body = this.parseClassBody();
    this.expect(TokenType.RBRACE);
    
    return {
      type: 'ClassDeclaration',
      name,
      superClass,
      body,
    };
  }

  private parseClassBody(): ClassBody {
    const methods: ClassMethod[] = [];
    this.skipNewlines();
    
    while (this.currentToken().type !== TokenType.RBRACE) {
      if (this.currentToken().type === TokenType.FUNC) {
        this.advance();
        const key = this.expect(TokenType.IDENTIFIER).value as string;
        const kind: 'constructor' | 'method' = key === 'конструктор' || key === 'constructor' ? 'constructor' : 'method';
        
        this.expect(TokenType.LPAREN);
        const params: string[] = [];
        if (this.currentToken().type !== TokenType.RPAREN) {
          params.push(this.expect(TokenType.IDENTIFIER).value as string);
          while (this.currentToken().type === TokenType.COMMA) {
            this.advance();
            params.push(this.expect(TokenType.IDENTIFIER).value as string);
          }
        }
        this.expect(TokenType.RPAREN);
        
        const body = this.parseBlockStatement();
        
        methods.push({
          type: 'ClassMethod',
          key,
          kind,
          params,
          body,
        });
      } else {
        this.advance(); // Skip unknown tokens
      }
      this.skipNewlines();
    }
    
    return {
      type: 'ClassBody',
      body: methods,
    };
  }

  private parseNewExpression(): NewExpression {
    this.expect(TokenType.NEW);
    const callee = this.parsePrimary() as Identifier | MemberExpression;
    
    this.expect(TokenType.LPAREN);
    const args: Expression[] = [];
    if (this.currentToken().type !== TokenType.RPAREN) {
      args.push(this.parseExpression());
      while (this.currentToken().type === TokenType.COMMA) {
        this.advance();
        args.push(this.parseExpression());
      }
    }
    this.expect(TokenType.RPAREN);
    
    return {
      type: 'NewExpression',
      callee,
      arguments: args,
    };
  }

  private parseFunctionExpression(): FunctionExpression {
    // Verificar se é função async
    const isAsync = this.currentToken().type === TokenType.ASYNC;
    if (isAsync) {
      this.advance(); // Consumir ASYNC
    }
    
    this.expect(TokenType.FUNC);
    
    let name: string | undefined;
    if (this.currentToken().type === TokenType.IDENTIFIER) {
      name = this.currentToken().value as string;
      this.advance();
    }
    
    this.expect(TokenType.LPAREN);
    const params: string[] = [];
    if (this.currentToken().type !== TokenType.RPAREN) {
      params.push(this.expect(TokenType.IDENTIFIER).value as string);
      while (this.currentToken().type === TokenType.COMMA) {
        this.advance();
        params.push(this.expect(TokenType.IDENTIFIER).value as string);
      }
    }
    this.expect(TokenType.RPAREN);
    
    const body = this.parseBlockStatement();
    
    return {
      type: 'FunctionExpression',
      name,
      params,
      body,
      async: isAsync || undefined,
    };
  }
}

