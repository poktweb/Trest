# Referência da API - Trest Language

Referência completa da API da linguagem de programação Trest.

---

## 📦 Módulos da Biblioteca Padrão

### 🔢 Math - Funções Matemáticas

**Importação:**
```trest
импорт * как Math измодуля "std/math"
```

**Funções:**
- `Math.abs(x)` - Valor absoluto
- `Math.max(a, b)` - Máximo
- `Math.min(a, b)` - Mínimo
- `Math.sqrt(x)` - Raiz quadrada
- `Math.pow(base, exp)` - Potência
- `Math.ceil(x)` - Arredondar para cima
- `Math.floor(x)` - Arredondar para baixo
- `Math.round(x)` - Arredondar

**Constantes:**
- `Math.PI` - 3.14159
- `Math.E` - 2.71828

---

### 📝 String - Trabalhar com Strings

**Importação:**
```trest
импорт * как String измодуля "std/string"
```

**Funções:**
- `String.размер(str)` - Tamanho da string
- `String.верхний(str)` - Maiúsculas
- `String.нижний(str)` - Minúsculas
- `String.заменить(str, old, new)` - Substituir
- `String.разделить(str, delimiter)` - Dividir

---

### 📊 Array - Arrays

**Importação:**
```trest
импорт * как Array измодуля "std/array"
```

**Funções:**
- `Array.добавить(arr, item)` - Adicionar elemento
- `Array.удалить(arr, index)` - Remover por índice
- `Array.включает(arr, item)` - Verificar se contém
- `Array.обратить(arr)` - Inverter ordem
- `Array.срез(arr, start, end)` - Fatiar array
- `Array.отсортировать(arr)` - Ordenar

---

### 🌐 HTTP - Cliente e Servidor HTTP

**Importação:**
```trest
импорт * как HTTP измодуля "std/http"
```

**Métodos de requisição:**
- `HTTP.GET(url, options)` - Requisição GET
- `HTTP.POST(url, data, options)` - Requisição POST
- `HTTP.PUT(url, data, options)` - Requisição PUT
- `HTTP.DELETE(url, options)` - Requisição DELETE
- `HTTP.fetch(url, options)` - Fetch API

**Servidor:**
- `HTTP.createServer()` - Criar servidor
- `сервер.get(path, handler)` - Rota GET
- `сервер.post(path, handler)` - Rota POST
- `сервер.listen(port, callback)` - Iniciar servidor

---

### 🔐 Crypto - Criptografia

**Importação:**
```trest
импорт * как Crypto измодуля "std/crypto"
```

**Hash:**
- `Crypto.md5(text)` - Hash MD5
- `Crypto.sha256(text)` - Hash SHA256
- `Crypto.sha512(text)` - Hash SHA512

**Criptografia:**
- `Crypto.encrypt(text, key)` - Criptografia AES
- `Crypto.decrypt(encrypted, key)` - Decriptografia AES
- `Crypto.randomBytes(length)` - Bytes aleatórios

---

### 📁 FileSystem - Sistema de Arquivos

**Importação:**
```trest
импорт * как FileSystem измодуля "std/filesystem"
```

**Operações:**
- `FileSystem.readFile(path)` - Ler arquivo
- `FileSystem.writeFile(path, content)` - Escrever arquivo
- `FileSystem.exists(path)` - Verificar existência
- `FileSystem.deleteFile(path)` - Deletar arquivo
- `FileSystem.listDir(path)` - Listar arquivos
- `FileSystem.createDir(path)` - Criar diretório
- `FileSystem.deleteDir(path)` - Deletar diretório
- `FileSystem.getStats(path)` - Estatísticas do arquivo

---

### 📄 JSON - Processamento JSON

**Importação:**
```trest
импорт * как JSON измодуля "std/json"
```

**Funções:**
- `JSON.parse(str)` - Parse de string JSON
- `JSON.stringify(obj, indent)` - Converter para JSON

---

### 📅 Date - Data e Hora

**Importação:**
```trest
импорт * как Date измодуля "std/date"
```

**Funções:**
- `Date.now()` - Hora atual
- `Date.format(date, format)` - Formatação
- `Date.timezone()` - Fuso horário

---

### 🗄️ Database - Banco de Dados

**Importação:**
```trest
импорт * как DB измодуля "std/database"
```

**Métodos:**
- `DB.openDB(path)` - Abrir banco de dados
- `DB.createQueryBuilder(table)` - Query Builder
- `DB.Model(table)` - Modelo ORM

**Query Builder:**
- `.select(fields)` - Selecionar campos
- `.where(condition)` - Condição WHERE
- `.order(field)` - ORDER BY
- `.limit(n)` - LIMIT
- `.execute()` - Executar

