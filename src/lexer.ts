export enum TokenType {
  // Literais
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  
  // Identificadores
  IDENTIFIER = 'IDENTIFIER',
  
  // Operadores
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  MODULO = 'MODULO',
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
  LESS = 'LESS',
  LESS_EQUAL = 'LESS_EQUAL',
  GREATER = 'GREATER',
  GREATER_EQUAL = 'GREATER_EQUAL',
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  ASSIGN = 'ASSIGN',
  
  // Delimitadores
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  LBRACE = 'LBRACE',
  RBRACE = 'RBRACE',
  LBRACKET = 'LBRACKET',
  RBRACKET = 'RBRACKET',
  COMMA = 'COMMA',
  SEMICOLON = 'SEMICOLON',
  DOT = 'DOT',
  
  // Palavras-chave
  IF = 'IF',
  ELSE = 'ELSE',
  WHILE = 'WHILE',
  FOR = 'FOR',
  FUNC = 'FUNC',
  RETURN = 'RETURN',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  VAR = 'VAR',
  LET = 'LET',
  CONST = 'CONST',
  PRINT = 'PRINT',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  FROM = 'FROM',
  AS = 'AS',
  BREAK = 'BREAK',
  CONTINUE = 'CONTINUE',
  CLASS = 'CLASS',
  NEW = 'NEW',
  THIS = 'THIS',
  TRY = 'TRY',
  CATCH = 'CATCH',
  THROW = 'THROW',
  FINALLY = 'FINALLY',
  SWITCH = 'SWITCH',
  CASE = 'CASE',
  DEFAULT = 'DEFAULT',
  DO = 'DO',
  INTERFACE = 'INTERFACE',
  EXTENDS = 'EXTENDS',
  IMPLEMENTS = 'IMPLEMENTS',
  STATIC = 'STATIC',
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  PROTECTED = 'PROTECTED',
  ASYNC = 'ASYNC',
  AWAIT = 'AWAIT',
  ALL = 'ALL',
  MODULE = 'MODULE',
  IN = 'IN',
  OF = 'OF',
  NULL = 'NULL',
  UNDEFINED = 'UNDEFINED',
  
  // Template strings
  TEMPLATE_START = 'TEMPLATE_START',
  TEMPLATE_END = 'TEMPLATE_END',
  TEMPLATE_EXPR = 'TEMPLATE_EXPR',
  
  // Spread/Rest
  SPREAD = 'SPREAD',
  REST = 'REST',
  
  // Operadores avançados
  TERNARY = 'TERNARY',
  Q_MARK = 'Q_MARK',
  POW = 'POW',
  NULLISH_COALESCING = 'NULLISH_COALESCING',
  OPTIONAL_CHAIN = 'OPTIONAL_CHAIN',
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT',
  PLUS_ASSIGN = 'PLUS_ASSIGN',
  MINUS_ASSIGN = 'MINUS_ASSIGN',
  MULTIPLY_ASSIGN = 'MULTIPLY_ASSIGN',
  DIVIDE_ASSIGN = 'DIVIDE_ASSIGN',
  COLON = 'COLON',
  
  // Especiais
  EOF = 'EOF',
  NEWLINE = 'NEWLINE',
}

export interface Token {
  type: TokenType;
  value: string | number | boolean;
  line: number;
  column: number;
}

