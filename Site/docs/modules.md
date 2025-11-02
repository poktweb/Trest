# 📚 Módulos Standard Library - Trest Language v2.1

## 🌐 HTTP Module

Cliente e Servidor HTTP completo para comunicação web.

### Import

```trest
импорт * как HTTP измодуля "std/http"
```

### Métodos

#### Cliente HTTP

```trest
# GET Request
пусть resultado = HTTP.GET("https://api.example.com/data")

# POST Request
пусть resultado = HTTP.POST("https://api.example.com/users", { nome = "João" })

# PUT Request
пусть resultado = HTTP.PUT("https://api.example.com/users/1", { nome = "João Silva" })

# DELETE Request
пусть resultado = HTTP.DELETE("https://api.example.com/users/1")
```

#### Servidor HTTP

```trest
# Criar servidor
пусть server = HTTP.создатьСервер()

# Definir rotas
server.получить("/", (req, res) => {
    res.status(200).send("Olá, Mundo!")
})

server.получить("/api/users", (req, res) => {
    res.status(200).json({ users = [] })
})

server.пост("/api/users", (req, res) => {
    пусть newUser = req.body
    # ... processar dados
    res.status(201).json({ success = истина })
})

# Iniciar servidor
server.слушать(8080, () => {
    печать("Servidor rodando em http://localhost:8080")
})
```

#### Fetch API

```trest
пусть response = HTTP.fetch("https://api.example.com/data")
печать(response)
```

---

## 🔐 Crypto Module

Criptografia e hashing seguro.

### Import

```trest
импорт * как Crypto измодуля "std/crypto"
```

### Hash Functions

```trest
пусть texto = "senha123"
пусть md5 = Crypto.md5(texto)
печать(md5)  # "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"

пусть sha256 = Crypto.sha256(texto)
печать(sha256)

пусть sha512 = Crypto.sha512(texto)
печать(sha512)
```

### Bytes Aleatórios

```trest
пусть random = Crypto.случайныеБайты(32)
печать(random)  # "a1b2c3d4e5f6..."
```

### Criptografia AES

```trest
пусть texto = "Mensagem secreta"
пусть chave = "minha_chave_secreta_123456789"

# Criptografar
пусть encrypted = Crypto.зашифровать(texto, chave)
печать("Criptografado:", encrypted)

# Descriptografar
пусть decrypted = Crypto.расшифровать(encrypted, chave)
печать("Descriptografado:", decrypted)
```

---

## 📁 FileSystem Module

Operações completas de I/O em arquivos.

### Import

```trest
импорт * как FileSystem измодуля "std/filesystem"
```

### Verificar Existência

```trest
пусть existe = FileSystem.существует("arquivo.txt")
печать("Existe:", existe)
```

### Ler Arquivos

```trest
пусть conteudo = FileSystem.читаяФайл("dados.txt")
печать(conteudo)
```

### Escrever Arquivos

```trest
FileSystem.писатьФайл("saida.txt", "Conteúdo do arquivo")
печать("Arquivo salvo!")
```

### Deletar Arquivos

```trest
FileSystem.удалитьФайл("arquivo_temp.txt")
печать("Arquivo deletado!")
```

### Listar Diretório

```trest
пусть arquivos = FileSystem.списокДиректорий(".")
для (пусть arquivo из arquivos) {
    печать(arquivo)
}
```

### Estatísticas

```trest
пусть stats = FileSystem.получитьСтат("arquivo.txt")
печать("Tamanho:", stats.size)
печать("É arquivo:", stats.isFile)
печать("É diretório:", stats.isDirectory)
```

---

## 📄 JSON Module

Manipulação de dados JSON.

### Import

```trest
импорт * как JSON измодуля "std/json"
```

### Parse JSON

```trest
пусть jsonStr = '{"nome": "João", "idade": 30}'
пусть obj = JSON.parse(jsonStr)
печать(obj.nome)   # "João"
печать(obj.idade)  # 30
```

### Stringify JSON

```trest
пусть obj = { nome = "Maria", idade = 25 }
пусть jsonStr = JSON.stringify(obj)
печать(jsonStr)  # '{"nome":"Maria","idade":25}'

# Com indentação
пусть formatted = JSON.stringify(obj, 2)
печать(formatted)
```

---

## 📅 Date Module

Manipulação de datas e horários.

### Import

```trest
импорт * как Date измодуля "std/date"
```

### Data Atual

```trest
пусть agora = Date.теперь()
печать("Data atual:", agora)
```

### Formatação

```trest
пусть agora = Date.теперь()
пусть formatted = Date.формат(agora, "YYYY-MM-DD HH:mm:ss")
печать(formatted)  # "2024-11-01 15:30:45"

# Formatos suportados:
# YYYY - Ano
# MM - Mês
# DD - Dia
# HH - Hora
# mm - Minuto
# ss - Segundo
```

### Timezone

```trest
пусть tz = Date.timezone()
печать("Timezone:", tz)  # "America/Sao_Paulo"
```

---

## 🗄️ Database Module

Sistema de banco de dados e ORM.

### Import

```trest
импорт * как DB измодуля "std/database"
```

### Abrir Conexão

```trest
пусть db = DB.открытьБД("app.db")
печать("Banco de dados aberto!")
```

