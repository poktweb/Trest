# ✨ Funcionalidades - Trest Language v2.4.0

Documentação completa de todas as funcionalidades da linguagem Trest.

---

## 🎯 Características Principais

### 🆎 Suporte Total ao Cirílico
- **Palavras-chave em russo**: `пусть`, `если`, `для`, `функция`, `вернуть`
- **Sintaxe intuitiva**: Pensada especificamente para falantes de russo
- **Zero barreira linguística**: Código totalmente legível em russo

### ⚡ Tipagem Dinâmica
- **Inferência automática**: Não precisa declarar tipos
- **Flexibilidade**: Uma variável pode mudar de tipo
- **Simplicidade**: Menos código, mais produtividade

### 🔧 Compilação Universal
- **Web**: Gera JavaScript otimizado para navegadores
- **Desktop**: Compila para executáveis `.exe` no Windows
- **Mesmo código**: Um único código-fonte para todas as plataformas

---

## 📦 Biblioteca Padrão Completa

### 🔢 Math - Funções Matemáticas
Operações matemáticas avançadas prontas para usar.

**Importação:**
```trest
импорт * как Math измодуля "std/math"
```

**Funções:**
- `Math.abs(x)` - Valor absoluto
- `Math.max(a, b)` - Máximo entre dois valores
- `Math.min(a, b)` - Mínimo entre dois valores
- `Math.sqrt(x)` - Raiz quadrada
- `Math.pow(base, exp)` - Potência (base^exp)
- `Math.ceil(x)` - Arredondar para cima
- `Math.floor(x)` - Arredondar para baixo
- `Math.round(x)` - Arredondar (mais próximo)

**Constantes:**
- `Math.PI` - 3.141592653589793
- `Math.E` - 2.718281828459045

**Exemplo:**
```trest
импорт * как Math измодуля "std/math"

печать(Math.sqrt(25))      # 5
печать(Math.max(10, 20))   # 20
печать(Math.abs(-42))      # 42
печать(Math.PI)            # 3.14159...
```

---

### 🌐 HTTP - Cliente e Servidor HTTP
Cliente HTTP completo e servidor integrado.

**Importação:**
```trest
импорт * как HTTP измодуля "std/http"
```

**Cliente (Requisições):**
- `HTTP.GET(url, options)` - Requisição GET
- `HTTP.POST(url, data, options)` - Requisição POST
- `HTTP.PUT(url, data, options)` - Requisição PUT
- `HTTP.DELETE(url, options)` - Requisição DELETE
- `HTTP.fetch(url, options)` - Fetch API completa

**Servidor:**
- `HTTP.createServer(port, handler)` - Criar servidor HTTP

**Exemplo Cliente:**
```trest
импорт * как HTTP измодуля "std/http"

# GET request
пусть resposta = HTTP.GET("https://api.example.com/data")

# POST request
пусть data = { nome = "João", idade = 30 }
пусть result = HTTP.POST("https://api.example.com/users", data)
```

**Exemplo Servidor:**
```trest
импорт * как HTTP измодуля "std/http"

HTTP.createServer(3000, функция(запрос, ответ) {
    ответ.json({ message = "Olá do Trest!" })
})
```

---

### 🔐 Crypto - Criptografia e Segurança
Hash e criptografia avançados.

**Importação:**
```trest
импорт * как Crypto измодуля "std/crypto"
```

**Hash:**
- `Crypto.md5(text)` - Hash MD5 (128-bit)
- `Crypto.sha256(text)` - Hash SHA256 (256-bit)
- `Crypto.sha512(text)` - Hash SHA512 (512-bit)

**Criptografia:**
- `Crypto.encrypt(text, key)` - Criptografar AES-256
- `Crypto.decrypt(encrypted, key)` - Descriptografar AES-256
- `Crypto.randomBytes(size)` - Bytes aleatórios

**Exemplo:**
```trest
импорт * как Crypto измодуля "std/crypto"

# Hash de senha
пусть senhaHash = Crypto.sha256("minhaSenha")

# Criptografia
пусть chave = "minhaChave123"
пусть textoCripto = Crypto.encrypt("dados sensíveis", chave)
пусть textoOriginal = Crypto.decrypt(textoCripto, chave)
```

---

### 💾 FileSystem - Sistema de Arquivos
Operações completas de arquivos e diretórios.

**Importação:**
```trest
импорт * как FileSystem измодуля "std/filesystem"
```

**Funções:**
- `FileSystem.readFile(path)` - Ler arquivo
- `FileSystem.writeFile(path, content)` - Escrever arquivo
- `FileSystem.exists(path)` - Verificar existência
- `FileSystem.deleteFile(path)` - Deletar arquivo
- `FileSystem.listDir(path)` - Listar diretório

