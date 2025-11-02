# Trest Language v2.4.0 - Documentação

## 📚 Visão Geral

**Trest Language** - uma linguagem de programação moderna e interpretada com suporte completo a cirílico, criada por PoktWeb.

### Características Principais

- ✅ **Suporte completo a cirílico** - Todas as palavras-chave em russo
- ✅ **Tipagem dinâmica** - Inferência inteligente de tipos
- ✅ **Biblioteca padrão rica** - HTTP, Crypto, DB, GUI, FileSystem e muito mais
- ✅ **Sistema de módulos** - Importar/exportar funcionalidades
- ✅ **Tratamento de erros** - Try/catch/throw completo
- ✅ **Compilação** - Web e Desktop

---

## 🚀 Guia Rápido

### Instalação

```bash
npm install -g treste
```

### Primeiro Programa

Crie o arquivo `hello.trest`:

```trest
печать("Привет, Мир!")
```

Execute:

```bash
trest hello.trest
```

---

## 📖 Fundamentos da Linguagem

### Variáveis

```trest
пусть имя = "Иван"
конст PI = 3.14159
```

### Funções

```trest
функция приветствие(имя) {
    вернуть "Привет, " + имя + "!"
}

печать(приветствие("Мир"))  # "Привет, Мир!"
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

```trest
# for
для (пусть i = 0; i < 10; i = i + 1) {
    печать(i)
}

# while
пока (условие) {
    # código
}
```

---

## 📦 Biblioteca Padrão

### 🔢 Math - Matemática

```trest
импорт * как Math измодуля "std/math"

Math.sqrt(16)      # 4
Math.abs(-5)       # 5
Math.max(10, 20)   # 20
Math.PI            # 3.14159
```

### 📝 String - Strings

```trest
импорт * как String измодуля "std/string"

String.размер("Привет")    # 6
String.верхний("привет")   # "ПРИВЕТ"
String.нижний("ПРИВЕТ")    # "привет"
```

### 📊 Array - Arrays

```trest
импорт * как Array измодуля "std/array"

пусть arr = [1, 2, 3]
Array.добавить(arr, 4)     # [1, 2, 3, 4]
Array.отсортировать(arr)    # [1, 2, 3, 4]
```

### 🌐 HTTP - Requisições HTTP

```trest
импорт * как HTTP измодуля "std/http"

# Requisição GET
пусть ответ = HTTP.GET("https://api.example.com/data")
печать(ответ.status)  # 200
печать(ответ.data)    # Dados

# Requisição POST
пусть данные = { имя = "Иван", возраст = 30 }
HTTP.POST("https://api.example.com/users", данные)

# Criar servidor
пусть сервер = HTTP.createServer()
сервер.listen(3000, функция() {
    печать("Сервер запущен на порту 3000")
})
```

### 🔐 Crypto - Criptografia

```trest
импорт * как Crypto измодуля "std/crypto"

# Hashing
пусть hash_md5 = Crypto.md5("test")
пусть hash_sha = Crypto.sha256("test")

# Criptografia
пусть зашифровано = Crypto.encrypt("секрет", "ключ123")
пусть расшифровано = Crypto.decrypt(зашифровано, "ключ123")

# Dados aleatórios
пусть случайные = Crypto.randomBytes(16)
```

### 📁 FileSystem - Sistema de Arquivos

```trest
импорт * как FileSystem измодуля "std/filesystem"

# Leitura
пусть контент = FileSystem.readFile("file.txt")

# Escrita
FileSystem.writeFile("output.txt", "Содержимое")

# Verificar existência
если (FileSystem.exists("config.json")) {
    печать("Файл найден")
}

# Listar arquivos
пусть файлы = FileSystem.listDir("./")
```

### 📄 JSON - Trabalhar com JSON

```trest
импорт * как JSON измодуля "std/json"

# Parse
пусть obj = JSON.parse('{"имя": "Иван"}')

# Stringify
пусть строка = JSON.stringify({ имя = "Иван", возраст = 30 })
```

### 📅 Date - Data e Hora

```trest
импорт * как Date измодуля "std/date"

пусть сейчас = Date.now()
пусть отформатировано = Date.format(сейчас, "YYYY-MM-DD")
пусть зона = Date.timezone()
```

### 🗄️ Database - Banco de Dados

```trest
импорт * как DB измодуля "std/database"