### Query Builder

```trest
пусть query = DB.создательЗапросов("users")
    .выбрать("id, nome, email")
    .где("idade > 18")
    .порядок("nome")
    .лимит(10)

пусть resultados = query.выполнить()
```

### ORM Model

```trest
# Criar model
пусть User = DB.Модель("users")

# Buscar todos
пусть users = User.все()

# Buscar por ID
пусть user = User.найти(1)

# Criar
пусть newUser = User.создать({ nome = "João", email = "joao@email.com" })

# Atualizar
User.обновить(1, { nome = "João Silva" })

# Deletar
User.удалить(1)
```

---

## 🖥️ GUI Module

Interface gráfica e componentes.

### Import

```trest
импорт * как GUI измодуля "std/gui"
```

### Terminal

```trest
пусть terminal = GUI.создатьТерминал()
terminal.очистить()
terminal.печатьНа("Olá", 10, 10)
печать("Largura:", terminal.получитьШирину())
печать("Altura:", terminal.получитьВысота())
```

### Janelas

```trest
пусть окно = GUI.создатьОкно({ title = "Minha App", width = 800, height = 600 })
окно.показать()
```

### Componentes

```trest
# Botão
пусть botao = GUI.создатьКнопку("Clique Aqui", () => {
    печать("Botão clicado!")
})

# Input de Texto
пусть input = GUI.создатьТекст("Digite algo...", (valor) => {
    печать("Valor digitado:", valor)
})

# Lista
пусть dados = ["Item 1", "Item 2", "Item 3"]
пусть lista = GUI.создатьСписок(dados, (item) => {
    печать("Item selecionado:", item)
})
```

---

## ⚡ Async Module

Operações assíncronas e promises.

### Import

```trest
импорт * как Async измодуля "std/async"
```

### Delay/Sleep

```trest
печать("Início")
Async.отложить(2000)  # Aguarda 2 segundos
печать("Fim")
```

### Promises

```trest
# Criar Promise
пусть promise = Async.создатьОбещание((resolve, reject) => {
    если (успех) {
        resolve("Sucesso!")
    } иначе {
        reject("Erro!")
    }
})

# Promise.all
пусть promises = [promise1, promise2, promise3]
пусть results = Async.всеОбещания(promises)

# Promise.race
пусть first = Async.любоеОбещание(promises)
```

### Timers

```trest
# setTimeout
пусть timerId = Async.установитьТаймер(() => {
    печать("Executado após 1 segundo")
}, 1000)

# setInterval
пусть intervalId = Async.повторятьИнтервал(() => {
    печать("A cada 2 segundos")
}, 2000)

# Limpar
Async.очиститьТаймер(timerId)
Async.очиститьПовторение(intervalId)
```

---

## 📦 Módulos Existentes

### Math

```trest
импорт * как Math измодуля "std/math"

Math.sqrt(16)     # 4
Math.abs(-5)      # 5
Math.max(10, 20)  # 20
Math.min(10, 20)  # 10
Math.pow(2, 3)    # 8
Math.ceil(3.2)    # 4
Math.floor(3.8)   # 3
Math.round(3.5)   # 4
```

### String

```trest
импорт * как String измодуля "std/string"

String.размер("Olá")          # 3
String.верхний("olá")         # "OLÁ"
String.нижний("OLÁ")          # "olá"
String.заменить("abc", "a", "x")   # "xbc"
String.разделить("a,b,c", ",")   # ["a", "b", "c"]
```

### Array

```trest
импорт * как Array измодуля "std/array"

пусть arr = [1, 2, 3]
Array.добавить(arr, 4)      # [1, 2, 3, 4]
Array.удалить(arr, 0)       # [2, 3, 4]
Array.включает(arr, 3)      # true
Array.обратить(arr)          # [4, 3, 2]
Array.срез(arr, 0, 2)        # [4, 3]
Array.отсортировать([3, 1, 2]) # [1, 2, 3]
```

---

## 🎯 Exemplos Completos

### Servidor Web Simples

```trest
импорт * как HTTP измодуля "std/http"

пусть app = HTTP.создатьСервер()

app.получить("/", (req, res) => {
    res.send("Bem-vindo ao Trest!")
})

app.слушать(3000)
```

### API REST

```trest
импорт * как HTTP измодуля "std/http"

пусть app = HTTP.создатьСервер()
пусть users = []

app.получить("/users", (req, res) => {
    res.json(users)
})

app.пост("/users", (req, res) => {
    пусть user = req.body
    users.добавить(user)
    res.status(201).json(user)
})

app.слушать(3000)
```

### Autenticação com Hash

```trest
импорт * как Crypto измодуля "std/crypto"

функция registrar(usuario, senha) {
    пусть salt = Crypto.случайныеБайты(16)
    пусть hash = Crypto.sha256(senha + salt)
    # Salvar usuario, hash, salt
    печать("Usuário registrado!")
}

функция verificar(senha_entrada, hash_salvo, salt_salvo) {
    пусть hash_calculado = Crypto.sha256(senha_entrada + salt_salvo)
    вернуть hash_calculado == hash_salvo
}
```

---

**Para mais informações, veja:**
- [README Completo](README.md)
- [Guia de Uso](guide.md)
- [Exemplos Práticos](examples.md)

