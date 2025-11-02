/**
 * Native Standard Library Implementations
 * Bibliotecas nativas em TypeScript para o Trest Language
 */

import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';

/**
 * ========================================
 * HTTP Module - Cliente e Servidor HTTP
 * ========================================
 */
export class StdHTTP {
  /**
   * GET Request
   */
  static async GET(url: string, options: any = {}): Promise<any> {
    return this.request(url, 'GET', null, options);
  }

  /**
   * POST Request
   */
  static async POST(url: string, data: any, options: any = {}): Promise<any> {
    return this.request(url, 'POST', data, options);
  }

  /**
   * PUT Request
   */
  static async PUT(url: string, data: any, options: any = {}): Promise<any> {
    return this.request(url, 'PUT', data, options);
  }

  /**
   * DELETE Request
   */
  static async DELETE(url: string, options: any = {}): Promise<any> {
    return this.request(url, 'DELETE', null, options);
  }

  /**
   * Generic HTTP Request
   */
  private static request(
    urlStr: string,
    method: string,
    data: any = null,
    options: any = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const url = new URL(urlStr);
        const isHttps = url.protocol === 'https:';

        const requestOptions = {
          hostname: url.hostname,
          port: url.port || (isHttps ? 443 : 80),
          path: url.pathname + url.search,
          method: method,
          headers: options.headers || {
            'Content-Type': 'application/json',
          },
        };

        const client = isHttps ? https : http;

        const req = client.request(requestOptions, (res: any) => {
          let body = '';

          res.on('data', (chunk: any) => {
            body += chunk;
          });

          res.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              resolve({
                status: res.statusCode,
                data: parsed,
                headers: res.headers,
              });
            } catch {
              resolve({
                status: res.statusCode,
                data: body,
                headers: res.headers,
              });
            }
          });
        });

        req.on('error', (error: any) => {
          reject({ status: 0, error: error.message });
        });

        if (data) {
          const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
          req.write(dataStr);
        }

        req.end();
      } catch (error: any) {
        reject({ status: 0, error: error.message });
      }
    });
  }

  /**
   * Create HTTP Server
   */
  static createServer(): any {
    const routes: Map<string, Map<string, Function>> = new Map();

    const addRoute = (method: string, path: string, handler: Function) => {
      if (!routes.has(path)) {
        routes.set(path, new Map());
      }
      routes.get(path)!.set(method, handler);
    };

    const server = http.createServer((req, res) => {
      const handlers = routes.get(req.url || '/');
      const handler = handlers?.get(req.method || 'GET');

      if (handler) {
        const requestObj = {
          url: req.url,
          method: req.method,
          headers: req.headers,
          body: '',
        };

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            requestObj.body = JSON.parse(body);
          } catch {
            requestObj.body = body;
          }

          const responseObj = {
            status: (code: number) => {
              res.statusCode = code;
              return responseObj;
            },
            send: (data: any) => {
              const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
              res.end(dataStr);
              return responseObj;
            },
            json: (data: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return responseObj;
            },
          };

          handler(requestObj, responseObj);
        });
      } else {
        res.statusCode = 404;
        res.end('Not Found');
      }
    });

    return {
      listen: (port: number, callback?: Function) => {
        server.listen(port, () => {
          if (callback) callback();
        });
      },
      get: (path: string, handler: Function) => addRoute('GET', path, handler),
      post: (path: string, handler: Function) => addRoute('POST', path, handler),
      put: (path: string, handler: Function) => addRoute('PUT', path, handler),
      delete: (path: string, handler: Function) => addRoute('DELETE', path, handler),
    };
  }

  /**
   * Fetch API
   */
  static async fetch(url: string, options: any = {}): Promise<any> {
    return this.request(url, options.method || 'GET', options.body, options);
  }
}

/**
 * ========================================
 * Async Module - Promises, Delay
 * ========================================
 */
export class StdAsync {
  /**
   * Create Promise
   */
  static createPromise(executor: Function): any {
    return new Promise((resolve, reject) => {
      executor(resolve, reject);
    });
  }

  /**
   * Promise.all
   */
  static allPromises(promises: any[]): Promise<any> {
    return Promise.all(promises);
  }

  /**
   * Promise.race
   */
  static anyPromise(promises: any[]): Promise<any> {
    return Promise.race(promises);
  }

