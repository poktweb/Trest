# Trest - Linguagem de Programação com Suporte a Cirílico

[![npm version](https://img.shields.io/npm/v/treste.svg)](https://www.npmjs.com/package/treste)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Active Maintenance](https://img.shields.io/badge/maintenance-active-green.svg)](https://trest-site.vercel.app)

Linguagem de programação moderna e profissional, estruturalmente organizada e compilável para **Web** e **Desktop (.exe)** com suporte completo a cirílico (alfabeto russo).

> **🎯 Característica Única:** Trest permite programar usando palavras-chave em cirílico ou latino, mantendo a mesma sintaxe e funcionalidades.

> **🔒 Segurança:** Versão 2.4.4 inclui correções de segurança da cadeia de suprimentos. Veja [SECURITY.md](./SECURITY.md) para detalhes.

## 🚀 Principais Funcionalidades

- ✅ **Execução Inline** - Execute código direto na linha de comando com `-e`
- ✅ **Compilação para Web** - Gera JavaScript otimizado
- ✅ **Compilação para Desktop** - Cria executáveis .exe nativos
- ✅ **Sistema de Módulos** - Import/Export de módulos
- ✅ **Biblioteca Padrão** - std com funções matemáticas, strings, arrays e I/O
- ✅ **Tratamento de Erros** - Try/Catch/Throw estendido
- ✅ **Sintaxe em Cirílico** - Palavras-chave em russo
- ✅ **Tipagem Dinâmica** - Tipos inferidos automaticamente
- ✅ **Sistema de Build** - Ferramentas de compilação profissionais

## 📦 Instalação

### Instalação via npm (recomendado)

**Instalação global:**
```bash
npm install -g treste
```

Após a instalação, os comandos `trest` e `trestc` estarão disponíveis globalmente:
```bash
trest --version
trestc --help
```

**Instalação local em projeto:**
```bash
npm install treste
```

Use via `npx`:
```bash
npx trest programa.trest
npx trestc programa.trest --mode web
```

### Instalação a partir do código-fonte

Se você quiser instalar a partir do código-fonte ou fazer modificações:

```bash
# Baixar o código-fonte
cd treste

# Instalar dependências
npm install

# Compilar o projeto
npm run build

# (Opcional) Criar links globais para testes
npm link
```

### Requisitos

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **TypeScript**: 5.0+ (para desenvolvimento)

Verifique sua versão:
```bash
node --version  # deve ser >= v18
npm --version   # deve ser >= 9
```

## 🎯 Guia Rápido

### Executar código inline (sem arquivo)
```bash
trest -e "печать('Olá, Mundo!')"
trest -e "пусть x = 10; печать(x)"
```

### Executar arquivo (interpretador)
```bash
trest exemplos/hello_cyrillic.trest
```

### Compilar para Web (JavaScript)
```bash
npm run compile:web -- exemplos/hello_cyrillic.trest
# ou
trestc exemplos/hello_cyrillic.trest --mode web --output app.js
```

### Compilar para executável (.exe)
```bash
npm run compile:exe -- exemplos/hello_cyrillic.trest
# ou
trestc exemplos/hello_cyrillic.trest --mode exe --output app.exe
```

## 📚 Sintaxe da Linguagem

Todos os exemplos abaixo usam a sintaxe em **cirílico** (palavras-chave em russo), que é a forma nativa do Trest:

### Variáveis

```trest
перем имя = "Trest"
пусть возраст = 25
конст pi = 3.14159
```

### Funções

```trest
функция сложить(a, b) {
    вернуть a + b
}

пусть результат = сложить(5, 3)
печать(результат)
```

### Condicionais

```trest
если (возраст >= 18) {
    печать("Совершеннолетний")
} иначе {
    печать("Несовершеннолетний")
}
```

### Operadores Ternários

```trest
пусть result = возраст >= 18 ? "Adulto" : "Menor"
печать(result)
```

### Switch/Case

```trest
переключатель (день) {
    случай 1:
        печать("Понедельник")
        прервать
    случай 2:
        печать("Вторник")
        прервать
    поумолчанию:
        печать("Другой день")
}
```

### Loops

**While (Enquanto):**
```trest
пусть i = 0
пока (i < 10) {
    печать(i)
    i = i + 1
}
```

**For (Para):**
```trest
для (пусть i = 0; i < 10; i = i + 1) {
    печать(i)
}
```

### Tratamento de Erros

```trest
попытаться {
    пусть результат = разделить(10, 0)
} перехватить (ошибка) {
    печать("Ошибка:", ошибка)
} наконец {
    печать("Операция завершена")
}
```

### Módulos

**Import (Importar):**
```trest
импорт { max, min } измодуля "std/math"
импорт * как Math измодуля "std/math"
```

**Export (Exportar):**
```trest
экспорт функция мояФункция() {
    вернуть "Привет"
}

экспорт конст константа = 42
```

### Objetos

```trest
пусть человек = {
    имя: "Иван",
    возраст: 30,
    город: "Москва"
}

печать(человек.имя)  # "Иван"
```

### Arrays

```trest
пусть числа = [1, 2, 3, 4, 5]
печать(числа[0])  # 1

числа[0] = 10
печать(числа)  # [10, 2, 3, 4, 5]
```

## 📖 Biblioteca Padrão (std)

Trest inclui uma biblioteca padrão rica com 11 módulos:

### Math (Matemática)

```trest
импорт * как Math измодуля "std/math"

пусть x = Math.abs(-5)      # 5
пусть y = Math.max(10, 20)  # 20
пусть z = Math.sqrt(16)     # 4
пусть pi = Math.PI          # 3.14159...
```

### String (Cadeias de Texto)

```trest
импорт * как String измодуля "std/string"

пусть текст = "Привет Мир"
пусть размер = String.размер(текст)      # 11
пусть верхний = String.верхний(текст)  # "ПРИВЕТ МИР"
```

### Array (Arrays)

```trest
импорт * как Array измодуля "std/array"

пусть arr = [1, 2, 3]
Array.добавить(arr, 4)      # [1, 2, 3, 4]
пусть обратный = Array.обратить(arr)  # [4, 3, 2, 1]
пусть отсортированный = Array.отсортировать([3, 1, 2])  # [1, 2, 3]
```

### HTTP (Client e Server)

```trest
импорт * как HTTP измодуля "std/http"

пусть resposta = HTTP.GET("https://api.example.com")
HTTP.POST("https://api.example.com", данные)
HTTP.создатьСервер(3000, обработчик)
```

### Crypto (Criptografia)

```trest
импорт * как Crypto измодуля "std/crypto"

пусть hash = Crypto.md5("текст")
пусть sha = Crypto.sha256("данные")
пусть encrypted = Crypto.зашифровать("секрет", "ключ")
```

### FileSystem (Sistema de Arquivos)

```trest
импорт * как FS измодуля "std/filesystem"

пусть содержимое = FS.читатьФайл("файл.txt")
FS.писатьФайл("выход.txt", "Содержимое")
пусть существует = FS.существуетФайл("файл.txt")
```

### JSON (Manipulação de JSON)

```trest
импорт * как JSON измодуля "std/json"

пусть obj = JSON.парсить('{"имя": "Иван"}')
пусть str = JSON.строка({имя: "Иван"})
```

### Date (Datas)

```trest
импорт * как Date измодуля "std/date"

пусть agora = Date.сейчас()
пусть formatado = Date.форматировать(agora, "YYYY-MM-DD")
```

### Database (Base de Dados)

```trest
импорт * как DB измодуля "std/database"

DB.подключить("sqlite", "dados.db")
DB.выполнить("SELECT * FROM usuarios")
```

### RegEx (Expressões Regulares)

```trest
импорт * как RegEx измодуля "std/regex"

пусть matches = RegEx.найти("olá mundo", /olá/)
пусть replaced = RegEx.заменить("olá", /olá/, "привет")
```

### Path (Caminhos de Arquivo)

```trest
импорт * как Path измодуля "std/path"

пусть dir = Path.директория("/caminho/arquivo.txt")  # "/caminho"
пусть name = Path.имя("arquivo.txt")  # "arquivo.txt"
```

### Process (Variáveis de Ambiente)

```trest
импорт * как Process измодуля "std/process"

пусть user = Process.получитьEnv("USER")
пусть envs = Process.получитьEnvVars()
```

## 🏗️ Estrutura do Projeto

```
treste/
├── src/
│   ├── lexer.ts          # Analisador léxico
│   ├── parser.ts         # Analisador sintático
│   ├── ast.ts            # Definições AST
│   ├── interpreter.ts   # Interpretador
│   ├── compiler.ts      # CLI do compilador
│   ├── compiler/
│   │   ├── web.ts        # Compilador para Web
│   │   └── exe.ts        # Compilador para executável
│   ├── std/              # Biblioteca padrão
│   │   ├── math.trest
│   │   ├── string.trest
│   │   ├── array.trest
│   │   ├── http.trest
│   │   ├── crypto.trest
│   │   ├── filesystem.trest
│   │   ├── json.trest
│   │   ├── date.trest
│   │   ├── database.trest
│   │   ├── regex.trest
│   │   ├── path.trest
│   │   ├── process.trest
│   │   └── io.trest
│   ├── types.ts          # Sistema de tipos
│   ├── errors.ts         # Tratamento de erros
│   └── module.ts         # Sistema de módulos
├── exemplos/             # Exemplos de programas
├── docs/                 # Documentação completa
├── dist/                 # Código compilado
└── package.json
```

## 🔧 Scripts Disponíveis

```bash
npm run build          # Compilar TypeScript
npm run build:watch     # Compilar em modo watch
npm start <arquivo>    # Executar arquivo Trest
npm run compile:web    # Compilar para JavaScript
npm run compile:exe     # Compilar para executável
npm run bundle         # Criar bundle executável
```

## 📝 Palavras-Chave

### Cirílico (Russo) - Sintaxe Principal

| Trest | Equivalente |
|-------|-------------|
| `если` | if |
| `иначе` | else |
| `пока` | while |
| `для` | for |
| `функция` | function |
| `вернуть` | return |
| `перем`, `пусть`, `конст` | var, let, const |
| `печать` | print/console.log |
| `импорт` | import |
| `экспорт` | export |
| `измодуля` | from |
| `попытаться` | try |
| `перехватить` | catch |
| `бросить` | throw |
| `наконец` | finally |
| `прервать` | break |
| `продолжить` | continue |
| `истина` | true |
| `ложь` | false |

> **Nota:** Embora Trest suporte palavras-chave em latino, o uso de cirílico é a forma recomendada e nativa da linguagem.

## 🌐 Compilação para Web

O compilador para web gera JavaScript moderno que pode ser usado em:
- Navegadores (via `<script>` ou bundler)
- Node.js
- React/Vue/Angular
- Qualquer ambiente JavaScript

**Exemplo:**
```bash
trestc программа.trest --mode web --output app.js
```

## 💻 Compilação para Executável

O compilador para executável cria arquivo `.exe` que:
- Não requer Node.js instalado
- É autossuficiente (inclui todas as dependências)
- Executa diretamente no Windows

**Exemplo:**
```bash
trestc программа.trest --mode exe --output app.exe
```

## 🎓 Exemplos

Veja a pasta `exemplos/` para programas completos demonstrando:
- Operações básicas
- Funções e closures
- Estruturas de controle
- Arrays e objetos
- Módulos e imports
- Tratamento de erros

**Exemplos em cirílico:**
- `exemplos/crypto_demo.trest` - Demonstração de criptografia
- `exemplos/http_demo.trest` - Cliente HTTP e servidor
- `exemplos/database_demo.trest` - Operações de banco de dados
- `exemplos/filesystem_demo.trest` - Operações de arquivo
- `exemplos/todas_funcionalidades.trest` - Exemplo completo

## 🔒 Segurança

**Versão 2.4.4** inclui correções de segurança da cadeia de suprimentos:
- ✅ Scripts de instalação removidos
- ✅ Sem acesso ao shell durante instalação
- ✅ Acesso à rede controlado e documentado

**Documentação de Segurança:**
- **[SECURITY.md](./SECURITY.md)** - Política de segurança completa
- **[SOCKET_ALERTS.md](./SOCKET_ALERTS.md)** - Resposta aos alertas do Socket
- **[CHANGELOG_SECURITY.md](./CHANGELOG_SECURITY.md)** - Changelog de segurança

## 📚 Documentação Completa

Para mais informações, consulte a documentação completa em `docs/`:

- **[README.md](docs/README.md)** - Guia completo
- **[FEATURES.md](docs/FEATURES.md)** - Todas as funcionalidades
- **[API.md](docs/api.md)** - Referência da API
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Arquitetura técnica
- **[WHY_TREST.md](docs/WHY_TREST.md)** - Por que usar Trest
- **[DOCUMENTACAO_COMPLETA.md](./DOCUMENTACAO_COMPLETA.md)** - Documentação completa unificada

Ou visite o site oficial: [https://trest-site.vercel.app](https://trest-site.vercel.app)

## 📄 Licença

MIT

## 👤 Autor

**PoktWeb**

- Site de documentação: [https://trest-site.vercel.app](https://trest-site.vercel.app)

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.