export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private currentChar: string | null = null;

  private keywords: { [key: string]: TokenType } = {
    // Ключевые слова только на кириллице
    'если': TokenType.IF,
    'иначе': TokenType.ELSE,
    'иначеесли': TokenType.ELSE,
    'пока': TokenType.WHILE,
    'для': TokenType.FOR,
    'функция': TokenType.FUNC,
    'вернуть': TokenType.RETURN,
    'истина': TokenType.TRUE,
    'ложь': TokenType.FALSE,
    'перем': TokenType.VAR,
    'пусть': TokenType.LET,
    'конст': TokenType.CONST,
    'печать': TokenType.PRINT,
    'импорт': TokenType.IMPORT,
    'экспорт': TokenType.EXPORT,
    'измодуля': TokenType.FROM,
    'как': TokenType.AS,
    'прервать': TokenType.BREAK,
    'продолжить': TokenType.CONTINUE,
    'класс': TokenType.CLASS,
    'новый': TokenType.NEW,
    'это': TokenType.THIS,
    'попытаться': TokenType.TRY,
    'перехватить': TokenType.CATCH,
    'бросить': TokenType.THROW,
    'наконец': TokenType.FINALLY,
    'переключатель': TokenType.SWITCH,
    'случай': TokenType.CASE,
    'поумолчанию': TokenType.DEFAULT,
    'делать': TokenType.DO,
    'интерфейс': TokenType.INTERFACE,
    'расширяет': TokenType.EXTENDS,
    'реализует': TokenType.IMPLEMENTS,
    'статический': TokenType.STATIC,
    'публичный': TokenType.PUBLIC,
    'приватный': TokenType.PRIVATE,
    'защищенный': TokenType.PROTECTED,
    'асинхронный': TokenType.ASYNC,
    'ожидать': TokenType.AWAIT,
    'все': TokenType.ALL,
    'модуль': TokenType.MODULE,
    'в': TokenType.IN,
    'из': TokenType.OF,
    'нуль': TokenType.NULL,
    'неопределен': TokenType.UNDEFINED,
  };

  constructor(input: string) {
    this.input = input;
    this.currentChar = this.input[0] || null;
  }

  private advance(): void {
    if (this.currentChar === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.position++;
    this.currentChar = this.position < this.input.length 
      ? this.input[this.position] 
      : null;
  }

  private skipWhitespace(): void {
    while (this.currentChar !== null && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  private skipComment(): void {
    if (this.currentChar === '#') {
      while (this.currentChar !== null) {
        // @ts-ignore - Type narrowing issue
        if (this.currentChar === '\n' || this.currentChar === '\r') {
          break;
        }
        this.advance();
      }
    }
  }

  private readNumber(): Token {
    let num = '';
    const startLine = this.line;
    const startColumn = this.column;

    while (this.currentChar !== null && /[\d.]/.test(this.currentChar)) {
      num += this.currentChar;
      this.advance();
    }

    return {
      type: TokenType.NUMBER,
      value: num.includes('.') ? parseFloat(num) : parseInt(num, 10),
      line: startLine,
      column: startColumn,
    };
  }

  private readString(): Token {
    const quote = this.currentChar;
    this.advance();
    let str = '';
    const startLine = this.line;
    const startColumn = this.column;

    while (this.currentChar !== null && this.currentChar !== quote) {
      if (this.currentChar === '\\') {
        this.advance();
        if (this.currentChar !== null) {
          const escaped: string = this.currentChar as string;
          switch (escaped) {
            case 'n': str += '\n'; break;
            case 't': str += '\t'; break;
            case 'r': str += '\r'; break;
            case '\\': str += '\\'; break;
            case '"': str += '"'; break;
            case "'": str += "'"; break;
            default: str += escaped;
          }
          this.advance();
        }
      } else {
        str += this.currentChar;
        this.advance();
      }
    }

    if (this.currentChar === quote) {
      this.advance();
    }

    return {
      type: TokenType.STRING,
      value: str,
      line: startLine,
      column: startColumn,
    };
  }

  private readIdentifier(): Token {
    let id = '';
    const startLine = this.line;
    const startColumn = this.column;

    while (
      this.currentChar !== null &&
      /[a-zA-Z_áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇа-яА-ЯёЁ0-9]/.test(this.currentChar)
    ) {
      id += this.currentChar;
      this.advance();
    }

    // Para palavras-chave, verificar exatamente (case-sensitive para cirílico)
    const keyword = this.keywords[id] || this.keywords[id.toLowerCase()];
    if (keyword) {
      return {
        type: keyword,
        value: id,
        line: startLine,
        column: startColumn,
      };
    }

    return {
      type: TokenType.IDENTIFIER,
      value: id,
      line: startLine,
      column: startColumn,
    };
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.currentChar !== null) {
      this.skipWhitespace();
      this.skipComment();

      if (this.currentChar === null) break;

      const startLine = this.line;
      const startColumn = this.column;

      // Números
      if (/\d/.test(this.currentChar)) {
        tokens.push(this.readNumber());
        continue;
      }

      // Strings
      if (this.currentChar === '"' || this.currentChar === "'") {
        tokens.push(this.readString());
        continue;
      }


      // Identificadores e palavras-chave (suporta latino, cirílico e português)
      if (/[a-zA-Z_áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇа-яА-ЯёЁ]/.test(this.currentChar)) {
        tokens.push(this.readIdentifier());
        continue;
      }

      // Operadores e delimitadores
      switch (this.currentChar) {
        case '+':
          tokens.push({ type: TokenType.PLUS, value: '+', line: startLine, column: startColumn });
          this.advance();
          break;
        case '-':
          tokens.push({ type: TokenType.MINUS, value: '-', line: startLine, column: startColumn });
          this.advance();
          break;
        case '*':
          this.advance();
          if (this.currentChar === '*') {
            tokens.push({ type: TokenType.POW, value: '**', line: startLine, column: startColumn });
            this.advance();
          } else {
            tokens.push({ type: TokenType.MULTIPLY, value: '*', line: startLine, column: startColumn });
          }
          break;
        case '/':
          tokens.push({ type: TokenType.DIVIDE, value: '/', line: startLine, column: startColumn });
          this.advance();
          break;
        case '%':
          tokens.push({ type: TokenType.MODULO, value: '%', line: startLine, column: startColumn });
          this.advance();
          break;
        case '=':
          this.advance();
          if (this.currentChar === '=') {
            tokens.push({ type: TokenType.EQUAL, value: '==', line: startLine, column: startColumn });
            this.advance();
          } else {
            tokens.push({ type: TokenType.ASSIGN, value: '=', line: startLine, column: startColumn });
          }
          break;
        case '!':
          this.advance();
          // @ts-ignore - Type narrowing issue
          if (this.currentChar === '=') {
            tokens.push({ type: TokenType.NOT_EQUAL, value: '!=', line: startLine, column: startColumn });
            this.advance();
          } else {
            tokens.push({ type: TokenType.NOT, value: '!', line: startLine, column: startColumn });
          }
          break;
        case '<':
          this.advance();
          // @ts-ignore - Type narrowing issue
          if (this.currentChar === '=') {
            tokens.push({ type: TokenType.LESS_EQUAL, value: '<=', line: startLine, column: startColumn });
            this.advance();
          } else {
            tokens.push({ type: TokenType.LESS, value: '<', line: startLine, column: startColumn });
          }
          break;
        case '>':
          this.advance();
          // @ts-ignore - Type narrowing issue
          if (this.currentChar === '=') {
            tokens.push({ type: TokenType.GREATER_EQUAL, value: '>=', line: startLine, column: startColumn });
            this.advance();
          } else {
            tokens.push({ type: TokenType.GREATER, value: '>', line: startLine, column: startColumn });
          }
          break;
        case '&':
          this.advance();
          if (this.currentChar === '&') {
            tokens.push({ type: TokenType.AND, value: '&&', line: startLine, column: startColumn });
            this.advance();
          }
          break;
        case '|':
          this.advance();
          if (this.currentChar === '|') {
            tokens.push({ type: TokenType.OR, value: '||', line: startLine, column: startColumn });
            this.advance();
          }
          break;
        case '(':
          tokens.push({ type: TokenType.LPAREN, value: '(', line: startLine, column: startColumn });
          this.advance();
          break;
        case ')':
          tokens.push({ type: TokenType.RPAREN, value: ')', line: startLine, column: startColumn });
          this.advance();
          break;
        case '{':
          tokens.push({ type: TokenType.LBRACE, value: '{', line: startLine, column: startColumn });
          this.advance();
          break;
        case '}':
          tokens.push({ type: TokenType.RBRACE, value: '}', line: startLine, column: startColumn });
          this.advance();
          break;
        case '[':
          tokens.push({ type: TokenType.LBRACKET, value: '[', line: startLine, column: startColumn });
          this.advance();
          break;
        case ']':
          tokens.push({ type: TokenType.RBRACKET, value: ']', line: startLine, column: startColumn });
          this.advance();
          break;
        case ',':
          tokens.push({ type: TokenType.COMMA, value: ',', line: startLine, column: startColumn });
          this.advance();
          break;
        case ';':
          tokens.push({ type: TokenType.SEMICOLON, value: ';', line: startLine, column: startColumn });
          this.advance();
          break;
        case '?':
          tokens.push({ type: TokenType.Q_MARK, value: '?', line: startLine, column: startColumn });
          this.advance();
          break;
        case ':':
          tokens.push({ type: TokenType.COLON, value: ':', line: startLine, column: startColumn });
          this.advance();
          break;
        case '.':
          tokens.push({ type: TokenType.DOT, value: '.', line: startLine, column: startColumn });
          this.advance();
          break;
        case '\n':
          tokens.push({ type: TokenType.NEWLINE, value: '\n', line: startLine, column: startColumn });
          this.advance();
          break;
        case '\r':
        case '\t':
        case '\f':
        case '\v':
          // Игнорировать общие управляющие символы
          this.advance();
          break;
        default:
          // Игнорировать невидимые символы (BOM, zero-width spaces, etc.)
          if (this.currentChar && /[\u200B-\u200D\uFEFF]/.test(this.currentChar)) {
            this.advance();
            break;
          }
          const charCode = this.currentChar ? this.currentChar.charCodeAt(0) : 0;
          throw new Error(
            `Неожиданный символ: ${this.currentChar} (код: ${charCode}) на строке ${startLine}, колонке ${startColumn}`
          );
      }
    }

    tokens.push({ type: TokenType.EOF, value: '', line: this.line, column: this.column });
    return tokens;
  }
}