  /**
   * Delay/Sleep
   */
  static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * setInterval
   */
  static repeatInterval(fn: Function, ms: number): number {
    return setInterval(() => fn(), ms) as any;
  }

  /**
   * clearInterval
   */
  static clearRepeat(id: number): void {
    clearInterval(id);
  }

  /**
   * setTimeout
   */
  static setTimer(fn: Function, ms: number): number {
    return setTimeout(() => fn(), ms) as any;
  }

  /**
   * clearTimeout
   */
  static clearTimer(id: number): void {
    clearTimeout(id);
  }
}

/**
 * ========================================
 * GUI Module - Interface Gráfica
 * ========================================
 */
export class StdGUI {
  /**
   * Create Terminal
   */
  static createTerminal(): any {
    return {
      clear: () => {
        console.clear();
      },
      printAt: (x: number, y: number, text: string) => {
        // Basic terminal positioning
        process.stdout.write(`\x1b[${y};${x}H${text}`);
      },
      getHeight: () => process.stdout.rows || 24,
      getWidth: () => process.stdout.columns || 80,
    };
  }

  /**
   * Create Window (placeholder)
   */
  static createWindow(options: any): any {
    console.log(`Creating window: ${options.title || 'Untitled'}`);
    return {
      show: () => console.log('Window shown'),
      hide: () => console.log('Window hidden'),
      close: () => console.log('Window closed'),
      addComponent: (component: any) => {
        console.log('Component added', component);
      },
    };
  }

  /**
   * Create Button
   */
  static createButton(text: string, onClick: Function): any {
    return {
      text,
      click: onClick,
      disable: () => console.log(`Button "${text}" disabled`),
      enable: () => console.log(`Button "${text}" enabled`),
    };
  }

  /**
   * Create Text Input
   */
  static createText(placeholder: string, onChange: Function): any {
    return {
      value: '',
      change: onChange,
      focus: () => console.log('Text focused'),
      blur: () => console.log('Text blurred'),
    };
  }

  /**
   * Create List
   */
  static createList(data: any[], onSelect: Function): any {
    return {
      data,
      select: onSelect,
      update: (newData: any[]) => {
        data = newData;
        console.log('List updated');
      },
    };
  }

  /**
   * Component Container
   */
  static componentContainer(children: any[]): any {
    return {
      children,
      add: (component: any) => {
        children.push(component);
      },
      remove: (component: any) => {
        const index = children.indexOf(component);
        if (index > -1) children.splice(index, 1);
      },
    };
  }

  /**
   * Component Label
   */
  static componentLabel(text: string): any {
    return { text };
  }

  /**
   * Component Image
   */
  static componentImage(src: string): any {
    return {
      src,
      show: () => console.log(`Image shown: ${src}`),
      hide: () => console.log(`Image hidden: ${src}`),
    };
  }
}

/**
 * ========================================
 * Database Module - SQLite
 * ========================================
 */
export class StdDatabase {
  private static dbConnections: Map<string, any> = new Map();

  /**
   * Open Database
   */
  static openDB(dbPath: string): any {
    if (this.dbConnections.has(dbPath)) {
      return this.dbConnections.get(dbPath);
    }

    // For now, use file-based mock database
    const db = {
      path: dbPath,
      execute: (query: string, params: any[] = []) => {
        console.log(`[DB] Executing: ${query}`, params);
        return { success: true };
      },
      query: (query: string, params: any[] = []) => {
        console.log(`[DB] Querying: ${query}`, params);
        return [];
      },
      transaction: (fn: Function) => {
        console.log('[DB] Transaction started');
        fn();
        console.log('[DB] Transaction committed');
      },
      close: () => {
        console.log(`[DB] Closed: ${dbPath}`);
        this.dbConnections.delete(dbPath);
      },
    };

    this.dbConnections.set(dbPath, db);
    return db;
  }

  /**
   * Query Builder
   */
  static createQueryBuilder(table: string): any {
    const builder = {
      table,
      selectFields: '*',
      whereClause: '',
      orderClause: '',
      limitValue: '',
      conditions: [] as any[],

      select: function(fields: string) {
        this.selectFields = fields;
        return this;
      },
      where: function(condition: string) {
        this.whereClause = `WHERE ${condition}`;
        return this;
      },
      order: function(field: string) {
        this.orderClause = `ORDER BY ${field}`;
        return this;
      },
      limit: function(n: number) {
        this.limitValue = `LIMIT ${n}`;
        return this;
      },
      execute: function() {
        const sql = `SELECT ${this.selectFields} FROM ${this.table} ${this.whereClause} ${this.orderClause} ${this.limitValue}`;
        console.log(`[Query Builder] ${sql}`);
        return [];
      },
    };

    return builder;
  }