**Exemplo:**
```trest
импорт * как FileSystem измодуля "std/filesystem"

# Verificar e ler arquivo
если (FileSystem.exists("dados.txt")) {
    пусть conteudo = FileSystem.readFile("dados.txt")
    печать(conteudo)
}

# Escrever arquivo
FileSystem.writeFile("saida.txt", "Conteúdo do arquivo")

# Listar diretório
пусть arquivos = FileSystem.listDir("src/")
```

---

### 📄 JSON - Trabalhar com JSON
Parse e stringificação de JSON.

**Importação:**
```trest
импорт * как JSON измодуля "std/json"
```

**Funções:**
- `JSON.parse(str)` - Parse JSON para objeto
- `JSON.stringify(obj)` - Converter objeto para JSON

**Exemplo:**
```trest
импорт * как JSON измодуля "std/json"

# Parse
пусть jsonStr = '{"nome": "João", "idade": 30}'
пусть obj = JSON.parse(jsonStr)

# Stringify
пусть meuObj = { nome = "Maria", lang = "Trest" }
пусть json = JSON.stringify(meuObj)
```

---

### 📅 Date - Datas e Tempo
Manipulação completa de datas.

**Importação:**
```trest
импорт * как Date измодуля "std/date"
```

**Funções:**
- `Date.now()` - Timestamp atual (milissegundos)
- `Date.format(timestamp, format)` - Formatar data
- `Date.timezone(tz)` - Obter/configurar timezone

**Exemplo:**
```trest
импорт * как Date измодуля "std/date"

пусть agora = Date.now()
пусть formatado = Date.format(agora, "yyyy-MM-dd HH:mm:ss")
пусть tz = Date.timezone("America/Sao_Paulo")
```

---

### 🗄️ Database - Banco de Dados
ORM e query builder integrados.

**Importação:**
```trest
импорт * как DB измодуля "std/database"
```

**Funções:**
- `DB.openDB(name)` - Abrir conexão com BD
- `DB.Model(name, schema)` - Criar modelo ORM

**Exemplo:**
```trest
импорт * как DB измодуля "std/database"

пусть db = DB.openDB("meu_banco")

пусть Usuario = DB.Model("usuarios", {
    nome = "string",
    email = "string",
    idade = "number"
})
```

---

### ⚡ Async - Programação Assíncrona
Promises, delays e timers.

**Importação:**
```trest
импорт * как Async измодуля "std/async"
```

**Funções:**
- `Async.delay(ms)` - Delay/Sleep
- `Async.createPromise(fn)` - Criar Promise

**Exemplo:**
```trest
импорт * как Async измодуля "std/async"

# Aguardar 1 segundo
Async.delay(1000)

# Promise
пусть promessa = Async.createPromise(функция(resolve, reject) {
    если (успех) {
        resolve(данные)
    } иначе {
        reject(ошибка)
    }
})
```

---

### 🎨 GUI - Interface Gráfica
Criação de interfaces gráficas (em desenvolvimento).

**Importação:**
```trest
импорт * как GUI измодуля "std/gui"
```

**Funções:**
- `GUI.createWindow(title, width, height)` - Criar janela
- `GUI.createButton(label, onClick)` - Criar botão

---

### 🔍 RegEx - Expressões Regulares
Match, search, replace e split com regex.

**Importação:**
```trest
импорт * как RegEx измодуля "std/regex"
```

**Funções:**
- `RegEx.create(pattern)` - Criar regex
- `RegEx.test(pattern, text)` - Testar padrão
- `RegEx.match(pattern, text)` - Encontrar primeira correspondência
- `RegEx.findAll(pattern, text)` - Encontrar todas
- `RegEx.replace(pattern, text, replacement)` - Substituir
- `RegEx.split(pattern, text, limit)` - Dividir por padrão

**Exemplo:**
```trest
импорт * как RegEx измодуля "std/regex"

# Validar email
если (RegEx.test("[a-z]+@[a-z]+\\.com", "user@example.com")) {
    печать("Email válido")
}

# Extrair números
пусть texto = "Preço: R$ 100,50"
пусть numeros = RegEx.findAll("\\d+", texto)

# Substituir
пусть novoTexto = RegEx.replace("\\d+", "3 gatos", "4")
# Resultado: "4 gatos"
```

---

### 📁 Path - Manipulação de Caminhos
Operações com caminhos de arquivos.

**Importação:**
```trest
импорт * как Path измодуля "std/path"
```

**Funções:**
- `Path.join(...segments)` - Juntar segmentos
- `Path.resolve(...segments)` - Resolver caminho absoluto
- `Path.dirname(path)` - Diretório pai
- `Path.basename(path, ext)` - Nome base
- `Path.extname(path)` - Extensão
- `Path.normalize(path)` - Normalizar caminho
- `Path.isAbsolute(path)` - Verificar se é absoluto
- `Path.relative(from, to)` - Caminho relativo
- `Path.cwd` - Diretório atual