# Conectar
пусть db = DB.openDB("myapp.db")

# Query Builder
пусть запрос = DB.createQueryBuilder("users")
    .select("id, name")
    .where("age > 18")
    .limit(10)
```

### 🖥️ GUI - Interface Gráfica

```trest
импорт * как GUI измодуля "std/gui"

# Janela
пусть окно = GUI.createWindow({ title = "Приложение" })

# Botão
пусть кнопка = GUI.createButton("Нажми", функция() {
    печать("Кнопка нажата")
})
```

### ⚡ Async - Assíncrono

```trest
импорт * как Async измодуля "std/async"

# Delay
Async.delay(1000)  # Esperar 1 segundo

# Timers
пусть id = Async.repeatInterval(функция() {
    печать("Каждые 2 секунды")
}, 2000)

Async.clearRepeat(id)
```

### 🔍 RegEx - Expressões Regulares

```trest
импорт * как RegEx измодуля "std/regex"

# Validar email
если (RegEx.тест("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", email)) {
    печать("Email válido")
}

# Substituir texto
пусть novo = RegEx.заменить("\\d+", "Encontrei 123 números", "XXX")
```

### 📁 Path - Manipulação de Caminhos

```trest
импорт * как Path измодуля "std/path"

# Juntar caminhos
пусть caminho = Path.соединить("src", "app", "main.trest")

# Informações do arquivo
печать("Dir:", Path.директория(caminho))
печать("Nome:", Path.базовоеИмя(caminho))
печать("Ext:", Path.расширение(caminho))
```

### ⚙️ Process - Processo e Ambiente

```trest
импорт * как Process измодуля "std/process"

# Variáveis de ambiente
печать("NODE_ENV:", Process.получитьEnv("NODE_ENV"))

# Informações do sistema
печать("Plataforma:", Process.платформа)
печать("Arquitetura:", Process.архитектура)
печать("PID:", Process.pid)
```

---

## 🎯 Exemplos

### Calculadora Simples

```trest
функция калькулятор(a, операция, b) {
    если (операция == "+") {
        вернуть a + b
    } иначе если (операция == "-") {
        вернуть a - b
    } иначе если (операция == "*") {
        вернуть a * b
    } иначе если (операция == "/") {
        вернуть a / b
    }
}

печать(калькулятор(10, "+", 5))  # 15
```

### Trabalhar com Arquivos

```trest
импорт * как FileSystem измодуля "std/filesystem"

если (FileSystem.exists("config.trest")) {
    пусть конфиг = FileSystem.readFile("config.trest")
    печать("Конфиг загружен")
}

FileSystem.writeFile("log.txt", "Приложение запущено")
```

### API HTTP

```trest
импорт * как HTTP измодуля "std/http"

# Cliente
пусть данные = HTTP.GET("https://jsonplaceholder.typicode.com/posts/1")
печать(данные)

# Servidor
пусть сервер = HTTP.createServer()
сервер.get("/", функция(запрос, ответ) {
    ответ.status(200).json({ сообщение = "Привет!" })
})
сервер.listen(3000)
```

---

## 📚 Documentação Adicional

- [**Features**](FEATURES.md) - Funcionalidades completas (NEW!)
- [**Guide**](guide.md) - Guia detalhado
- [**API Reference**](api.md) - Referência da API
- [**Examples**](examples.md) - Mais exemplos
- [**Best Practices**](best-practices.md) - Melhores práticas
- [**CHANGELOG**](CHANGELOG.md) - Histórico de mudanças

---

## 🔧 Comandos CLI

```bash
# Executar arquivo
trest programa.trest

# Versão
trest --version

# Atualizar
trest --update

# Ajuda
trest --help
```

---

## 📝 Versão

**Versão atual:** 2.3.0

**Autor:** PoktWeb  
**Documentação:** https://trest-site.vercel.app  
**NPM:** https://www.npmjs.com/package/treste

---

## 💡 Suporte

Se você tiver dúvidas ou problemas:

1. Verifique a documentação
2. Veja os exemplos em `exemplos/`
3. Crie uma Issue no GitHub

---

**Feliz programação em Trest!** 🎉