  /**
   * Basic Model
   */
  static Model(table: string): any {
    return {
      table,
      find: (id: number) => {
        console.log(`[Model] Finding ${table} with id: ${id}`);
        return null;
      },
      all: () => {
        console.log(`[Model] Getting all ${table}`);
        return [];
      },
      create: (data: any) => {
        console.log(`[Model] Creating ${table}:`, data);
        return { id: 1, ...data };
      },
      update: (id: number, data: any) => {
        console.log(`[Model] Updating ${table} ${id}:`, data);
        return { success: true };
      },
      delete: (id: number) => {
        console.log(`[Model] Deleting ${table} ${id}`);
        return { success: true };
      },
    };
  }
}

/**
 * ========================================
 * Enhanced File System Module
 * ========================================
 */
export class StdFileSystem {
  /**
   * Read File
   */
  static readFile(filePath: string): string {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error: any) {
      throw new Error(`Cannot read file: ${error.message}`);
    }
  }

  /**
   * Write File
   */
  static writeFile(filePath: string, content: string): void {
    try {
      fs.writeFileSync(filePath, content, 'utf-8');
    } catch (error: any) {
      throw new Error(`Cannot write file: ${error.message}`);
    }
  }

  /**
   * File Exists
   */
  static exists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Delete File
   */
  static deleteFile(filePath: string): void {
    try {
      fs.unlinkSync(filePath);
    } catch (error: any) {
      throw new Error(`Cannot delete file: ${error.message}`);
    }
  }

  /**
   * List Directory
   */
  static listDir(dirPath: string): string[] {
    try {
      return fs.readdirSync(dirPath);
    } catch (error: any) {
      throw new Error(`Cannot list directory: ${error.message}`);
    }
  }

  /**
   * Create Directory
   */
  static createDir(dirPath: string): void {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
    } catch (error: any) {
      throw new Error(`Cannot create directory: ${error.message}`);
    }
  }

  /**
   * Delete Directory
   */
  static deleteDir(dirPath: string): void {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } catch (error: any) {
      throw new Error(`Cannot delete directory: ${error.message}`);
    }
  }

  /**
   * Get File Stats
   */
  static getStats(filePath: string): any {
    try {
      const stats = fs.statSync(filePath);
      return {
        size: stats.size,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    } catch (error: any) {
      throw new Error(`Cannot get stats: ${error.message}`);
    }
  }
}

/**
 * ========================================
 * JSON Module
 * ========================================
 */
export class StdJSON {
  /**
   * Parse JSON
   */
  static parse(jsonStr: string): any {
    try {
      return JSON.parse(jsonStr);
    } catch (error: any) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }
  }

  /**
   * Stringify JSON
   */
  static stringify(obj: any, indent: number = 0): string {
    return JSON.stringify(obj, null, indent);
  }
}

/**
 * ========================================
 * Date Module
 * ========================================
 */
export class StdDate {
  /**
   * Current Date
   */
  static now(): Date {
    return new Date();
  }

  /**
   * Format Date
   */
  static format(date: Date, formatStr: string = 'YYYY-MM-DD HH:mm:ss'): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return formatStr
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Get Timezone
   */
  static timezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}

/**
 * ========================================
 * Crypto Module
 * ========================================
 */
import * as crypto from 'crypto';

export class StdCrypto {
  /**
   * Hash MD5
   */
  static md5(text: string): string {
    return crypto.createHash('md5').update(text).digest('hex');
  }