**Exemplo:**
```trest
импорт * как Path измодуля "std/path"

пусть caminho = Path.join("src", "utils", "helper.js")
# Resultado: src/utils/helper.js

пусть nome = Path.basename("/usr/bin/file.js")  # "file.js"
пусть ext = Path.extname("file.js")              # ".js"
пусть dir = Path.dirname("/usr/bin/file.js")     # "/usr/bin"

пусть absoluto = Path.resolve("src", "app.trest")
пусть éAbsoluto = Path.isAbsolute(абсолютный)

пусть relativo = Path.relative("/a", "/a/b/c.js")  # "b/c.js"
```

---

### ⚙️ Process - Variáveis de Ambiente e Sistema
Informações do sistema e variáveis de ambiente.

**Importação:**
```trest
импорт * как Process измодуля "std/process"
```

**Funções:**
- `Process.getEnv(name)` - Obter variável de ambiente
- `Process.getAllEnv()` - Obter todas as variáveis
- `Process.setEnv(name, value)` - Definir variável
- `Process.chdir(path)` - Mudar diretório
- `Process.exit(code)` - Sair do programa
- `Process.platform` - Plataforma (win32, linux, darwin)
- `Process.arch` - Arquitetura (x64, x86)
- `Process.version` - Versão do Node.js
- `Process.cwd` - Diretório de trabalho atual
- `Process.pid` - ID do processo

**Exemplo:**
```trest
импорт * как Process измодуля "std/process"

# Variáveis de ambiente
пусть home = Process.getEnv("HOME")
пусть todas = Process.getAllEnv()

# Informações do sistema
печать("Plataforma:", Process.platform)  # win32
печать("Arquitetura:", Process.arch)     # x64
печать("Versão Node:", Process.version)

печать("Diretório atual:", Process.cwd)
печать("Process ID:", Process.pid)
```

---

## 🔧 Sistema de Módulos

### Importação
```trest
# Importar módulo inteiro
импорт * как Math измодуля "std/math"

# Importar de arquivo local
импорт * как Utils измодуля "./utils.trest"
```

### Exportação
```trest
# Exportar função
экспорт функция minhaFuncao() {
    вернуть "Olá"
}

# Exportar constante
экспорт конст PI = 3.14159
```

---

## 🛡️ Tratamento de Erros

### Try/Catch/Finally
```trest
пытаться {
    рискованныйКод()
} поймать (ошибка) {
    печать("Erro:", ошибка)
} наконец {
    cleanup()
}
```

### Throw
```trest
если (невалидо) {
    бросить "Dados inválidos"
}
```

---

## 🎯 Versão 2.4.0 - Novidades

### ✨ Funcionalidades Core
- **Operadores Ternários**: `result = x > 5 ? 'sim' : 'não'`
- **Switch/Case**: `переключатель (value) { случай 1: ... прервать }`
- **Fall-through**: Suporte completo a casos consecutivos
- **Modo Inline**: `trest -e "код"` total e funcional

## 🎯 Versão 2.3.0 - Novidades

### ✨ Módulos Adicionados
- **RegEx**: Expressões regulares completas
- **Path**: Manipulação de caminhos
- **Process**: Variáveis de ambiente e sistema

### 📚 Documentação
- **100% PT-BR**: Toda documentação em português
- **Guias atualizados**: Exemplos e best practices
- **API reference completa**: Todas as funções documentadas

### 🔧 Melhorias
- **Sistema de imports otimizado**: Carregamento mais rápido
- **Fallback inteligente**: .trest → nativos
- **Compatibilidade total**: Todos os módulos funcionais

---

## 📊 Resumo de Funcionalidades

| Funcionalidade | Status | Versão |
|---------------|--------|--------|
| 🔢 Math | ✅ Completo | 1.0.0 |
| 🌐 HTTP | ✅ Completo | 2.1.0 |
| 🔐 Crypto | ✅ Completo | 2.1.0 |
| 💾 FileSystem | ✅ Completo | 2.1.0 |
| 📄 JSON | ✅ Completo | 2.1.0 |
| 📅 Date | ✅ Completo | 2.1.0 |
| 🗄️ Database | ✅ Completo | 2.1.0 |
| ⚡ Async | ✅ Completo | 2.1.0 |
| 🎨 GUI | 🚧 Em desenvolvimento | 2.1.0 |
| 🔍 RegEx | ✅ Completo | 2.3.0 |
| 📁 Path | ✅ Completo | 2.3.0 |
| ⚙️ Process | ✅ Completo | 2.3.0 |
| 🔧 Módulos | ✅ Completo | 2.2.0 |
| 🛡️ Try/Catch | ✅ Completo | 1.0.0 |
| 🔀 Switch/Case | ✅ Completo | 2.4.0 |
| ❓ Operadores Ternários | ✅ Completo | 2.4.0 |
| 📱 Compilação Web | ✅ Completo | 1.0.0 |
| 💻 Compilação Desktop | ✅ Completo | 1.0.0 |

---

**📖 Para mais informações, consulte:**
- [Guia Completo](./guide.md)
- [Referência da API](./api.md)
- [Exemplos de Código](./examples.md)
- [Best Practices](./best-practices.md)

