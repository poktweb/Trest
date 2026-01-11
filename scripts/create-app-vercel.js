#!/usr/bin/env node
/**
 * create-trest-app - Versão Otimizada para Vercel
 * Script para criar um novo projeto Trest otimizado para deploy na Vercel
 * Similar ao create-next-app do Next.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Obter versão atual do Trest
function getTrestVersion() {
  try {
    // Tentar ler do package.json local (se estiver no repositório)
    const packagePath = path.join(__dirname, '..', 'package.json');
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      return pkg.version;
    }
  } catch (e) {
    // Ignorar erro
  }
  return '2.5.0'; // Versão padrão
}

const TREST_VERSION = getTrestVersion();

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getProjectName() {
  const projectName = process.argv[2];
  if (projectName) {
    return projectName;
  }
  return null;
}

function validateProjectName(name) {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Nome do projeto não pode estar vazio' };
  }
  
  const validNameRegex = /^[a-zA-Z0-9-_]+$/;
  if (!validNameRegex.test(name)) {
    return { 
      valid: false, 
      error: 'Nome do projeto pode conter apenas letras, números, hífens e underscores' 
    };
  }
  
  if (/^[0-9]/.test(name)) {
    return { 
      valid: false, 
      error: 'Nome do projeto não pode começar com número' 
    };
  }
  
  return { valid: true };
}

function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function showHelp() {
  log('\n🚀 Create Trest App (Vercel Ready)', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');
  log('Cria um novo projeto Trest otimizado para deploy na Vercel', 'cyan');
  log('\nUso:', 'bright');
  log('  npm create trest <nome-projeto>', 'cyan');
  log('  npx create-trest-app <nome-projeto>', 'cyan');
  log('\nExemplos:', 'bright');
  log('  npm create trest meu-projeto', 'cyan');
  log('  npx create-trest-app minha-api', 'cyan');
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');
  process.exit(0);
}

// Template api/index.js para Vercel
function getApiIndexTemplate() {
  return `/**
 * Vercel Serverless Function Adapter para Trest
 * 
 * Este arquivo adapta aplicações Trest que usam HTTP.createServer
 * para funcionar como serverless functions na Vercel.
 */