  /**
   * Hash SHA256
   */
  static sha256(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * Hash SHA512
   */
  static sha512(text: string): string {
    return crypto.createHash('sha512').update(text).digest('hex');
  }

  /**
   * Random Bytes
   */
  static randomBytes(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Encrypt AES
   */
  static encrypt(text: string, key: string): string {
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key.slice(0, 32).padEnd(32, '0')), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypt AES
   */
  static decrypt(encrypted: string, key: string): string {
    const algorithm = 'aes-256-cbc';
    const parts = encrypted.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key.slice(0, 32).padEnd(32, '0')), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

/**
 * ========================================
 * RegEx Module - Expressões Regulares
 * ========================================
 */
export class StdRegEx {
  /**
   * Create Regex Pattern
   */
  static create(pattern: string, flags: string = ''): any {
    return { pattern, flags, regex: new RegExp(pattern, flags) };
  }

  /**
   * Test Pattern
   */
  static test(pattern: string, text: string, flags: string = ''): boolean {
    const regex = new RegExp(pattern, flags);
    return regex.test(text);
  }

  /**
   * Match Pattern
   */
  static match(pattern: string, text: string, flags: string = ''): any {
    const regex = new RegExp(pattern, flags);
    const matches = text.match(regex);
    return matches ? { matches, groups: [] } : null;
  }

  /**
   * Find All Matches
   */
  static findAll(pattern: string, text: string, flags: string = 'g'): string[] {
    const regex = new RegExp(pattern, flags);
    const matches = text.matchAll(regex);
    const result: string[] = [];
    for (const match of matches) {
      result.push(match[0]);
    }
    return result;
  }

  /**
   * Replace Pattern
   */
  static replace(pattern: string, text: string, replacement: string, flags: string = 'g'): string {
    const regex = new RegExp(pattern, flags);
    return text.replace(regex, replacement);
  }

  /**
   * Split by Pattern
   */
  static split(pattern: string, text: string, limit?: number): string[] {
    const regex = new RegExp(pattern);
    return limit ? text.split(regex, limit) : text.split(regex);
  }
}

/**
 * ========================================
 * Path Module - Manipulação de Caminhos
 * ========================================
 */
export class StdPath {
  /**
   * Join Path Segments
   */
  static join(...segments: string[]): string {
    return path.join(...segments);
  }

  /**
   * Resolve Absolute Path
   */
  static resolve(...segments: string[]): string {
    return path.resolve(...segments);
  }

  /**
   * Get Directory Name
   */
  static dirname(filePath: string): string {
    return path.dirname(filePath);
  }

  /**
   * Get Base Name
   */
  static basename(filePath: string, ext?: string): string {
    return path.basename(filePath, ext);
  }

  /**
   * Get Extension
   */
  static extname(filePath: string): string {
    return path.extname(filePath);
  }

  /**
   * Normalize Path
   */
  static normalize(filePath: string): string {
    return path.normalize(filePath);
  }

  /**
   * Is Absolute Path
   */
  static isAbsolute(filePath: string): boolean {
    return path.isAbsolute(filePath);
  }

  /**
   * Relative Path Between Two
   */
  static relative(from: string, to: string): string {
    return path.relative(from, to);
  }
}

/**
 * ========================================
 * Process Module - Variáveis de Ambiente
 * ========================================
 */
export class StdProcess {
  /**
   * Get Environment Variable
   */
  static getEnv(key: string): string | undefined {
    return process.env[key];
  }

  /**
   * Get All Environment Variables
   */
  static getAllEnv(): { [key: string]: string } {
    const env: { [key: string]: string } = {};
    for (const [key, value] of Object.entries(process.env)) {
      if (value !== undefined) {
        env[key] = value;
      }
    }
    return env;
  }

  /**
   * Set Environment Variable (runtime)
   */
  static setEnv(key: string, value: string): void {
    process.env[key] = value;
  }

  /**
   * Platform
   */
  static get platform(): string {
    return process.platform;
  }

  /**
   * Architecture
   */
  static get arch(): string {
    return process.arch;
  }

  /**
   * Node Version
   */
  static get version(): string {
    return process.version;
  }

  /**
   * Working Directory
   */
  static get cwd(): string {
    return process.cwd();
  }

  /**
   * Change Directory
   */
  static chdir(directory: string): void {
    process.chdir(directory);
  }

  /**
   * Exit Process
   */
  static exit(code: number = 0): void {
    process.exit(code);
  }

  /**
   * Current PID
   */
  static get pid(): number {
    return process.pid;
  }
}

/**
 * Export all modules
 */
export const StdModules = {
  HTTP: StdHTTP,
  Async: StdAsync,
  GUI: StdGUI,
  Database: StdDatabase,
  FileSystem: StdFileSystem,
  JSON: StdJSON,
  Date: StdDate,
  Crypto: StdCrypto,
  RegEx: StdRegEx,
  Path: StdPath,
  Process: StdProcess,
};

