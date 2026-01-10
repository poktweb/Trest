#!/usr/bin/env node
/**
 * create-trest-app / create-treste-app
 * Script para criar um novo projeto Trest localmente
 * Similar ao create-next-app do Next.js
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const readline = require('readline');

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
  
  // Validar caracteres permitidos
  const validNameRegex = /^[a-zA-Z0-9-_]+$/;
  if (!validNameRegex.test(name)) {
    return { 
      valid: false, 
      error: 'Nome do projeto pode conter apenas letras, números, hífens e underscores' 
    };
  }
  
  // Não pode começar com número
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
  log('\n🚀 Create Trest App', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');
  log('Cria um novo projeto Trest localmente', 'cyan');
  log('\nUso:', 'bright');
  log('  npx create-trest-app <nome-projeto>', 'cyan');
  log('  npx create-treste-app <nome-projeto>', 'cyan');
  log('\nExemplos:', 'bright');
  log('  npx create-trest-app meu-projeto', 'cyan');
  log('  npx create-trest-app calculadora-app', 'cyan');
  log('\nSe o nome do projeto não for fornecido, será solicitado interativamente.', 'yellow');
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');
  process.exit(0);
}

async function main() {
  // Verificar argumentos de ajuda
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h') || args.includes('help')) {
    showHelp();
  }

  log('\n🚀 Create Trest App', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  let projectName = getProjectName();
  
  // Se não fornecido, perguntar
  if (!projectName) {
    projectName = await askQuestion('📁 Nome do projeto: ');
  }
  
  // Validar novamente após perguntar
  if (!projectName || projectName.trim().length === 0) {
    log('\n❌ Erro: Nome do projeto não pode estar vazio', 'red');
    process.exit(1);
  }
  
  projectName = projectName.trim();
  
  // Validar nome
  const validation = validateProjectName(projectName);
  if (!validation.valid) {
    log(`\n❌ Erro: ${validation.error}`, 'red');
    process.exit(1);
  }
  
  // Obter diretório atual de forma mais confiável
  let currentDir = process.cwd();
  
  // Verificar se estamos no diretório correto (pode haver problemas com npx)
  if (!currentDir || currentDir === '/' || currentDir === '\\') {
    // Fallback: usar diretório do usuário
    currentDir = process.env.USERPROFILE || process.env.HOME || process.cwd();
    log(`⚠️  Usando diretório: ${currentDir}`, 'yellow');
  }
  
  const projectPath = path.resolve(currentDir, projectName);
  
  // Verificar se a pasta já existe
  if (fs.existsSync(projectPath)) {
    log(`\n❌ Erro: A pasta "${projectName}" já existe!`, 'red');
    process.exit(1);
  }
  
  log(`\n📦 Criando projeto: ${projectName}`, 'cyan');
  log(`📂 Caminho: ${projectPath}\n`, 'cyan');
  
  try {
    // Criar pasta do projeto
    fs.mkdirSync(projectPath, { recursive: true });
    log('✅ Pasta do projeto criada', 'green');
    
    // Criar estrutura de pastas
    fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'exemplos'), { recursive: true });
    log('✅ Estrutura de pastas criada', 'green');
    
    // Criar package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      description: `Projeto Trest: ${projectName}`,
      main: 'src/main.trest',
      scripts: {
        start: 'trest src/main.trest',
        dev: 'trest src/main.trest --verbose',
        build: 'trestc src/main.trest --mode web --output dist/app.js',
        'build:exe': 'trestc src/main.trest --mode exe --output dist/app.exe',
      },
      keywords: ['trest', 'trest-language'],
      author: '',
      license: 'MIT',
    };
    
    fs.writeFileSync(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    log('✅ package.json criado', 'green');
    
    // Criar arquivo main.trest
    const mainTrestContent = `# Aplicação Trest
# Arquivo principal do projeto

печать("Olá, Mundo!")
печать("Bem-vindo ao projeto ${projectName}!")

# Exemplo básico
пусть mensagem = "Trest Language"
пусть versão = "2.4.9"

печать("Usando " + mensagem + " v" + versão)
печать("")
печать("Para executar: npm start")
печать("Para desenvolvimento: npm run dev")
печать("Para compilar: npm run build")
`;

    fs.writeFileSync(
      path.join(projectPath, 'src', 'main.trest'),
      mainTrestContent
    );
    log('✅ src/main.trest criado', 'green');
    
    // Criar exemplo.trest
    const exemploContent = `# Exemplo de código Trest
# Este arquivo demonstra algumas funcionalidades básicas

# Variáveis
пусть nome = "Trest"
пусть numero = 42
пусть ativo = истина

# Arrays
пусть lista = [1, 2, 3, 4, 5]

# Objetos
пусть pessoa = {
    nome = "João",
    idade = 30,
    cidade = "São Paulo"
}

# Funções
функция somar(a, b) {
    вернуть a + b
}

# Estruturas condicionais
если (numero > 10) {
    печать("Número é maior que 10")
} иначе {
    печать("Número é menor ou igual a 10")
}

# Loops
для (пусть i = 0; i < 5; i = i + 1) {
    печать("Iteração: " + i)
}

печать("")
печать("Resultado da soma: " + somar(10, 20))
`;

    fs.writeFileSync(
      path.join(projectPath, 'exemplos', 'exemplo.trest'),
      exemploContent
    );
    log('✅ exemplos/exemplo.trest criado', 'green');
    
    // Criar README.md
    const readmeContent = `# ${projectName}

Projeto criado com [Trest Language](https://trest-site.vercel.app)

## 🚀 Como Usar

### Instalar Trest (se ainda não tiver instalado globalmente)

\`\`\`bash
npm install -g treste@latest
\`\`\`

### Executar o projeto

\`\`\`bash
npm start
\`\`\`

### Modo desenvolvimento (verbose)

\`\`\`bash
npm run dev
\`\`\`

### Compilar para JavaScript

\`\`\`bash
npm run build
\`\`\`

### Compilar para executável

\`\`\`bash
npm run build:exe
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
${projectName}/
├── src/
│   └── main.trest      # Arquivo principal
├── exemplos/
│   └── exemplo.trest   # Exemplos de código
├── package.json        # Configuração do projeto
└── README.md          # Este arquivo
\`\`\`

## 📚 Documentação

Para mais informações sobre a linguagem Trest:
- [Documentação Completa](https://trest-site.vercel.app)
- [GitHub](https://github.com/poktweb/treste)

## 📝 Notas

- Todos os arquivos Trest devem ter extensão \`.trest\`
- O arquivo principal está em \`src/main.trest\`
- Exemplos estão na pasta \`exemplos/\`

---

Criado com ❤️ usando Trest Language v2.4.9
`;

    fs.writeFileSync(
      path.join(projectPath, 'README.md'),
      readmeContent
    );
    log('✅ README.md criado', 'green');
    
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
`;

    fs.writeFileSync(
      path.join(projectPath, '.gitignore'),
      gitignoreContent
    );
    log('✅ .gitignore criado', 'green');
    
    // Instalar treste localmente
    log('\n📦 Instalando Trest Language localmente...', 'cyan');
    log('   (Isso pode levar alguns segundos)\n', 'yellow');
    
    try {
      execSync(`npm install treste@latest`, { 
        stdio: 'inherit',
        cwd: projectPath,
        shell: process.platform === 'win32'
      });
      log('\n✅ Trest Language instalado localmente!', 'green');
    } catch (error) {
      log('\n⚠️  Aviso: Não foi possível instalar treste automaticamente.', 'yellow');
      log(`   Erro: ${error.message}`, 'yellow');
      log('   Execute manualmente: npm install treste@latest', 'yellow');
    }
    
    // Mensagem final
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log('\n✅ Projeto criado com sucesso!', 'green');
    log(`\n📂 Localização: ${projectPath}`, 'cyan');
    log('\n🚀 Próximos passos:', 'bright');
    log(`\n   cd ${projectName}`, 'cyan');
    log('   npm start', 'cyan');
    log('\n💡 Dica: Use "npm run dev" para modo desenvolvimento', 'yellow');
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');
    
  } catch (error) {
    log(`\n❌ Erro ao criar projeto: ${error.message}`, 'red');
    if (error.stack) {
      console.error(error.stack);
    }
    
    // Limpar pasta se houver erro
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

// Executar
main().catch((error) => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
});
