export class TrestError extends Error {
  constructor(
    public message: string,
    public line: number,
    public column: number,
    public source?: string
  ) {
    super(message);
    this.name = 'TrestError';
    Error.captureStackTrace(this, this.constructor);
  }

  public format(): string {
    const lines = this.source?.split('\n') || [];
    const lineContent = lines[this.line - 1] || '';
    const pointer = ' '.repeat(this.column - 1) + '^';
    
    return [
      `Erro na linha ${this.line}, coluna ${this.column}:`,
      this.message,
      '',
      `${this.line} | ${lineContent}`,
      `   | ${pointer}`,
    ].join('\n');
  }
}

export class SyntaxError extends TrestError {
  constructor(message: string, line: number, column: number, source?: string) {
    super(message, line, column, source);
    this.name = 'SyntaxError';
  }
}

export class TypeError extends TrestError {
  constructor(message: string, line: number, column: number, source?: string) {
    super(message, line, column, source);
    this.name = 'TypeError';
  }
}

export class RuntimeError extends TrestError {
  constructor(message: string, line: number, column: number, source?: string) {
    super(message, line, column, source);
    this.name = 'RuntimeError';
  }
}

export class ImportError extends TrestError {
  constructor(message: string, line: number, column: number, source?: string) {
    super(message, line, column, source);
    this.name = 'ImportError';
  }
}

