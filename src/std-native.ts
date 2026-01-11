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
    const paramRoutes: Array<{ method: string; pattern: RegExp; path: string; handler: Function }> = [];
    const wildcardRoutes: Array<{ method: string; handler: Function }> = [];

    const addRoute = (method: string, path: string, handler: Function) => {
      // Se for wildcard (*), adicionar à lista de wildcards
      if (path === '*') {
        wildcardRoutes.push({ method, handler });
        return;
      }
      
      // Verificar se a rota tem parâmetros (ex: /api/users/:id)
      if (path.includes(':')) {
        // Converter rota com parâmetros para regex
        // /api/users/:id -> /api/users/([^/]+)
        const patternStr = '^' + path.replace(/:[^/]+/g, '([^/]+)') + '$';
        const pattern = new RegExp(patternStr);
        paramRoutes.push({ method, pattern, path, handler });
        return;
      }
      
      // Rota exata
      if (!routes.has(path)) {
        routes.set(path, new Map());
      }
      routes.get(path)!.set(method, handler);
    };

    const findHandler = (method: string, pathname: string): { handler: Function; params?: any } | null => {
      // Primeiro, tentar encontrar rota exata
      const handlers = routes.get(pathname);
      const exactHandler = handlers?.get(method);
      if (exactHandler) {
        return { handler: exactHandler };
      }

      // Tentar rotas com parâmetros
      for (const paramRoute of paramRoutes) {
        if (paramRoute.method === method || paramRoute.method === '*') {
          const match = pathname.match(paramRoute.pattern);
          if (match) {
            // Extrair nomes dos parâmetros da rota original
            const paramNames: string[] = [];
            const pathParts = paramRoute.path.split('/');
            for (const part of pathParts) {
              if (part.startsWith(':')) {
                paramNames.push(part.substring(1));
              }
            }
            
            // Criar objeto de parâmetros
            const params: any = {};
            for (let i = 0; i < paramNames.length && i + 1 < match.length; i++) {
              params[paramNames[i]] = match[i + 1];
            }
            
            return { handler: paramRoute.handler, params };
          }
        }
      }

      // Se não encontrar, tentar wildcard routes
      for (const wildcardRoute of wildcardRoutes) {
        if (wildcardRoute.method === method || wildcardRoute.method === '*') {
          return { handler: wildcardRoute.handler };
        }
      }

      return null;
    };

    const server = http.createServer((req, res) => {
      // Parse URL to separate pathname from query string
      let pathname = '/';
      let queryParams: any = {};
      
      try {
        const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
        pathname = url.pathname;
        url.searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });
      } catch (e) {
        // Fallback: manual parsing if URL constructor fails
        const urlStr = req.url || '/';
        const queryIndex = urlStr.indexOf('?');
        if (queryIndex >= 0) {
          pathname = urlStr.substring(0, queryIndex);
          const queryString = urlStr.substring(queryIndex + 1);
          queryString.split('&').forEach((pair) => {
            const equalIndex = pair.indexOf('=');
            if (equalIndex >= 0) {
              const key = decodeURIComponent(pair.substring(0, equalIndex));
              const value = decodeURIComponent(pair.substring(equalIndex + 1));
              queryParams[key] = value;
            }
          });
        } else {
          pathname = urlStr;
        }
      }
      
      const handlerResult = findHandler(req.method || 'GET', pathname);

      if (handlerResult) {
        const requestObj = {
          url: req.url,
          pathname: pathname,
          query: queryParams,
          method: req.method || 'GET',
          headers: req.headers,
          body: '',
          ip: req.socket.remoteAddress || 'unknown',
          params: handlerResult.params || {},
        };

        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });

        req.on('end', () => {
          // Parse body de forma mais robusta
          try {
            if (body && body.trim().length > 0) {
              const trimmedBody = body.trim();
              if (trimmedBody.startsWith('{') || trimmedBody.startsWith('[')) {
                try {
                  requestObj.body = JSON.parse(body);
                } catch (parseError) {
                  // Se falhar o parse JSON, manter como string
                  requestObj.body = body;
                }
              } else {
                requestObj.body = body;
              }
            } else {
              requestObj.body = '';
            }
          } catch (error) {
            // Em caso de erro, manter body vazio
            requestObj.body = '';
          }

          const responseObj = {
            status: (code: number) => {
              res.statusCode = code;
              return responseObj;
            },
            send: (data: any) => {
              try {
                const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
                if (!res.headersSent) {
                  if (typeof data === 'string' && !res.getHeader('Content-Type')) {
                    res.setHeader('Content-Type', 'text/html; charset=utf-8');
                  }
                }
                res.end(dataStr);
              } catch (error) {
                if (!res.headersSent) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json; charset=utf-8');
                  res.end(JSON.stringify({ error: true, message: 'Internal server error' }));
                }
              }
              return responseObj;
            },
            json: (data: any) => {
              try {
                if (!res.headersSent) {
                  res.setHeader('Content-Type', 'application/json; charset=utf-8');
                }
                res.end(JSON.stringify(data, null, 2));
              } catch (error) {
                if (!res.headersSent) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json; charset=utf-8');
                  res.end(JSON.stringify({ error: true, message: 'Error serializing JSON' }));
                }
              }
              return responseObj;
            },
            header: (name: string, value: string) => {
              if (!res.headersSent) {
                res.setHeader(name, value);
              }
              return responseObj;
            },
          };

          // Executar handler com tratamento de erros robusto
          try {
            handlerResult.handler(requestObj, responseObj);
          } catch (error: any) {
            // Se o handler lançar erro, retornar 500
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({
                error: true,
                message: 'Internal server error',
                details: error?.message || String(error),
                timestamp: Date.now()
              }, null, 2));
            }
          }
        });
      } else {
        // Nenhum handler encontrado - retornar 404 com melhor tratamento
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        const errorResponse = {
          error: true,
          message: 'Route not found',
          path: pathname,
          method: req.method || 'GET',
          timestamp: Date.now()
        };
        res.end(JSON.stringify(errorResponse, null, 2));
      }
    });

    return {
      listen: (port: number, callback?: any) => {
        server.listen(port, () => {
          if (callback) {
            // Check if callback is a Trest function (FunctionValue) or native function
            // If it's already a JS function, call it directly
            if (typeof callback === 'function') {
              callback();
            } else {
              // Should not happen - interpreter should convert Trest functions to JS functions
              console.error('Callback is not a function:', typeof callback, callback);
            }
          }
        });
      },
      get: (path: string, handler: Function) => {
        addRoute('GET', path, handler);
      },
      post: (path: string, handler: Function) => addRoute('POST', path, handler),
      put: (path: string, handler: Function) => addRoute('PUT', path, handler),
      delete: (path: string, handler: Function) => addRoute('DELETE', path, handler),
      use: (path: string, handler: Function) => {
        // Middleware ou catch-all - aceita qualquer método
        addRoute('*', path, handler);
      },
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
 * GUI Module - Interface Gráfica Desktop com Electron
 * ========================================
 */

// Variáveis globais para Electron
let electronModule: any = null;
let BrowserWindow: any = null;
let app: any = null;

function loadElectron(): boolean {
  // Se já carregado e disponível, retornar true
  if (electronModule && app && BrowserWindow) {
    // Verificar se app.isReady() ou se está disponível
    if (app && typeof app.isReady === 'function') {
      return true;
    }
  }

  try {
    // Tentar carregar Electron
    electronModule = require('electron');
    if (electronModule) {
      // Tentar acessar app e BrowserWindow
      // Quando executado através do Node.js (não Electron main process),
      // app e BrowserWindow podem não estar disponíveis diretamente
      if (electronModule.app) {
        app = electronModule.app;
      }
      if (electronModule.BrowserWindow) {
        BrowserWindow = electronModule.BrowserWindow;
      }
      
      // Se temos Electron instalado mas app/BrowserWindow não estão disponíveis,
      // ainda podemos tentar usá-los (pode funcionar em contexto Electron)
      if (electronModule && electronModule.app && electronModule.BrowserWindow) {
        app = electronModule.app;
        BrowserWindow = electronModule.BrowserWindow;
        return true;
      }
      
      // Se app ou BrowserWindow não estão disponíveis, retornar false
      // Isso significa que não estamos no contexto Electron main process
      return false;
    }
  } catch (e: any) {
    // Electron não instalado
    return false;
  }

  return false;
}

export class StdGUI {
  private static windows: Map<number, any> = new Map();
  private static windowCounter: number = 0;
  private static appReady: boolean = false;
  private static _windowWrappers: Map<any, any> = new Map();
  private static _ipcHandlersRegistered: boolean = false;

  /**
   * Initialize Electron app
   */
  private static ensureAppReady(): Promise<boolean> {
    if (!loadElectron()) {
      console.error('❌ Electron não está instalado. Para usar GUI desktop, instale: npm install electron');
      return Promise.resolve(false);
    }

    if (this.appReady) {
      return Promise.resolve(true);
    }

    if (app.isReady()) {
      this.appReady = true;
      return Promise.resolve(true);
    }

    return app.whenReady().then(() => {
      this.appReady = true;
      return true;
    });
  }

  /**
   * Create Terminal
   */
  static createTerminal(): any {
    return {
      clear: () => {
        console.clear();
      },
      printAt: (x: number, y: number, text: string) => {
        process.stdout.write(`\x1b[${y};${x}H${text}`);
      },
      getHeight: () => process.stdout.rows || 24,
      getWidth: () => process.stdout.columns || 80,
    };
  }

  /**
   * Create Desktop Window with Electron
   */
  static createWindow(options: any): any {
    const title = options.title || options.título || 'Janela Trest';
    const width = options.width || options.largura || 800;
    const height = options.height || options.altura || 600;
    const resizable = options.resizable !== false;
    const center = options.center !== false;
    const minWidth = options.minWidth || options.larguraMinima || undefined;
    const minHeight = options.minHeight || options.alturaMinima || undefined;
    const maxWidth = options.maxWidth || options.larguraMaxima || undefined;
    const maxHeight = options.maxHeight || options.alturaMaxima || undefined;
    const fullscreen = options.fullscreen || options.telaCheia || false;
    const alwaysOnTop = options.alwaysOnTop || options.sempreNoTopo || false;

    const winId = ++this.windowCounter;
    let browserWindow: any = null;

    // Check if Electron is available
    if (!loadElectron()) {
      return this.createFallbackWindow(options);
    }

    // Create window wrapper object immediately (window will be created when app is ready)
    const windowWrapper: any = {
      id: winId,
      _pending: true,
      _options: options,
      show: () => {
        if (browserWindow) {
          browserWindow.show();
        } else if (windowWrapper._pending) {
          windowWrapper._pendingShow = true;
        }
      },
      hide: () => {
        if (browserWindow) {
          browserWindow.hide();
        }
      },
      close: () => {
        if (browserWindow) {
          browserWindow.close();
          this.windows.delete(winId);
        }
      },
      loadHTML: (html: string) => {
        if (browserWindow) {
          browserWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
        } else {
          windowWrapper._pendingHTML = html;
        }
      },
      loadFile: (filePath: string) => {
        if (browserWindow) {
          browserWindow.loadFile(filePath);
        } else {
          windowWrapper._pendingFile = filePath;
        }
      },
      loadURL: (url: string) => {
        if (browserWindow) {
          browserWindow.loadURL(url);
        } else {
          windowWrapper._pendingURL = url;
        }
      },
      setTitle: (newTitle: string) => {
        if (browserWindow) {
          browserWindow.setTitle(newTitle);
        } else {
          windowWrapper._pendingTitle = newTitle;
        }
      },
      setSize: (w: number, h: number) => {
        if (browserWindow) {
          browserWindow.setSize(w, h);
        }
      },
      setMinimumSize: (w: number, h: number) => {
        if (browserWindow) {
          browserWindow.setMinimumSize(w, h);
        }
      },
      setMaximumSize: (w: number, h: number) => {
        if (browserWindow) {
          browserWindow.setMaximumSize(w, h);
        }
      },
      minimize: () => {
        if (browserWindow) browserWindow.minimize();
      },
      maximize: () => {
        if (browserWindow) browserWindow.maximize();
      },
      restore: () => {
        if (browserWindow) browserWindow.restore();
      },
      focus: () => {
        if (browserWindow) browserWindow.focus();
      },
      on: (event: string, callback: Function) => {
        if (browserWindow) {
          browserWindow.on(event, callback);
        }
      },
      webContents: null,
    };

    // Initialize app and create window in background
    this.ensureAppReady().then((isReady) => {
      if (!isReady) {
        return;
      }

      try {
        browserWindow = new BrowserWindow({
          width: width,
          height: height,
          title: title,
          resizable: resizable,
          center: center,
          minWidth: minWidth,
          minHeight: minHeight,
          maxWidth: maxWidth,
          maxHeight: maxHeight,
          fullscreen: fullscreen,
          alwaysOnTop: alwaysOnTop,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
          },
          show: false,
        });

        this.windows.set(winId, browserWindow);
        windowWrapper._pending = false;
        windowWrapper.webContents = browserWindow.webContents;
        
        // Registrar wrapper se for uma janela programática
        if (windowWrapper._useProgrammatic) {
          StdGUI._windowWrappers.set(browserWindow, windowWrapper);
        }

        browserWindow.on('closed', () => {
          this.windows.delete(winId);
          StdGUI._windowWrappers.delete(browserWindow);
          browserWindow = null;
        });

        // Apply pending operations
        if (windowWrapper._pendingHTML) {
          browserWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(windowWrapper._pendingHTML)}`);
        } else if (windowWrapper._pendingFile) {
          browserWindow.loadFile(windowWrapper._pendingFile);
        } else if (windowWrapper._pendingURL) {
          browserWindow.loadURL(windowWrapper._pendingURL);
        }

        if (windowWrapper._pendingTitle) {
          browserWindow.setTitle(windowWrapper._pendingTitle);
        }

        if (windowWrapper._pendingShow) {
          browserWindow.show();
        }
      } catch (error: any) {
        console.error('❌ Erro ao criar janela Electron:', error.message);
      }
    });

    return windowWrapper;
  }

  /**
   * Fallback window (quando Electron não está disponível)
   */
  private static createFallbackWindow(options: any): any {
    console.warn('⚠️  Electron não disponível - usando modo fallback');
    return {
      id: ++this.windowCounter,
      show: () => console.log('Window shown (fallback mode)'),
      hide: () => console.log('Window hidden (fallback mode)'),
      close: () => console.log('Window closed (fallback mode)'),
      loadHTML: (html: string) => console.log('HTML loaded (fallback mode)'),
      loadFile: (filePath: string) => console.log(`File loaded: ${filePath} (fallback mode)`),
      loadURL: (url: string) => console.log(`URL loaded: ${url} (fallback mode)`),
      setTitle: (title: string) => console.log(`Title set: ${title} (fallback mode)`),
      setSize: () => {},
      setMinimumSize: () => {},
      setMaximumSize: () => {},
      minimize: () => {},
      maximize: () => {},
      restore: () => {},
      focus: () => {},
      on: () => {},
      webContents: null,
    };
  }

  /**
   * Create Button (HTML-based)
   */
  static createButton(text: string, onClick: Function): any {
    return {
      type: 'button',
      text: text,
      onClick: onClick,
      disabled: false,
      disable: function() {
        this.disabled = true;
      },
      enable: function() {
        this.disabled = false;
      },
      setText: function(newText: string) {
        this.text = newText;
      },
    };
  }

  /**
   * Create Text Input (HTML-based)
   */
  static createText(placeholder: string, onChange: Function): any {
    return {
      type: 'text',
      placeholder: placeholder,
      value: '',
      onChange: onChange,
      setValue: function(newValue: string) {
        this.value = newValue;
      },
      focus: function() {},
      blur: function() {},
    };
  }

  /**
   * Create List (HTML-based)
   */
  static createList(data: any[], onSelect: Function): any {
    return {
      type: 'list',
      data: data || [],
      onSelect: onSelect,
      update: function(newData: any[]) {
        this.data = newData || [];
      },
      add: function(item: any) {
        this.data.push(item);
      },
      remove: function(index: number) {
        if (index >= 0 && index < this.data.length) {
          this.data.splice(index, 1);
        }
      },
    };
  }

  /**
   * Component Container
   */
  static componentContainer(children: any[]): any {
    return {
      type: 'container',
      children: children || [],
      add: function(component: any) {
        this.children.push(component);
      },
      remove: function(component: any) {
        const index = this.children.indexOf(component);
        if (index > -1) this.children.splice(index, 1);
      },
      clear: function() {
        this.children = [];
      },
    };
  }

  /**
   * Component Label
   */
  static componentLabel(text: string): any {
    return {
      type: 'label',
      text: text,
      setText: function(newText: string) {
        this.text = newText;
      },
    };
  }

  /**
   * Component Image
   */
  static componentImage(src: string): any {
    return {
      type: 'image',
      src: src,
      visible: true,
      show: function() {
        this.visible = true;
      },
      hide: function() {
        this.visible = false;
      },
      setSrc: function(newSrc: string) {
        this.src = newSrc;
      },
    };
  }

  /**
   * Helper: Render components to HTML
   */
  static renderComponentToHTML(component: any): string {
    if (!component) return '';

    switch (component.type) {
      case 'button':
        return `<button onclick="window.trestGuiClickHandler(${JSON.stringify(component.text)})" ${component.disabled ? 'disabled' : ''}>${component.text}</button>`;
      
      case 'text':
        return `<input type="text" placeholder="${component.placeholder || ''}" value="${component.value || ''}" onchange="window.trestGuiChangeHandler(this.value)" />`;
      
      case 'label':
        return `<label>${component.text || ''}</label>`;
      
      case 'image':
        if (!component.visible) return '';
        return `<img src="${component.src || ''}" alt="" />`;
      
      case 'list':
        const items = (component.data || []).map((item: any, index: number) => 
          `<li onclick="window.trestGuiSelectHandler(${index})">${item}</li>`
        ).join('');
        return `<ul>${items}</ul>`;
      
      case 'container':
        const childrenHTML = (component.children || []).map((child: any) => 
          this.renderComponentToHTML(child)
        ).join('');
        return `<div>${childrenHTML}</div>`;
      
      default:
        return '';
    }
  }

  /**
   * Keep app running (prevents Electron from closing)
   */
  static keepRunning(): void {
    if (!loadElectron() || !app) {
      console.warn('⚠️  Electron não disponível para manterRodando()');
      return;
    }

    app.on('window-all-closed', () => {
      // On macOS, apps typically stay active
      if (process.platform !== 'darwin') {
        // Keep running - don't quit automatically
      }
    });
  }

  /**
   * Create Widget (base class for all GUI components)
   * Allows creating GUI programmatically without HTML
   */
  static Widget(type: string, props: any = {}): any {
    return {
      type: type,
      props: props || {},
      children: [],
      id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      setText: function(text: string) {
        this.props.text = text;
        this.update();
      },
      setVisible: function(visible: boolean) {
        this.props.visible = visible !== false;
        this.update();
      },
      setEnabled: function(enabled: boolean) {
        this.props.enabled = enabled !== false;
        this.update();
      },
      addChild: function(child: any) {
        this.children.push(child);
        this.update();
      },
      removeChild: function(child: any) {
        const index = this.children.indexOf(child);
        if (index > -1) {
          this.children.splice(index, 1);
          this.update();
        }
      },
      update: function() {
        // Update será implementado quando widget for adicionado a uma janela
        if (this._parentWindow) {
          this._parentWindow._updateGUI();
        }
      },
      toHTML: function(): string {
        return this._renderToHTML();
      },
      _renderToHTML: function(): string {
        // Implementação base - será sobrescrita por widgets específicos
        return '';
      }
    };
  }

  /**
   * Create Button Widget (programmatic)
   */
  static Button(text: string, onClick?: Function): any {
    const widget = this.Widget('button', {
      text: text || '',
      onClick: onClick,
      enabled: true,
      visible: true,
      style: {}
    });
    
    widget._renderToHTML = function(): string {
      const style = this.props.style || {};
      const styleStr = Object.keys(style).map(k => `${k}:${style[k]}`).join(';');
      const disabled = this.props.enabled === false ? 'disabled' : '';
      const onclick = this.props.onClick ? `onclick="window.trestGuiButtonClick('${this.id}')"` : '';
      return `<button id="${this.id}" ${onclick} ${disabled} style="${styleStr}">${this.props.text || ''}</button>`;
    };
    
    return widget;
  }

  /**
   * Create Label Widget (programmatic)
   */
  static Label(text: string): any {
    const widget = this.Widget('label', {
      text: text || '',
      visible: true,
      style: {}
    });
    
    widget._renderToHTML = function(): string {
      const style = this.props.style || {};
      const styleStr = Object.keys(style).map(k => `${k}:${style[k]}`).join(';');
      return `<label id="${this.id}" style="${styleStr}">${this.props.text || ''}</label>`;
    };
    
    return widget;
  }

  /**
   * Create Input Widget (programmatic)
   */
  static Input(placeholder: string = '', onChange?: Function): any {
    const widget = this.Widget('input', {
      placeholder: placeholder || '',
      value: '',
      onChange: onChange,
      enabled: true,
      visible: true,
      type: 'text',
      style: {}
    });
    
    widget.setValue = function(value: string) {
      this.props.value = value;
      this.update();
    };
    
    widget.getValue = function(): string {
      return this.props.value || '';
    };
    
    widget._renderToHTML = function(): string {
      const style = this.props.style || {};
      const styleStr = Object.keys(style).map(k => `${k}:${style[k]}`).join(';');
      const disabled = this.props.enabled === false ? 'disabled' : '';
      const onchange = this.props.onChange ? `onchange="window.trestGuiInputChange('${this.id}', this.value)"` : '';
      return `<input id="${this.id}" type="${this.props.type || 'text'}" placeholder="${this.props.placeholder || ''}" value="${this.props.value || ''}" ${onchange} ${disabled} style="${styleStr}">`;
    };
    
    return widget;
  }

  /**
   * Create VBox Layout (vertical box - like PySide6)
   */
  static VBox(children: any[] = [], spacing: number = 0): any {
    const widget = this.Widget('vbox', {
      spacing: spacing || 0,
      alignment: 'top'
    });
    
    widget.children = children || [];
    
    widget._renderToHTML = function(): string {
      const spacing = this.props.spacing || 0;
      const style = `display: flex; flex-direction: column; gap: ${spacing}px;`;
      const childrenHTML = this.children.map((child: any) => {
        if (child && typeof child.toHTML === 'function') {
          return child.toHTML();
        }
        return typeof child === 'string' ? child : '';
      }).join('');
      return `<div id="${this.id}" style="${style}">${childrenHTML}</div>`;
    };
    
    return widget;
  }

  /**
   * Create HBox Layout (horizontal box - like PySide6)
   */
  static HBox(children: any[] = [], spacing: number = 0): any {
    const widget = this.Widget('hbox', {
      spacing: spacing || 0,
      alignment: 'left'
    });
    
    widget.children = children || [];
    
    widget._renderToHTML = function(): string {
      const spacing = this.props.spacing || 0;
      const style = `display: flex; flex-direction: row; gap: ${spacing}px;`;
      const childrenHTML = this.children.map((child: any) => {
        if (child && typeof child.toHTML === 'function') {
          return child.toHTML();
        }
        return typeof child === 'string' ? child : '';
      }).join('');
      return `<div id="${this.id}" style="${style}">${childrenHTML}</div>`;
    };
    
    return widget;
  }

  /**
   * Create Grid Layout (like PySide6)
   */
  static Grid(rows: number = 1, cols: number = 1, spacing: number = 0): any {
    const widget = this.Widget('grid', {
      rows: rows || 1,
      cols: cols || 1,
      spacing: spacing || 0
    });
    
    widget.children = [];
    widget._grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
    
    widget.addWidget = function(child: any, row: number, col: number, rowSpan: number = 1, colSpan: number = 1) {
      if (row >= 0 && row < this.props.rows && col >= 0 && col < this.props.cols) {
        this.children.push({ widget: child, row, col, rowSpan, colSpan });
        this._grid[row][col] = child;
        this.update();
      }
    };
    
    widget._renderToHTML = function(): string {
      const spacing = this.props.spacing || 0;
      const style = `display: grid; grid-template-rows: repeat(${this.props.rows}, 1fr); grid-template-columns: repeat(${this.props.cols}, 1fr); gap: ${spacing}px;`;
      
      // Renderizar widgets nos lugares corretos do grid
      const gridItems = Array(this.props.rows * this.props.cols).fill('<div></div>');
      
      this.children.forEach((item: any) => {
        const index = item.row * this.props.cols + item.col;
        const rowSpan = item.rowSpan || 1;
        const colSpan = item.colSpan || 1;
        const gridArea = `${item.row + 1} / ${item.col + 1} / ${item.row + rowSpan + 1} / ${item.col + colSpan + 1}`;
        const childHTML = item.widget && typeof item.widget.toHTML === 'function' 
          ? item.widget.toHTML() 
          : '';
        gridItems[index] = `<div style="grid-area: ${gridArea}">${childHTML}</div>`;
      });
      
      return `<div id="${this.id}" style="${style}">${gridItems.join('')}</div>`;
    };
    
    return widget;
  }

  /**
   * Create Programmatic Window (without HTML dependency)
   * This allows creating windows and adding widgets programmatically
   */
  static createProgrammaticWindow(options: any): any {
    const title = options.title || options.título || 'Janela Trest';
    const width = options.width || options.largura || 800;
    const height = options.height || options.altura || 600;
    
    // Create window normally
    const window = this.createWindow(options);
    
    // Add programmatic methods
    window._widgets = [];
    window._layout = null;
    window._useProgrammatic = true;
    
    window.setLayout = (layout: any) => {
      window._layout = layout;
      if (layout && layout._parentWindow) {
        layout._parentWindow = window;
      }
      if (window._updateGUI) {
        window._updateGUI();
      }
    };
    
    window.addWidget = (widget: any) => {
      window._widgets.push(widget);
      if (widget && widget._parentWindow) {
        widget._parentWindow = window;
      }
      if (window._updateGUI) {
        window._updateGUI();
      }
    };
    
    window.removeWidget = (widget: any) => {
      const index = window._widgets.indexOf(widget);
      if (index > -1) {
        window._widgets.splice(index, 1);
        if (window._updateGUI) {
          window._updateGUI();
        }
      }
    };
    
    window.clear = () => {
      window._widgets = [];
      window._layout = null;
      if (window._updateGUI) {
        window._updateGUI();
      }
    };
    
      window._updateGUI = () => {
      // Gerar HTML automaticamente dos widgets
      let contentHTML = '';
      
      // Coletar todos os widgets (do layout ou diretamente)
      const allWidgets: any[] = [];
      
      if (window._layout) {
        // Se há um layout, coletar widgets do layout
        const collectWidgets = (widget: any) => {
          if (widget && widget.id) {
            allWidgets.push(widget);
          }
          if (widget && widget.children) {
            widget.children.forEach(collectWidgets);
          }
        };
        collectWidgets(window._layout);
        if (window._layout.toHTML) {
          contentHTML = window._layout.toHTML();
        }
      } else {
        // Senão, renderizar widgets diretamente
        contentHTML = window._widgets.map((w: any) => {
          if (w && typeof w.toHTML === 'function') {
            allWidgets.push(w);
            return w.toHTML();
          }
          return '';
        }).join('');
      }
      
      // Criar mapa de callbacks para injetar no JavaScript
      const callbacksMap: { [key: string]: any } = {};
      allWidgets.forEach((widget: any) => {
        if (widget && widget.id) {
          if (widget.props && widget.props.onClick) {
            callbacksMap[`btn_${widget.id}`] = widget.props.onClick;
          }
          if (widget.props && widget.props.onChange) {
            callbacksMap[`inp_${widget.id}`] = widget.props.onChange;
          }
        }
      });
      
      // Serializar callbacks (não podemos serializar funções diretamente, então vamos usar IPC)
      const callbacksScript = Object.keys(callbacksMap).map(key => {
        const widgetId = key.replace(/^(btn_|inp_)/, '');
        const type = key.startsWith('btn_') ? 'button' : 'input';
        return `'${widgetId}': { type: '${type}', registered: true }`;
      }).join(',\n            ');
      
      // Criar HTML completo
      const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            padding: 20px;
            background: #f5f5f5;
        }
        
        .container {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            min-height: calc(100vh - 40px);
        }
        
        button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            background: #007bff;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
            margin-top: 10px;
        }
        
        button:hover:not(:disabled) {
            background: #0056b3;
        }
        
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        input {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            width: 100%;
            margin-top: 5px;
            margin-bottom: 10px;
        }
        
        input:focus {
            outline: none;
            border-color: #007bff;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #333;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        ${contentHTML}
    </div>
    
    <script>
        const { ipcRenderer } = require('electron');
        
        // Handlers para widgets programáticos usando IPC
        window.trestGuiButtonClick = function(widgetId) {
            ipcRenderer.send('trest-gui-button-click', widgetId);
        };
        
        window.trestGuiInputChange = function(widgetId, value) {
            ipcRenderer.send('trest-gui-input-change', widgetId, value);
        };
        
        // Atualizar valores dos inputs quando mudarem
        document.addEventListener('DOMContentLoaded', function() {
            const inputs = document.querySelectorAll('input[type="text"]');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    if (this.id && window.trestGuiInputChange) {
                        window.trestGuiInputChange(this.id, this.value);
                    }
                });
            });
        });
    </script>
</body>
</html>`;
      
      // Atualizar janela com HTML gerado
      if (window.loadHTML) {
        window.loadHTML(html);
      }
      
      // Armazenar callbacks no wrapper da janela
      window._widgetCallbacks = callbacksMap;
      
      // Registrar handlers IPC para callbacks (apenas uma vez, globalmente)
      if (loadElectron() && !StdGUI._ipcHandlersRegistered) {
        const ipcMain = electronModule?.ipcMain;
        if (ipcMain) {
          StdGUI._ipcHandlersRegistered = true;
          
          ipcMain.on('trest-gui-button-click', (event: any, widgetId: string) => {
          // Encontrar o wrapper da janela pelo webContents
          const browserWindow = Array.from(StdGUI.windows.values()).find((win: any) => {
            return win && win.webContents && win.webContents === event.sender;
          });
          
          if (browserWindow) {
            // Encontrar o wrapper correspondente
            // Usar um mapa estático para mapear webContents para wrappers
            const wrapper = StdGUI._windowWrappers?.get(browserWindow);
            if (wrapper && wrapper._widgetCallbacks) {
              const callbackKey = `btn_${widgetId}`;
              const callback = wrapper._widgetCallbacks[callbackKey];
              if (callback && typeof callback === 'function') {
                try {
                  callback();
                } catch (e) {
                  console.error('Erro ao executar callback do botão:', e);
                }
              }
            }
          }
        });
        
        ipcMain.on('trest-gui-input-change', (event: any, widgetId: string, value: string) => {
          const browserWindow = Array.from(StdGUI.windows.values()).find((win: any) => {
            return win && win.webContents && win.webContents === event.sender;
          });
          
          if (browserWindow) {
            const wrapper = StdGUI._windowWrappers?.get(browserWindow);
            if (wrapper && wrapper._widgetCallbacks) {
              // Atualizar o valor do widget antes de chamar o callback
              const findWidget = (widget: any): any => {
                if (widget && widget.id === widgetId) {
                  return widget;
                }
                if (widget && widget.children) {
                  for (const child of widget.children) {
                    const found = findWidget(child);
                    if (found) return found;
                  }
                }
                return null;
              };
              
              let targetWidget = null;
              if (wrapper._layout) {
                targetWidget = findWidget(wrapper._layout);
              } else {
                targetWidget = wrapper._widgets.find((w: any) => w && w.id === widgetId);
              }
              
              if (targetWidget && targetWidget.setValue) {
                targetWidget.setValue(value);
              }
              
              const callbackKey = `inp_${widgetId}`;
              const callback = wrapper._widgetCallbacks[callbackKey];
              if (callback && typeof callback === 'function') {
                try {
                  callback(value);
                } catch (e) {
                  console.error('Erro ao executar callback do input:', e);
                }
              }
            }
          }
        });
        }
      }
    };
    
    return window;
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
   * Get Timestamp (milliseconds since epoch)
   */
  static timestamp(): number {
    return Date.now();
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
 * ========================================
 * IO Module - Entrada e Saída
 * ========================================
 */
import * as readline from 'readline';

export class StdIO {
  private static rl: readline.Interface | null = null;

  /**
   * Initialize readline interface if needed
   */
  private static getReadlineInterface(): readline.Interface {
    if (!this.rl) {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
    }
    return this.rl;
  }

  /**
   * Read user input from stdin (synchronous blocking read)
   * Uses readline-sync if available, otherwise uses async readline
   */
  static read(): string {
    // Try using readline-sync if available (better for sync reading)
    try {
      const readlineSync = require('readline-sync');
      return readlineSync.question('');
    } catch (e) {
      // Fallback: Use readline with a synchronous wrapper
      // Note: This is not truly synchronous, but works for most cases
      const rl = this.getReadlineInterface();
      
      // Clean up on exit
      if (typeof process !== 'undefined') {
        process.once('exit', () => {
          this.close();
        });
      }

      // For true synchronous reading, we use stdin directly
      // This is a simpler approach that works cross-platform
      if (process.stdin.isTTY) {
        // TTY mode - use readline
        return this.readSyncTTY();
      } else {
        // Non-TTY (pipe) mode - read from stdin buffer
        return this.readSyncPipe();
      }
    }
  }

  /**
   * Read synchronously from TTY
   */
  private static readSyncTTY(): string {
    const rl = this.getReadlineInterface();
    let result = '';
    let finished = false;

    rl.question('', (answer) => {
      result = answer;
      finished = true;
    });

    // Wait for input (blocking)
    const startTime = Date.now();
    const timeout = 300000; // 5 minutes
    
    while (!finished && (Date.now() - startTime) < timeout) {
      // Small delay
      const { performance } = require('perf_hooks');
      const waitStart = performance.now();
      while (performance.now() - waitStart < 1) {
        // Busy wait 1ms
      }
    }

    return result;
  }

  /**
   * Read synchronously from pipe (stdin)
   */
  private static readSyncPipe(): string {
    const fs = require('fs');
    try {
      // Read first line from stdin
      const chunk = fs.readFileSync(0, { encoding: 'utf8', flag: 'r' });
      const lines = chunk.toString().split('\n');
      return (lines[0] || '').trim();
    } catch (e) {
      // If reading fails, return empty string
      return '';
    }
  }

  /**
   * Read user input (async version using Promise)
   * Use this when you have async/await support
   */
  static readAsync(): Promise<string> {
    return new Promise((resolve) => {
      const rl = this.getReadlineInterface();
      rl.question('', (answer) => {
        resolve(answer);
      });
    });
  }

  /**
   * Print to stdout (alias for console.log)
   */
  static print(...args: any[]): void {
    console.log(...args);
  }

  /**
   * Print without newline (to stdout)
   */
  static printInline(...args: any[]): void {
    process.stdout.write(args.map(String).join(' '));
  }

  /**
   * Close readline interface
   */
  static close(): void {
    if (this.rl) {
      this.rl.close();
      this.rl = null;
    }
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
  IO: StdIO,
};