---

### 🖥️ GUI - Interface Gráfica

**Importação:**
```trest
импорт * как GUI измодуля "std/gui"
```

**Componentes:**
- `GUI.createWindow(options)` - Criar janela
- `GUI.createButton(text, onClick)` - Botão
- `GUI.createText(placeholder, onChange)` - Campo de texto
- `GUI.createList(data, onSelect)` - Lista
- `GUI.createTerminal()` - Terminal

---

### ⚡ Async - Assíncrono

**Importação:**
```trest
импорт * как Async измодуля "std/async"
```

**Funções:**
- `Async.delay(ms)` - Atraso
- `Async.createPromise(executor)` - Criar Promise
- `Async.allPromises(promises)` - Promise.all
- `Async.anyPromise(promises)` - Promise.race
- `Async.setTimer(fn, ms)` - setTimeout
- `Async.clearTimer(id)` - clearTimeout
- `Async.repeatInterval(fn, ms)` - setInterval
- `Async.clearRepeat(id)` - clearInterval

---

### 🔍 RegEx - Expressões Regulares

**Importação:**
```trest
импорт * как RegEx измодуля "std/regex"
```

**Funções:**
- `RegEx.создать(pattern, flags)` - Criar padrão regex
- `RegEx.тест(pattern, text, flags)` - Testar padrão
- `RegEx.соответствие(pattern, text, flags)` - Primeira correspondência
- `RegEx.найтиВсе(pattern, text, flags)` - Todas as correspondências
- `RegEx.заменить(pattern, text, replacement, flags)` - Substituir
- `RegEx.разделить(pattern, text, limit)` - Dividir por padrão

---

### 📁 Path - Manipulação de Caminhos

**Importação:**
```trest
импорт * как Path измодуля "std/path"
```

**Funções:**
- `Path.соединить(...segments)` - Juntar segmentos
- `Path.решить(...segments)` - Resolver caminho absoluto
- `Path.директория(path)` - Nome do diretório
- `Path.базовоеИмя(path, ext)` - Nome base do arquivo
- `Path.расширение(path)` - Extensão do arquivo
- `Path.нормализовать(path)` - Normalizar caminho
- `Path.абсолютный(path)` - Verificar se é absoluto
- `Path.относительный(from, to)` - Caminho relativo

---

### ⚙️ Process - Processo e Ambiente

**Importação:**
```trest
импорт * как Process измодуля "std/process"
```

**Funções:**
- `Process.получитьEnv(key)` - Obter variável de ambiente
- `Process.всеEnv()` - Obter todas as variáveis
- `Process.установитьEnv(key, value)` - Definir variável (runtime)
- `Process.изменитьDir(directory)` - Mudar diretório
- `Process.выход(code)` - Encerrar processo

**Propriedades:**
- `Process.платформа` - Plataforma (win32, linux, darwin)
- `Process.архитектура` - Arquitetura (x64, arm64, etc)
- `Process.версия` - Versão do Node.js
- `Process.cwd` - Diretório atual
- `Process.pid` - ID do processo

---

## 🔧 Funções Integradas

### печать(...args)

Exibir valores no console:

```trest
печать("Привет", 42, истина)
```

---

## 📝 Palavras-chave

### Declarações
- `пусть` - variável com escopo de bloco
- `конст` - constante
- `перем` - variável com escopo funcional

### Controle de fluxo
- `если` / `иначе` / `иначе если` - condicionais
- `для` - loop for
- `пока` - loop while
- `прервать` - break
- `продолжить` - continue

### Funções
- `функция` - declaração de função
- `вернуть` - retornar valor

### Tratamento de erros
- `попытаться` - try
- `перехватить` - catch
- `наконец` - finally
- `бросить` - throw

### Módulos
- `импорт` - importar
- `экспорт` - exportar

### Classes
- `класс` - classe
- `расширяет` - extends
- `это` - this
- `супер` - super
- `новый` - new
- `статический` - static

---

## 🔤 Operadores

### Aritméticos
- `+` - adição
- `-` - subtração
- `*` - multiplicação
- `/` - divisão
- `%` - resto

### Comparação
- `==` - igual
- `!=` - diferente
- `<` - menor
- `>` - maior
- `<=` - menor ou igual
- `>=` - maior ou igual

### Lógicos
- `&&` - E (AND)
- `||` - OU (OR)
- `!` - NÃO (NOT)

### Atribuição
- `=` - atribuição
- `+=`, `-=`, `*=`, `/=` - compostos

---

**Versão:** 2.3.0  
**Autor:** PoktWeb
