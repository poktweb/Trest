/**
 * Vercel Serverless Function Adapter para Trest
 * 
 * Este arquivo adapta aplicações Trest que usam HTTP.createServer
 * para funcionar como serverless functions na Vercel.
 * 
 * USO:
 * 1. Coloque seu arquivo .trest na raiz do projeto como app.trest
 * 2. Execute npm run build para compilar o Trest
 * 3. Faça deploy na Vercel
 */

const { Interpreter } = require('../dist/interpreter');
const { Lexer } = require('../dist/lexer');
const { Parser } = require('../dist/parser');
const { ModuleSystem } = require('../dist/module');
const { StdModules } = require('../dist/std-native');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Caminho do arquivo Trest (ajuste conforme necessário)
const TREST_FILE = path.join(__dirname, '../app.trest');

// Armazenar rotas coletadas (global para o módulo)
let globalRoutes = null;
let appInitialized = false;

/**
 * Estrutura para armazenar rotas
 */
function createRouteMap() {
  const routes = new Map();
  const paramRoutes = [];
  const wildcardRoutes = [];

  return {
    routes,
    paramRoutes,
    wildcardRoutes,
    addRoute(method, path, handler) {
      if (path === '*') {
        wildcardRoutes.push({ method, handler });
        return;
      }
      
      if (path.includes(':')) {
        const patternStr = '^' + path.replace(/:[^/]+/g, '([^/]+)') + '$';
        const pattern = new RegExp(patternStr);
        paramRoutes.push({ method, pattern, path, handler });
        return;
      }
      
      if (!routes.has(path)) {
        routes.set(path, new Map());
      }
      routes.get(path).set(method, handler);
    },
    findHandler(method, pathname) {
      const handlers = routes.get(pathname);
      const exactHandler = handlers?.get(method);
      if (exactHandler) {
        return { handler: exactHandler };
      }

      for (const paramRoute of paramRoutes) {
        if (paramRoute.method === method || paramRoute.method === '*') {
          const match = pathname.match(paramRoute.pattern);
          if (match) {
            const paramNames = [];
            const pathParts = paramRoute.path.split('/');
            for (const part of pathParts) {
              if (part.startsWith(':')) {
                paramNames.push(part.substring(1));
              }
            }
            
            const params = {};
            for (let i = 0; i < paramNames.length && i + 1 < match.length; i++) {
              params[paramNames[i]] = match[i + 1];
            }
            
            return { handler: paramRoute.handler, params };
          }
        }
      }

      for (const wildcardRoute of wildcardRoutes) {
        if (wildcardRoute.method === method || wildcardRoute.method === '*') {
          return { handler: wildcardRoute.handler };
        }
      }

      return null;
    }
  };
}

/**
 * Inicializa a aplicação Trest e coleta rotas
 */
function initializeTrestApp() {
  if (appInitialized && globalRoutes) {
    return globalRoutes;
  }

  try {
    // Criar estrutura de rotas
    globalRoutes = createRouteMap();

    // IMPORTANTE: Fazer monkey-patch ANTES de criar o Interpreter
    // porque o Interpreter faz .bind() no construtor
    const originalCreateServer = StdModules.HTTP.createServer.bind(StdModules.HTTP);
    
    // Sobrescrever createServer para coletar rotas em vez de criar servidor
    StdModules.HTTP.createServer = function() {
      return {
        listen: (port, callback) => {
          // Na Vercel, listen não faz nada, mas chama callback se fornecido
          if (callback && typeof callback === 'function') {
            // Executar callback assincronamente para não bloquear
            setImmediate(() => callback());
          }
        },
        get: (path, handler) => {
          globalRoutes.addRoute('GET', path, handler);
        },
        post: (path, handler) => {
          globalRoutes.addRoute('POST', path, handler);
        },
        put: (path, handler) => {
          globalRoutes.addRoute('PUT', path, handler);
        },
        delete: (path, handler) => {
          globalRoutes.addRoute('DELETE', path, handler);
        },
        use: (path, handler) => {
          globalRoutes.addRoute('*', path === '*' ? '*' : path, handler);
        },
      };
    };

    // Ler e compilar código Trest
    const code = fs.readFileSync(TREST_FILE, 'utf-8');
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const program = parser.parse();

    const moduleSystem = new ModuleSystem(path.dirname(TREST_FILE));

    // Executar código Trest (isso vai registrar todas as rotas)
    // O monkey-patch já foi feito acima, então o Interpreter usará a versão modificada
    const interpreter = new Interpreter();
    interpreter.interpret(program);

    // Restaurar createServer original (opcional, mas é uma boa prática)
    StdModules.HTTP.createServer = originalCreateServer;

    appInitialized = true;
    return globalRoutes;
  } catch (error) {
    console.error('❌ Erro ao inicializar aplicação Trest:', error);
    if (error.stack) {
      console.error(error.stack);
    }
    throw error;
  }
}

/**
 * Converte requisição da Vercel para formato Trest
 */
function convertVercelRequest(req) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  
  const queryParams = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  // Parse body se for JSON
  let body = req.body || '';
  if (typeof body === 'object' && body !== null) {
    // Já está parseado (Vercel faz isso automaticamente)
    body = body;
  } else if (typeof body === 'string' && body.trim()) {
    try {
      body = JSON.parse(body);
    } catch (e) {
      // Manter como string se não for JSON válido
    }
  }

  return {
    url: req.url,
    pathname: url.pathname,
    query: queryParams,
    method: req.method || 'GET',
    headers: req.headers,
    body: body,
    ip: req.headers['x-forwarded-for']?.split(',')[0] || 
        req.headers['x-real-ip'] || 
        'unknown',
    params: {},
  };
}

/**
 * Cria objeto response compatível com Trest
 */
function createTrestResponse(res) {
  const responseObj = {
    status: (code) => {
      res.statusCode = code;
      return responseObj;
    },
    send: (data) => {
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
    json: (data) => {
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
    header: (name, value) => {
      if (!res.headersSent) {
        res.setHeader(name, value);
      }
      return responseObj;
    },
  };
  
  return responseObj;
}

/**
 * Serverless function handler da Vercel
 */
module.exports = async function handler(req, res) {
  try {
    // Inicializar aplicação Trest (apenas na primeira chamada)
    const routes = initializeTrestApp();

    // Converter requisição Vercel para formato Trest
    const trestRequest = convertVercelRequest(req);
    
    // Criar objeto response compatível
    const trestResponse = createTrestResponse(res);

    // Encontrar handler correspondente
    const handlerResult = routes.findHandler(req.method || 'GET', trestRequest.pathname);

    if (handlerResult) {
      // Adicionar params se houver
      trestRequest.params = handlerResult.params || {};
      
      // Executar handler
      try {
        // Executar handler (pode ser síncrono ou assíncrono)
        const result = handlerResult.handler(trestRequest, trestResponse);
        
        // Se o handler retornar uma Promise, aguardar
        if (result && typeof result.then === 'function') {
          await result;
        }
      } catch (error) {
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
    } else {
      // Nenhum handler encontrado
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({
        error: true,
        message: 'Route not found',
        path: trestRequest.pathname,
        method: req.method || 'GET',
        timestamp: Date.now()
      }, null, 2));
    }
  } catch (error) {
    console.error('❌ Erro na serverless function:', error);
    if (error.stack) {
      console.error(error.stack);
    }
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
};