const { Interpreter } = require('../node_modules/treste/dist/interpreter');
const { Lexer } = require('../node_modules/treste/dist/lexer');
const { Parser } = require('../node_modules/treste/dist/parser');
const { ModuleSystem } = require('../node_modules/treste/dist/module');
const { StdModules } = require('../node_modules/treste/dist/std-native');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Caminho do arquivo Trest
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
    const originalCreateServer = StdModules.HTTP.createServer.bind(StdModules.HTTP);
    
    // Sobrescrever createServer para coletar rotas em vez de criar servidor
    StdModules.HTTP.createServer = function() {
      return {
        listen: (port, callback) => {
          if (callback && typeof callback === 'function') {
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

    // Executar código Trest
    const interpreter = new Interpreter();
    interpreter.interpret(program);

    // Restaurar createServer original
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
  const url = new URL(req.url, \`http://\${req.headers.host || 'localhost'}\`);
  
  const queryParams = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  let body = req.body || '';
  if (typeof body === 'object' && body !== null) {
    body = body;
  } else if (typeof body === 'string' && body.trim()) {
    try {
      body = JSON.parse(body);
    } catch (e) {
      // Manter como string
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
    const routes = initializeTrestApp();
    const trestRequest = convertVercelRequest(req);
    const trestResponse = createTrestResponse(res);
    const handlerResult = routes.findHandler(req.method || 'GET', trestRequest.pathname);

    if (handlerResult) {
      trestRequest.params = handlerResult.params || {};
      
      try {
        const result = handlerResult.handler(trestRequest, trestResponse);
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
`;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h') || args.includes('help')) {
    showHelp();
  }

  log('\n🚀 Create Trest App (Vercel Ready)', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  let projectName = getProjectName();
  
  if (!projectName) {
    projectName = await askQuestion('📁 Nome do projeto: ');
  }
  
  if (!projectName || projectName.trim().length === 0) {
    log('\n❌ Erro: Nome do projeto não pode estar vazio', 'red');
    process.exit(1);
  }

  projectName = projectName.trim();
  const validation = validateProjectName(projectName);
  if (!validation.valid) {
    log(`\n❌ Erro: ${validation.error}`, 'red');
    process.exit(1);
  }

  let currentDir = process.cwd();
  if (!currentDir || currentDir === '/' || currentDir === '\\') {
    currentDir = process.env.USERPROFILE || process.env.HOME || process.cwd();
    log(`⚠️  Usando diretório: ${currentDir}`, 'yellow');
  }

  const projectPath = path.resolve(currentDir, projectName);

  if (fs.existsSync(projectPath)) {
    log(`\n❌ Erro: A pasta "${projectName}" já existe!`, 'red');
    process.exit(1);
  }

  log(`\n📦 Criando projeto: ${projectName}`, 'cyan');
  log(`📂 Caminho: ${projectPath}\n`, 'cyan');

  try {
    // Criar estrutura de pastas
    fs.mkdirSync(projectPath, { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'api'), { recursive: true });
    log('✅ Estrutura de pastas criada', 'green');
    
    // Criar package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      description: `Projeto Trest otimizado para Vercel: ${projectName}`,
      main: 'app.trest',
      scripts: {
        start: 'trest app.trest',
        dev: 'trest app.trest --verbose',
        build: 'echo "Build não necessário - Vercel faz isso automaticamente"',
        deploy: 'vercel --prod',
      },
      keywords: ['trest', 'trest-language', 'vercel', 'serverless'],
      author: '',
      license: 'MIT',
      dependencies: {
        treste: `^${TREST_VERSION}`
      },
      engines: {
        node: '>=18.0.0'
      }
    };
    
    fs.writeFileSync(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    log('✅ package.json criado', 'green');
    
    // Criar app.trest
    const appTrestContent = `# Aplicação Trest para Vercel
# Arquivo principal da aplicação

импорт * как HTTP измодуля "std/http"

пусть servidor = HTTP.создатьСервер()

# Rota principal
servidor.get("/", функция(запрос, ответ) {
    ответ.status(200)
    ответ.send("<h1>Olá da Vercel!</h1><p>Aplicação Trest rodando como serverless function</p>")
})

# API de exemplo
servidor.get("/api/hello", функция(запрос, ответ) {
    ответ.json({ 
        message = "Hello from Trest!",
        timestamp = Date.теперь()
    })
})

# Rota com parâmetros
servidor.get("/api/users/:id", функция(запрос, ответ) {
    пусть userId = запрос.params.id
    ответ.json({ 
        userId = userId,
        message = "User ID: " + userId
    })
})

# POST example
servidor.post("/api/echo", функция(запрос, ответ) {
    ответ.json({ 
        received = запрос.body,
        method = запрос.method
    })
})

# Listen (na Vercel, isso não faz nada, mas não causa erro)
servidor.listen(3000, функция() {
    печать("✅ Servidor inicializado (modo Vercel)")
})
`;

    fs.writeFileSync(
      path.join(projectPath, 'app.trest'),
      appTrestContent
    );
    log('✅ app.trest criado', 'green');
    
    // Criar api/index.js
    fs.writeFileSync(
      path.join(projectPath, 'api', 'index.js'),
      getApiIndexTemplate()
    );
    log('✅ api/index.js criado', 'green');
    
    // Criar vercel.json
    const vercelJson = {
      version: 2,
      builds: [
        {
          src: "package.json",
          use: "@vercel/node"
        }
      ],
      routes: [
        {
          src: "/api/(.*)",
          dest: "/api/index.js"
        },
        {
          src: "/(.*)",
          dest: "/api/index.js"
        }
      ],
      functions: {
        "api/index.js": {
          maxDuration: 30
        }
      }
    };

    fs.writeFileSync(
      path.join(projectPath, 'vercel.json'),
      JSON.stringify(vercelJson, null, 2)
    );
    log('✅ vercel.json criado', 'green');
    
    // Criar .gitignore
    const gitignoreContent = `# Dependências
node_modules/
package-lock.json

# Build
dist/
*.exe
*.js.map

# Logs
*.log
npm-debug.log*

# Sistema operacional
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Trest
*.trest.js
*.trest.map

# Vercel
.vercel
`;

    fs.writeFileSync(
      path.join(projectPath, '.gitignore'),
      gitignoreContent
    );
    log('✅ .gitignore criado', 'green');
    
    // Criar README.md
    const readmeContent = `# ${projectName}

Projeto Trest otimizado para deploy na Vercel

## 🚀 Deploy na Vercel

### Opção 1: Via CLI da Vercel

\`\`\`bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Fazer deploy
vercel

# Para produção
vercel --prod
\`\`\`

### Opção 2: Via GitHub/GitLab

1. Conecte seu repositório na Vercel
2. Configure o projeto (Vercel detectará automaticamente)
3. Faça deploy

## 📁 Estrutura do Projeto

\`\`\`
${projectName}/
├── api/
│   └── index.js          # Serverless function adapter
├── app.trest             # Arquivo principal da aplicação
├── vercel.json           # Configuração Vercel
├── package.json          # Dependências e scripts
└── README.md            # Este arquivo
\`\`\`

## 🛠️ Desenvolvimento Local

\`\`\`bash
# Instalar dependências
npm install

# Executar localmente
npm start

# Modo desenvolvimento (verbose)
npm run dev
\`\`\`

## 📚 Documentação

- [Documentação Completa Trest](https://trest-site.vercel.app)
- [Guia de Deploy Vercel](./VERCEL_DEPLOY.md) (se disponível)
- [Site Oficial](https://trest-site.vercel.app)

## 📝 Notas

- Usando Trest Language v${TREST_VERSION}
- Projeto otimizado para serverless functions
- Rotas são definidas em \`app.trest\`

---

Criado com ❤️ usando Trest Language v${TREST_VERSION}
`;

    fs.writeFileSync(
      path.join(projectPath, 'README.md'),
      readmeContent
    );
    log('✅ README.md criado', 'green');
    
    // Instalar dependências
    log('\n📦 Instalando dependências...', 'cyan');
    log('   (Isso pode levar alguns segundos)\n', 'yellow');
    
    try {
      execSync(`npm install`, { 
        stdio: 'inherit',
        cwd: projectPath,
        shell: process.platform === 'win32'
      });
      log('\n✅ Dependências instaladas!', 'green');
    } catch (error) {
      log('\n⚠️  Aviso: Não foi possível instalar dependências automaticamente.', 'yellow');
      log('   Execute manualmente: npm install', 'yellow');
    }
    
    // Mensagem final
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log('\n✅ Projeto criado com sucesso!', 'green');
    log(`\n📂 Localização: ${projectPath}`, 'cyan');
    log('\n🚀 Próximos passos:', 'bright');
    log(`\n   cd ${projectName}`, 'cyan');
    log('   npm start          # Executar localmente', 'cyan');
    log('   vercel             # Deploy na Vercel', 'cyan');
    log('\n💡 Dica: Edite app.trest para criar suas rotas', 'yellow');
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');
    
  } catch (error) {
    log(`\n❌ Erro ao criar projeto: ${error.message}`, 'red');
    if (error.stack) {
      console.error(error.stack);
    }
    
    if (fs.existsSync(projectPath)) {
      try {
        fs.rmSync(projectPath, { recursive: true, force: true });
        log('🗑️  Pasta do projeto removida devido ao erro', 'yellow');
      } catch (cleanupError) {
        // Ignorar erros de limpeza
      }
    }
    
    process.exit(1);
  }
}

main().catch((error) => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
});
