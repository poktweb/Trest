# Trest Language - Linguagem de Programação Moderna

Uma linguagem de programação moderna e profissional, compilável para **Web** e **Desktop (.exe)** com suporte completo a caracteres especiais (Cirílico e português).

## 🚀 Características Principais

- ✅ **Compilação para Web** - Gera JavaScript otimizado
- ✅ **Compilação para Desktop** - Cria executáveis nativos .exe
- ✅ **Sistema de Módulos** - Import/Export de módulos
- ✅ **Biblioteca Padrão** - std com funções matemáticas, strings, arrays e I/O
- ✅ **Tratamento de Erros** - Try/Catch/Throw completo
- ✅ **Sintaxe Flexível** - Suporta Cirílico e Português
- ✅ **Tipagem Dinâmica** - Tipos inferidos automaticamente
- ✅ **Sistema de Build Profissional**

## 📦 Instalação

### Instalação Global (Recomendado)

```bash
npm install -g trest-language
```

Após instalação, os comandos `trest` e `trestc` estarão disponíveis globalmente:
```bash
trest --version
trestc --help
```

### Instalação Local em Projeto

```bash
npm install trest-language
```

Use via `npx`:
```bash
npx trest programa.trest
npx trestc programa.trest --mode web
```

### Instalação a partir do Código

```bash
git clone https://github.com/trest-language/trest.git
cd trest
npm install
npm run build
npm link  # Para uso global
```

## 🎯 Início Rápido

### Executar arquivo diretamente
```bash
trest programa.trest
```

### Compilar para Web (JavaScript)
```bash
trestc programa.trest --mode web -o app.js
```

### Compilar para Executável
```bash
trestc programa.trest --mode exe -o app.exe
```

## 📚 Sintaxe da Linguagem

### Variáveis

```trest
перем nome = "Trest"      // Cirílico
var idade = 25            // Português
конст pi = 3.14159       // Cirílico
```

### Funções

```trest
// Cirílico
функция somar(a, b) {
    вернуть a + b
}

// Português  
funcao somar(a, b) {
    retorne a + b
}
```

### Condicionais

```trest
// Cirílico
если (idade >= 18) {
    печать("Maior de idade")
} иначе {
    печать("Menor de idade")
}

// Português
se (idade >= 18) {
    imprima("Maior de idade")
} senao {
    imprima("Menor de idade")
}
```

### Loops

```trest
// While
пока (i < 10) {
    печать(i)
    i = i + 1
}

// For
для (пусть i = 0; i < 10; i = i + 1) {
    печать(i)
}
```

### Biblioteca Padrão

```trest
импорт * как Math из "std/math"
импорт * como Math de "std/math"

пусть resultado = Math.abs(-5)
Math.sqrt(16)
Math.PI
```

## 📖 Documentação

- [README Principal](README.md) - Visão geral completa
- [Guia de Instalação](INSTALL.md) - Instruções detalhadas
- [Documentação Completa](docs/README.md) - Referência completa
- [Guia de Início](docs/guide.md) - Tutorial passo a passo
- [Exemplos](docs/examples.md) - Códigos de exemplo
- [API Reference](docs/api.md) - Referência de API

## 🛠️ Requisitos

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0

Verifique suas versões:
```bash
node --version
npm --version
```

## 🔧 Scripts Disponíveis

```bash
npm run build        # Compilar TypeScript
npm run build:watch  # Compilar em modo watch
npm run clean        # Limpar arquivos compilados
npm start <arquivo>  # Executar arquivo Trest
```

## 📝 Palavras-Chave

### Cirílico (Principal)
| Trest | Equivalente |
|-------|-------------|
| `если` | if |
| `иначе` | else |
| `пока` | while |
| `для` | for |
| `функция` | function |
| `вернуть` | return |
| `печать` | print |

### Português (Alternativo)
| Trest | Equivalente |
|-------|-------------|
| `se` | if |
| `senao` | else |
| `enquanto` | while |
| `para` | for |
| `funcao` | function |
| `retorne` | return |
| `imprima` | print |

## 🌐 Compilação

### Para Web

O compilador web gera JavaScript moderno compatível com:
- Navegadores (via `<script>` ou bundler)
- Node.js
- React/Vue/Angular
- Qualquer ambiente JavaScript

```bash
trestc programa.trest --mode web
```

### Para Executável

O compilador de executável cria arquivos `.exe` que:
- Não requerem Node.js instalado
- São autônomos (incluem todas as dependências)
- Executam diretamente no Windows

```bash
trestc programa.trest --mode exe
```

## 🏗️ Estrutura do Projeto

```
treste/
├── src/
│   ├── lexer.ts          # Analisador léxico
│   ├── parser.ts         # Analisador sintático
│   ├── ast.ts            # Definições AST
│   ├── interpreter.ts    # Interpretador
│   ├── compiler.ts       # CLI do compilador
│   ├── compiler/
│   │   ├── web.ts        # Compilador Web
│   │   └── exe.ts        # Compilador EXE
│   ├── std/              # Biblioteca padrão
│   └── ...
├── dist/                 # Código compilado
├── exemplos/             # Programas exemplo
├── docs/                 # Documentação
└── package.json
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

MIT - veja [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**PoktWeb**

- 📖 Site da Documentação: [https://trest-site.vercel.app](https://trest-site.vercel.app)
- 💻 GitHub: [@poktweb](https://github.com/poktweb)

## 🔗 Links

- 📦 Site da Documentação: [https://trest-site.vercel.app](https://trest-site.vercel.app)
- 🔧 GitHub Repository: [https://github.com/trest-language/trest](https://github.com/trest-language/trest)
- 🐛 Issues: [https://github.com/trest-language/trest/issues](https://github.com/trest-language/trest/issues)
- 📚 Documentação Completa: [docs/README.md](docs/README.md)

## 🙏 Agradecimentos

Obrigado por usar o Trest Language!

