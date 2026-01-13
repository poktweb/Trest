# 📚 Documentação Completa - Trest Language v2.5.3

**Linguagem de programação moderna e profissional para Web e Desktop com suporte completo a Cirílico**

---

## 📋 Índice

1. [Introdução](#introdução)
2. [Instalação](#instalação)
3. [Começando](#começando)
4. [Sintaxe da Linguagem](#sintaxe-da-linguagem)
5. [Palavras-chave](#palavras-chave)
6. [Biblioteca Padrão (std)](#biblioteca-padrão-std)
7. [Sistema de Módulos](#sistema-de-módulos)
8. [Tratamento de Erros](#tratamento-de-erros)
9. [Compilação](#compilação)
10. [Exemplos](#exemplos)
11. [Melhores Práticas](#melhores-práticas)
12. [Referência Completa](#referência-completa)
13. [Arquitetura e Funcionamento Interno](#arquitetura-e-funcionamento-interno)
14. [Segurança](#segurança)
15. [Novidades da Versão 2.5.3](#novidades-da-versão-253) (Correções de Segurança e Melhorias)
16. [Novidades da Versão 2.5.1](#novidades-da-versão-251)
17. [Novidades da Versão 2.5.0](#novidades-da-versão-250) (versão anterior)
18. [Histórico de Versões](#histórico-de-versões)

---

## 🎯 Introdução

Trest é uma linguagem de programação moderna que permite programar usando palavras-chave em **cirílico** (alfabeto russo) ou latino, mantendo a mesma sintaxe e funcionalidades.

### 🆎 Características Principais

- ✅ **Suporte Total ao Cirílico** - Palavras-chave em russo nativas
- ✅ **Tipagem Dinâmica** - Tipos inferidos automaticamente
- ✅ **Compilação Universal** - Para Web (JavaScript) e Desktop (.exe)
- ✅ **Biblioteca Padrão Rica** - 15+ módulos prontos para usar
- ✅ **Sistema de Módulos** - Import/Export completo
- ✅ **Execução Inline** - Execute código direto na linha de comando

### 🎯 Por que Trest?

- **Zero barreira linguística** para falantes de russo
- **Mesmo código** compila para Web e Desktop
- **Sintaxe intuitiva** baseada em JavaScript/TypeScript
- **Produtividade** com biblioteca padrão completa

---

## 📦 Instalação

### Instalação Global via npm (Recomendado)

```bash
npm install -g treste
```

Após a instalação, os comandos `trest` e `trestc` estarão disponíveis globalmente:

```bash
trest --version
trestc --help
```

### Instalação Local em Projeto

```bash
npm install treste
```

Use via `npx`:

```bash
npx trest programa.trest
npx trestc programa.trest --mode web
```

### Instalação a partir do Código-fonte

```bash
# Clonar o repositório
# Baixar o código-fonte do projeto
cd trest

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
- **TypeScript**: 5.0+ (apenas para desenvolvimento)

Verifique sua versão:
```bash
node --version  # deve ser >= v18
npm --version   # deve ser >= 9
```

---

## 🚀 Começando

### Seu Primeiro Programa

Crie o arquivo `hello.trest`:

```trest
печать("Привет, Мир!")
```

Execute:

```bash
trest hello.trest
```

**Saída:**
```
Привет, Мир!
```

### Executar Código Inline (sem arquivo)

```bash
trest -e "печать('Olá, Mundo!')"
trest -e "пусть x = 10; печать(x)"
```

### Compilar para Web (JavaScript)

```bash
trestc programa.trest --mode web --output app.js
```

### Compilar para Desktop (.exe)

```bash
trestc programa.trest --mode exe --output app.exe
```

---

## 📝 Sintaxe da Linguagem

### Variáveis e Constantes

```trest
# Variável mutável com 'let' (пусть)
пусть имя = "Иван"
пусть возраст = 25
имя = "Петр"  # ✅ Pode ser alterado

# Variável com 'var' (variavel)
variavel x = 10
x = 20  # ✅ Pode ser alterado

# Constante imutável com 'const' (константа)
константа PI = 3.14159
# PI = 3.14  # ❌ Erro! Constante não pode ser alterada
# PI += 1    # ❌ Erro! Operadores compostos também não funcionam

# Exemplo prático
константа MAX_USERS = 100
пусть currentUsers = 0
currentUsers += 1  # ✅ OK - variável pode ser modificada
# MAX_USERS += 1   # ❌ Erro - constante protegida
```

### Tipos de Dados

```trest
# Números (inteiros e decimais)
пусть число = 42
пусть дробное = 3.14

# Strings (cadeias de texto)
пусть текст = "Привет"
пусть многострочный = "Linha 1
Linha 2"

# Booleanos
пусть правда = истина
пусть ложное = ложь

# Null e Undefined
пусть vazio = нуль
пусть неопределено = неопределен

# Arrays (listas)
пусть список = [1, 2, 3, 4, 5]
пусть смешанный = [1, "текст", истина]

# Objetos (dicionários)
# ⚠️ Nota: Em Trest, objetos usam = em vez de :
пусть человек = {
    имя = "Иван",
    возраст = 30,
    город = "Москва"
}
```

### Operadores

#### Aritméticos
```trest
пусть a = 10 + 5    # 15 (adição)
пусть b = 10 - 5    # 5 (subtração)
пусть c = 10 * 5    # 50 (multiplicação)
пусть d = 10 / 5    # 2 (divisão)
пусть e = 10 % 3    # 1 (resto/módulo)
пусть f = 2 ** 3    # 8 (potência)
```

#### Comparação
```trest
10 == 10   # истина (igual)
10 != 5    # истина (diferente)
10 < 20    # истина (menor)
10 > 5     # истина (maior)
10 <= 10   # истина (menor ou igual)
10 >= 10   # истина (maior ou igual)
```

#### Lógicos
```trest
истина && истина   # истина (E/AND)
истина || ложь     # истина (OU/OR)
!истина            # ложь (NÃO/NOT)
```

#### Atribuição

**Atribuição Simples:**
```trest
пусть x = 10
x = 20  # x agora é 20
```

**Operadores Compostos (Novo em 2.4.6):**
```trest
пусть x = 10
x += 5   # x = x + 5 → 15 (adição composta)
x -= 3   # x = x - 3 → 12 (subtração composta)
x *= 2   # x = x * 2 → 24 (multiplicação composta)
x /= 4   # x = x / 4 → 6 (divisão composta)
x %= 4   # x = x % 4 → 2 (módulo composto)

# Exemplo prático
пусть contador = 0
contador += 1  # Incrementar contador
contador += 1
печать(contador)  # 2

# Acumulador em loop
пусть сумма = 0
пусть числа = [10, 20, 30]
для (пусть число из числа) {
    сумма += число  # Mais conciso que: сумма = сумма + число
}
печать(сумма)  # 60
```

**⚠️ Nota:** Constantes (`константа`) não podem ser modificadas com operadores compostos!

### Funções

#### Funções Nomeadas

```trest
# Declaração de função
функция приветствие(имя) {
    вернуть "Привет, " + имя
}

# Chamada de função
печать(приветствие("Иван"))  # "Привет, Иван"

# Função com múltiplos parâmetros
функция сложить(a, b, c) {
    вернуть a + b + c
}

# Função sem retorno (procedimento)
функция показатьИнформацию(имя, возраст) {
    печать("Имя: " + имя)
    печать("Возраст: " + возраст)
}
```

#### Funções Anônimas (Novo em 2.4.6)

```trest
# Função anônima atribuída a variável
пусть dobrar = функция(x) {
    вернуть x * 2
}

печать( dobrar(5) )  # 10

# Função anônima como argumento
функция aplicarОперацию(число, операция) {
    вернуть операция(число)
}

пусть resultado = aplicarОперацию(5, функция(x) {
    вернуть x * x  # Quadrado
})
печать(resultado)  # 25
```

### Condicionais

#### If/Else

```trest
если (возраст >= 18) {
    печать("Совершеннолетний")
} иначе если (возраст >= 13) {
    печать("Подросток")
} иначе {
    печать("Ребенок")
}
```

#### Operador Ternário

```trest
пусть result = возраст >= 18 ? "Взрослый" : "Ребенок"
печать(result)
```

#### Switch/Case

```trest
переключатель (день) {
    случай 1:
        печать("Понедельник")
        прервать
    случай 2:
        печать("Вторник")
        прервать
    случай 3:
    случай 4:
    случай 5:
        печать("Рабочий день")
        прервать
    поумолчанию:
        печать("Выходной")
}
```

### Loops

#### While (Enquanto)

```trest
пусть i = 0
пока (i < 10) {
    печать(i)
    i = i + 1
}
```

#### For (Para)

**For Clássico:**
```trest
# For tradicional com inicialização, condição e incremento
для (пусть i = 0; i < 10; i = i + 1) {
    печать(i)
}
```

**For...of - Iterar sobre Arrays (Novo em 2.4.6):**
```trest
# Iterar sobre valores de um array
пусть числа = [1, 2, 3, 4, 5]
для (пусть число из числа) {
    печать(число)
}
# Saída: 1, 2, 3, 4, 5

# Exemplo prático: calcular soma
пусть сумма = 0
пусть valores = [10, 20, 30, 40]
для (пусть значение из значения) {
    сумма += значение  # Usando operador composto
}
печать(сумма)  # 100
```

**For...in - Iterar sobre Objetos (Novo em 2.4.6):**
```trest
# Iterar sobre chaves de um objeto
# ⚠️ Nota: Objetos em Trest usam = em vez de :
пусть человек = { имя = "Иван", возраст = 30, город = "Москва" }
для (пусть ключ в человек) {
    печать(ключ + ": " + человек[ключ])
}
# Saída:
# имя: Иван
# возраст: 30
# город: Москва
```

#### Break e Continue

```trest
# Break - sair do loop
для (пусть i = 0; i < 10; i = i + 1) {
    если (i == 5) {
        прервать  # sai do loop
    }
    печать(i)
}

# Continue - pular para próxima iteração
для (пусть i = 0; i < 10; i = i + 1) {
    если (i % 2 == 0) {
        продолжить  # pula números pares
    }
    печать(i)  # imprime apenas ímpares
}
```

### Arrays

```trest
пусть числа = [1, 2, 3, 4, 5]

# Acessar elementos
печать(числа[0])  # 1 (primeiro elemento)
печать(числа[4])  # 5 (último elemento)

# Modificar elementos
числа[0] = 10
печать(числа)  # [10, 2, 3, 4, 5]

# Adicionar elementos
числа[5] = 6
# ou usando biblioteca padrão (ver seção Array)

# Iterar sobre array
для (пусть число из числа) {
    печать(число)
}
```

### Objetos

```trest
пусть человек = {
    имя: "Иван",
    возраст: 30,
    город: "Москва"
}

# Acessar propriedades
печать(человек.имя)           # "Иван"
печать(человек["возраст"])    # 30

# Modificar propriedades
человек.возраст = 31

# Adicionar propriedades
человек.страна = "Россия"

# Remover propriedades
человек.город = нуль

# Iterar sobre propriedades
для (пусть ключ в человек) {
    печать(ключ + ": " + человек[ключ])
}
```

### Classes e Orientação a Objetos (Novo em 2.4.6)

Trest agora suporta Programação Orientada a Objetos completa com classes, construtores, métodos, herança e instanciação.

#### Declaração Básica de Classe

```trest
# Declaração de classe
класс Человек {
    функция конструктор(имя, возраст) {
        это.имя = имя
        это.возраст = возраст
    }
    
    функция представиться() {
        печать("Я " + это.имя + ", мне " + это.возраст + " лет")
    }
    
    функция праздноватьДеньРождения() {
        это.возраст += 1  # Usando operador composto
        печать("С Днем Рождения! Теперь мне " + это.возраст + " лет")
    }
}

# Criar instância com 'новый'
пусть иван = новый Человек("Иван", 30)
иван.представиться()  # "Я Иван, мне 30 лет"
иван.праздноватьДеньРождения()  # "С Днем Рождения! Теперь мне 31 лет"
```

#### Herança de Classes

```trest
# Classe base
класс Транспорт {
    функция конструктор(марка, год) {
        это.марка = марка
        это.год = год
    }
    
    функция завести() {
        печать(это.марка + " заведен")
    }
}

# Classe derivada usando 'расширяет'
класс Студент расширяет Человек {
    функция конструктор(имя, возраст, группа) {
        это.имя = имя
        это.возраст = возраст
        это.группа = группа
    }
    
    функция учиться() {
        печать(это.имя + " учится в группе " + это.группа)
    }
}

пусть студент = новый Студент("Мария", 20, "ИТ-101")
студент.представиться()  # "Я Мария, мне 20 лет"
студент.учиться()        # "Мария учится в группе ИТ-101"
```

#### Exemplo Avançado: Sistema de Gerenciamento

```trest
# Sistema completo de gerenciamento de produtos
класс Продукт {
    функция конструктор(название, цена, количество) {
        это.название = название
        это.цена = цена
        это.количество = количество
    }
    
    функция получитьСтоимость() {
        вернуть это.цена * это.количество
    }
    
    функция продать(сколько) {
        если (сколько <= это.количество) {
            это.количество -= сколько  # Operador composto
            вернуть истина
        }
        вернуть ложь
    }
}

# Usar a classe
пусть товар = новый Продукт("Ноутбук", 50000, 10)
печать(товар.получитьСтоимость())  # 500000
товар.продать(3)
печать(товар.количество)  # 7
```

---

## 🔤 Palavras-chave

### Declarações de Variáveis

| Trest (Cirílico) | Latim | Descrição |
|-----------------|-------|-----------|
| `пусть` | let | Variável com escopo de bloco |
| `константа` | const | Constante (não pode ser reatribuída) |
| `variavel` | var | Variável com escopo funcional |

### Controle de Fluxo

| Trest (Cirílico) | Latim | Descrição |
|-----------------|-------|-----------|
| `если` | if | Condicional |
| `иначе` | else | Caso contrário |
| `иначе если` | else if | Condicional adicional |
| `для` | for | Loop for |
| `пока` | while | Loop while |
| `прервать` | break | Sair do loop |
| `продолжить` | continue | Pular iteração |
| `переключатель` | switch | Switch case |
| `случай` | case | Caso no switch |
| `поумолчанию` | default | Caso padrão |

### Funções

| Trest (Cirílico) | Latim | Descrição |
|-----------------|-------|-----------|
| `функция` | function | Declarar função |
| `вернуть` | return | Retornar valor |

### Módulos

| Trest (Cirílico) | Latim | Descrição |
|-----------------|-------|-----------|
| `импорт` | import | Importar módulo |
| `экспорт` | export | Exportar função/variável |
| `измодуля` | from | Especificar origem do import (módulos Trest) |
| `изpkg` | fromPkg | Especificar origem do import (pacotes NPM) ✅ Novo em 2.5.2 |
| `асинхронный` | async | Função assíncrona ✅ Novo em 2.5.2 |
| `ожидать` | await, aguardar, wait | Aguardar Promise ✅ Novo em 2.5.2 |

### Tratamento de Erros

| Trest (Cirílico) | Latim | Descrição |
|-----------------|-------|-----------|
| `попытаться` | try | Tentar executar código |
| `перехватить` | catch | Capturar erro |
| `наконец` | finally | Executar sempre |
| `бросить` | throw | Lançar erro |

### Classes

| Trest (Cirílico) | Latim | Descrição |
|-----------------|-------|-----------|
| `класс` | class | Declarar classe |
| `расширяет` | extends | Herança |
| `это` | this | Referência ao objeto atual |
| `супер` | super | Referência à classe pai |
| `новый` | new | Criar instância |

### Valores e Operadores

| Trest (Cirílico) | Latim | Descrição |
|-----------------|-------|-----------|
| `истина` | true | Valor booleano verdadeiro |
| `ложь` | false | Valor booleano falso |
| `нуль` | null | Valor nulo |
| `неопределен` | undefined | Valor indefinido |

### Funções Integradas

| Trest (Cirílico) | Latim | Descrição |
|-----------------|-------|-----------|
| `печать(...)` | print/console.log | Exibir valores no console |

---

## 📚 Biblioteca Padrão (std)

Trest inclui uma biblioteca padrão rica com **18 módulos** prontos para usar. Todos os módulos estão em `std/` e podem ser importados usando `импорт`.

**Módulos Disponíveis:**
- Math, String, Array, HTTP, Crypto, FileSystem, JSON, Date, **Database** (SQLite/MySQL/PostgreSQL Real - 2.5.2), Async, RegEx, Path, Process, IO, GUI, **DOM** (2.5.2), **Style** (2.5.2), **Test** (2.5.2)

**✅ Objetos Globais JavaScript Disponíveis (✅ Novo em 2.5.2):**
- `Array` - `Array.isArray()`, `Array.from()`, `Array.of()`
- `Object` - `Object.keys()`, `Object.values()`, `Object.entries()`, `Object.assign()`
- `typeof()` - Função para verificar tipo de valores (retorna 'string', 'number', 'function', 'array', 'null', etc.)
- `null` / `нуль` - Valor null
- `undefined` / `неопределен` - Valor undefined

### 🔢 Math - Funções Matemáticas

**Importação:**
```trest
импорт * как Math измодуля "std/math"
```

**Funções Disponíveis:**
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
печать(Math.pow(2, 3))     # 8
```

---

### 📝 String - Manipulação de Strings

**Importação:**
```trest
импорт * как String измодуля "std/string"
```

**Funções Disponíveis:**
- `String.размер(str)` - Tamanho da string
- `String.верхний(str)` - Converter para maiúsculas
- `String.нижний(str)` - Converter para minúsculas
- `String.заменить(str, old, new)` - Substituir substring
- `String.разделить(str, delimiter)` - Dividir string em array

**Exemplo:**
```trest
импорт * как String измодуля "std/string"

пусть текст = "Привет Мир"
печать(String.размер(текст))          # 11
печать(String.верхний(текст))        # "ПРИВЕТ МИР"
печать(String.нижний(текст))         # "привет мир"
печать(String.заменить(текст, "Мир", "Trest"))  # "Привет Trest"
печать(String.разделить(текст, " "))  # ["Привет", "Мир"]
```

---

### 📊 Array - Manipulação de Arrays

**Importação:**
```trest
импорт * как Array измодуля "std/array"
```

**Funções Disponíveis:**
- `Array.длина(arr)` - Tamanho do array
- `Array.добавить(arr, item)` - Adicionar elemento ao final
- `Array.удалить(arr, index)` - Remover elemento por índice
- `Array.включает(arr, item)` - Verificar se contém elemento
- `Array.обратить(arr)` - Inverter ordem do array
- `Array.срез(arr, start, end)` - Fatiar array (slice)
- `Array.отсортировать(arr)` - Ordenar array

**Exemplo:**
```trest
импорт * как Array измодуля "std/array"

пусть числа = [3, 1, 4, 1, 5]
печать(Array.длина(числа))           # 5

Array.добавить(числа, 9)             # [3, 1, 4, 1, 5, 9]
печать(Array.включает(числа, 4))     # истина

пусть удаленный = Array.удалить(числа, 0)  # remove primeiro
печать(Array.обратить(числа))        # [9, 5, 1, 4, 1]

пусть срез = Array.срез(числа, 1, 3)  # [5, 1]
печать(Array.отсортировать(числа))    # [1, 1, 4, 5, 9]
```

---

### 🌐 HTTP - Cliente e Servidor HTTP

**Importação:**
```trest
импорт * как HTTP измодуля "std/http"
```

**Cliente HTTP (Requisições):**
- `HTTP.GET(url, options)` - Requisição GET
- `HTTP.POST(url, data, options)` - Requisição POST
- `HTTP.PUT(url, data, options)` - Requisição PUT
- `HTTP.DELETE(url, options)` - Requisição DELETE
- `HTTP.fetch(url, options)` - Fetch API completa

**Servidor HTTP (Aprimorado em 2.4.8):**
- `HTTP.создатьСервер()` - Criar servidor HTTP
  - Métodos: `listen(port, callback)`, `get(path, handler)`, `post(path, handler)`, `put(path, handler)`, `delete(path, handler)`, `use(path, handler)` (novo)
  - `use()` - Rotas wildcard/catch-all que aceitam qualquer método HTTP

**Exemplo Cliente:**
```trest
импорт * как HTTP измодуля "std/http"

# GET request
пусть resposta = HTTP.GET("https://api.example.com/data")
печать(resposta.dados)

# POST request
# ⚠️ Nota: Objetos em Trest usam = em vez de :
пусть data = { nome = "Иван", idade = 30 }
пусть result = HTTP.POST("https://api.example.com/users", data)
печать(result.status)  # 200
```

**Exemplo Servidor Básico (Atualizado em 2.4.8):**
```trest
импорт * как HTTP измодуля "std/http"

пусть servidor = HTTP.создатьСервер()

servidor.get("/", функция(запрос, ответ) {
    ответ.status(200)
    ответ.send("<h1>Olá do Trest!</h1>")
})

servidor.listen(3000, функция() {
    печать("✅ Servidor iniciado na porta 3000")
})
```

**Objeto Request (Aprimorado em 2.4.8):**
O objeto `запрос` agora inclui:
- `запрос.url` - URL completa
- `запрос.pathname` - Caminho sem query string
- `запрос.query` - Objeto com query parameters parseados
- `запрос.method` - Método HTTP (GET, POST, etc.)
- `запрос.headers` - Headers da requisição
- `запрос.body` - Corpo da requisição (parseado automaticamente se JSON)
- `запрос.ip` - **Novo** - Endereço IP do cliente

**Objeto Response (Aprimorado em 2.4.8):**
O objeto `ответ` agora inclui:
- `ответ.status(code)` - Definir status HTTP
- `ответ.send(data)` - Enviar resposta (HTML ou JSON)
- `ответ.json(data)` - Enviar JSON formatado (indentado)
- `ответ.header(name, value)` - **Novo** - Definir header customizado

**Exemplo Servidor Completo com Múltiplas Rotas:**
```trest
импорт * как HTTP измодуля "std/http"

пусть servidor = HTTP.создатьСервер()

# Rota principal
servidor.get("/", функция(запрос, ответ) {
    ответ.send("<h1>Bem-vindo ao Trest!</h1>")
})

# API JSON
servidor.get("/api/status", функция(запрос, ответ) {
    пусть status = { servidor = "Trest", versao = "2.4.7", online = истина }
    ответ.json(status)
})

# Rota POST
servidor.post("/api/users", функция(запрос, ответ) {
    печать("Novo usuário: " + запрос.body)
    # Body é parseado automaticamente se for JSON
    если (typeof запрос.body == "object") {
        печать("Nome: " + запрос.body.nome)
    }
    ответ.json({ sucesso = истина })
})

# Rota com wildcard (catch-all) - Novo em 2.4.8
servidor.use("*", функция(запрос, ответ) {
    # Captura qualquer rota não encontrada
    ответ.status(404)
    ответ.json({
        erro = истина,
        mensagem = "Rota não encontrada",
        metodo = запрос.method,
        caminho = запрос.pathname
    })
})

# Iniciar servidor
servidor.listen(3000, функция() {
    печать("🌐 Servidor iniciado em http://localhost:3000")
})
```

**⚠️ Nota Importante sobre Objetos:**
Em Trest, objetos literais usam `=` (atribuição) em vez de `:` (dois pontos):
```trest
# ✅ Correto (sintaxe Trest)
пусть obj = { nome = "João", idade = 30 }

# ❌ Incorreto (sintaxe JavaScript)
пусть obj = { nome: "João", idade: 30 }
```

**Query Parameters (Novo em 2.4.8):**
O objeto `запрос` agora inclui propriedades para trabalhar com query parameters:
```trest
servidor.get("/rota", функция(запрос, ответ) {
    # URL completa
    печать(запрос.url)  # "/rota?param1=valor1&param2=valor2"
    
    # Apenas o caminho (sem query string)
    печать(запрос.pathname)  # "/rota"
    
    # Objeto com query parameters parseados
    печать(запрос.query)  # { param1 = "valor1", param2 = "valor2" }
    
    # Acessar parâmetro específico
    пусть valor = запрос.query["param1"]  # "valor1"
})
```

---

### 🔐 Crypto - Criptografia e Segurança

**Importação:**
```trest
импорт * как Crypto измодуля "std/crypto"
```

**Funções de Hash:**
- `Crypto.md5(text)` - Hash MD5 (128-bit)
- `Crypto.sha256(text)` - Hash SHA256 (256-bit)
- `Crypto.sha512(text)` - Hash SHA512 (512-bit)

**Criptografia:**
- `Crypto.encrypt(text, key)` - Criptografar AES-256
- `Crypto.decrypt(encrypted, key)` - Descriptografar AES-256
- `Crypto.randomBytes(size)` - Gerar bytes aleatórios

**Exemplo:**
```trest
импорт * как Crypto измодуля "std/crypto"

# Hash de senha
пусть senhaHash = Crypto.sha256("minhaSenha")
печать(senhaHash)

# Criptografia
пусть chave = "minhaChave123"
пусть textoCripto = Crypto.encrypt("dados sensíveis", chave)
печать(textoCripto)

пусть textoOriginal = Crypto.decrypt(textoCripto, chave)
печать(textoOriginal)  # "dados sensíveis"
```

---

### 💾 FileSystem - Sistema de Arquivos

**Importação:**
```trest
импорт * как FileSystem измодуля "std/filesystem"
```

**Funções Disponíveis:**
- `FileSystem.readFile(path)` - Ler arquivo
- `FileSystem.writeFile(path, content)` - Escrever arquivo
- `FileSystem.exists(path)` - Verificar se arquivo existe
- `FileSystem.deleteFile(path)` - Deletar arquivo
- `FileSystem.listDir(path)` - Listar diretório
- `FileSystem.createDir(path)` - Criar diretório
- `FileSystem.deleteDir(path)` - Deletar diretório
- `FileSystem.getStats(path)` - Obter estatísticas do arquivo

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
для (пусть arquivo из arquivos) {
    печать(arquivo)
}

# Criar diretório
FileSystem.createDir("novoDiretorio")

# Estatísticas
пусть stats = FileSystem.getStats("arquivo.txt")
печать("Tamanho: " + stats.size + " bytes")
```

---

### 📄 JSON - Manipulação de JSON

**Importação:**
```trest
импорт * как JSON измодуля "std/json"
```

**Funções Disponíveis:**
- `JSON.parse(str)` - Parse JSON string para objeto
- `JSON.stringify(obj, indent)` - Converter objeto para JSON string

**Exemplo:**
```trest
импорт * как JSON измодуля "std/json"

# Parse JSON
пусть jsonStr = '{"nome": "Иван", "idade": 30}'
пусть obj = JSON.parse(jsonStr)
печать(obj.nome)   # "Иван"
печать(obj.idade)  # 30

# Stringify
пусть meuObj = { nome: "Мария", lang: "Trest" }
пусть json = JSON.stringify(meuObj)
печать(json)  # '{"nome":"Мария","lang":"Trest"}'
```

---

### 📅 Date - Datas e Tempo

**Importação:**
```trest
импорт * как Date измодуля "std/date"
```

**Funções Disponíveis:**
- `Date.теперь()` - Obter objeto Date atual
- `Date.timestamp()` - **Novo em 2.4.8** - Timestamp atual em milissegundos (número)
- `Date.формат(date, formatStr)` - Formatar data
- `Date.timezone()` - Obter timezone atual

**Exemplo:**
```trest
импорт * как Date измодуля "std/date"

# Obter timestamp (número)
пусть timestamp = Date.timestamp()
печать(timestamp)  # 1234567890123 (número em milissegundos)

# Obter objeto Date
пусть agora = Date.теперь()

# Formatar data
пусть formatado = Date.формат(agora, "YYYY-MM-DD HH:mm:ss")
печать(formatado)  # "2025-01-08 15:30:45"

# Timezone
пусть tz = Date.timezone()
печать(tz)  # "America/Sao_Paulo"
```

**⚠️ Nota Importante:**
- `Date.timestamp()` retorna um **número** (milissegundos desde epoch)
- `Date.теперь()` retorna um **objeto Date**
- Use `Date.timestamp()` quando precisar apenas do número (mais eficiente)

---

### 🗄️ Database - Banco de Dados (✅ Implementação Real em 2.5.2)

**Importação:**
```trest
импорт * как DB измодуля "std/database"
```

**✅ Suporte Real para Múltiplos Bancos:**
- ✅ **SQLite** - Implementado com `better-sqlite3` (100% funcional e testado)
- ✅ **MySQL** - Implementado com `mysql2` (pronto para uso em produção)
- ✅ **PostgreSQL** - Implementado com `pg` (pronto para uso em produção)

**Funções Disponíveis:**
- `DB.открытьБД(connection)` / `DB.openDB(connection)` - Abrir conexão (detecta automaticamente o tipo de banco)
- `DB.открытьSQLite(path)` / `DB.openSQLite(path)` - Abrir conexão SQLite específica
- `DB.открытьMySQL(config)` / `DB.openMySQL(config)` - Abrir conexão MySQL
- `DB.открытьPostgreSQL(config)` / `DB.openPostgreSQL(config)` - Abrir conexão PostgreSQL
- `DB.создательЗапросов(table)` / `DB.createQueryBuilder(table)` - Criar query builder
- `DB.Модель(table)` / `DB.Model(table)` - Criar modelo ORM básico

**Métodos do Objeto de Conexão:**
- `db.execute(query, params)` - Executar query com prepared statements
- `db.query(query, params)` - Consultar com prepared statements
- `db.transaction(callback)` - Executar transação atômica
- `db.close()` - Fechar conexão

**Prepared Statements (✅ Implementado em Todos os Bancos):**
Todos os bancos usam **prepared statements nativos** dos drivers, garantindo segurança total contra SQL Injection. Os métodos `execute()` e `query()` aceitam um segundo parâmetro opcional `params` (array) que usa prepared statements nativos.

---

#### 📦 SQLite (Recomendado para Desenvolvimento)

**Status:** ✅ **100% Funcional e Testado**

**Uso:**
```trest
импорт * как DB измодуля "std/database"

# Abrir conexão SQLite (cria arquivo .db automaticamente)
пусть db = DB.открытьБД("dados.db")
# ou
пусть db = DB.открытьSQLite("dados.db")

# Criar tabela
db.execute("CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE,
    idade INTEGER
)")

# Inserir com prepared statements
пусть resultado = db.execute("INSERT INTO usuarios (nome, email, idade) VALUES (?, ?, ?)", 
    ["João", "joao@example.com", 30])
печать("ID inserido: " + resultado.lastInsertRowid)

# Consultar
пусть usuarios = db.query("SELECT * FROM usuarios WHERE idade > ?", [18])
для (пусть i = 0; i < usuarios.length; i++) {
    печать(usuarios[i].nome + " - " + usuarios[i].email)
}

# Atualizar
пусть updateResult = db.execute("UPDATE usuarios SET idade = ? WHERE nome = ?", [31, "João"])
печать("Registros atualizados: " + updateResult.changes)

# Transação
db.transaction(функция() {
    db.execute("INSERT INTO usuarios (nome, email) VALUES (?, ?)", ["Maria", "maria@example.com"])
    db.execute("INSERT INTO usuarios (nome, email) VALUES (?, ?)", ["Pedro", "pedro@example.com"])
})

# Fechar
db.close()
```

**Características:**
- ✅ Banco de dados real (arquivo `.db`)
- ✅ Prepared statements nativos
- ✅ Transações atômicas
- ✅ Sem necessidade de servidor
- ✅ Ideal para desenvolvimento e produção pequena/média

---

#### 🐬 MySQL (Produção)

**Status:** ✅ **Implementado e Pronto para Uso**

**Formas de Conexão:**

**Opção 1: Connection String**
```trest
импорт * как DB измодуля "std/database"

пусть db = DB.открытьБД("mysql://user:password@localhost:3306/database")
```

**Opção 2: Objeto de Configuração**
```trest
пусть db = DB.открытьMySQL({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "mydb"
})
```

**Exemplo Completo:**
```trest
импорт * как DB измодуля "std/database"

пусть db = DB.открытьБД("mysql://root:password@localhost:3306/mydb")

# Criar tabela
db.execute("CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2),
    estoque INT DEFAULT 0
) ENGINE=InnoDB")

# Inserir
пусть resultado = db.execute("INSERT INTO produtos (nome, preco) VALUES (?, ?)", 
    ["Notebook", 2500.00])
печать("ID inserido: " + resultado.insertId)

# Consultar
пусть produtos = db.query("SELECT * FROM produtos WHERE preco > ?", [1000])

# Transação
db.transaction(функция(connection) {
    db.execute("UPDATE produtos SET estoque = estoque - ? WHERE id = ?", [1, 1])
    db.execute("INSERT INTO vendas (produto_id, quantidade) VALUES (?, ?)", [1, 1])
})

db.close()
```

**Características:**
- ✅ Pool de conexões automático (10 conexões)
- ✅ Prepared statements nativos
- ✅ Transações com commit/rollback
- ✅ Suporte a todas as funcionalidades MySQL

**Requisitos:**
- Servidor MySQL rodando
- Credenciais de acesso
- Banco de dados criado

---

#### 🐘 PostgreSQL (Produção)

**Status:** ✅ **Implementado e Pronto para Uso**

**Formas de Conexão:**

**Opção 1: Connection String**
```trest
импорт * как DB измодуля "std/database"

пусть db = DB.открытьБД("postgresql://user:password@localhost:5432/database")
```

**Opção 2: Objeto de Configuração**
```trest
пусть db = DB.открытьPostgreSQL({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "password",
    database: "mydb",
    ssl: false
})
```

**Exemplo Completo:**
```trest
импорт * как DB измодуля "std/database"

пусть db = DB.открытьБД("postgresql://postgres:password@localhost:5432/mydb")

# Criar tabela com tipos PostgreSQL
db.execute("CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    dados JSONB,
    tags TEXT[],
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)")

# Inserir com RETURNING
пусть resultado = db.execute("INSERT INTO usuarios (nome, email) VALUES (?, ?) RETURNING id", 
    ["João", "joao@example.com"])

# Consultar
пусть usuarios = db.query("SELECT * FROM usuarios WHERE nome = ?", ["João"])

# Transação
db.transaction(функция(client) {
    db.execute("UPDATE usuarios SET nome = ? WHERE id = ?", ["João Silva", 1])
    db.execute("INSERT INTO usuarios (nome, email) VALUES (?, ?)", ["Maria", "maria@example.com"])
})

db.close()
```

**Características:**
- ✅ Pool de conexões automático (20 conexões)
- ✅ Prepared statements nativos
- ✅ Transações com BEGIN/COMMIT/ROLLBACK
- ✅ Suporte a tipos PostgreSQL (SERIAL, JSONB, ARRAY, UUID)

**Requisitos:**
- Servidor PostgreSQL rodando
- Credenciais de acesso
- Banco de dados criado

---

#### 🔒 Segurança: Prepared Statements

**Status:** ✅ **Implementado em Todos os Bancos**

Todos os três bancos de dados usam **prepared statements nativos** dos drivers, garantindo:
- ✅ Prevenção total de SQL Injection
- ✅ Escape automático de valores
- ✅ Performance otimizada
- ✅ Suporte a todos os tipos de dados

**Exemplo de Segurança:**
```trest
# Tentativa de SQL Injection será bloqueada automaticamente
пусть nomeMalicioso = "teste' OR '1'='1"
пусть emailMalicioso = "admin@test.com'; DROP TABLE users; --"

# Com prepared statements, isso é 100% seguro
db.execute("INSERT INTO users (name, email) VALUES (?, ?)", 
    [nomeMalicioso, emailMalicioso])
# Os drivers escapam automaticamente, prevenindo SQL Injection
```

---

#### 🛠️ Query Builder

```trest
импорт * как DB измодуля "std/database"

пусть builder = DB.создательЗапросов("users")
пусть resultados = builder
    .select("name, email")
    .where("age > 18")
    .order("name")
    .limit(10)
    .execute()
```

---

#### 📚 ORM Model

```trest
импорт * как DB измодуля "std/database"

пусть User = DB.Модель("users")

# Operações CRUD
пусть user = User.find(1)
пусть todos = User.all()
пусть novo = User.create({name: "João", email: "joao@example.com"})
User.update(1, {name: "João Silva"})
User.delete(1)
```

---

#### ⚠️ Importante

- ✅ **SQLite**: Funciona imediatamente, sem configuração adicional
- ⚠️ **MySQL/PostgreSQL**: Requer servidor rodando e credenciais válidas
- ✅ **Prepared Statements**: Sempre use quando houver dados do usuário
- ✅ **Transações**: Use para operações que devem ser atômicas
- ✅ **Fechamento**: Sempre feche conexões quando não precisar mais
- ✅ **Detecção Automática**: `DB.открытьБД()` detecta automaticamente o tipo de banco pela connection string

---

### ⚡ Async - Programação Assíncrona

**Importação:**
```trest
импорт * как Async измодуля "std/async"
```

**Funções Disponíveis:**
- `Async.delay(ms)` - Delay/Sleep (milissegundos)
- `Async.createPromise(fn)` - Criar Promise
- `Async.allPromises(promises)` - Promise.all
- `Async.anyPromise(promises)` - Promise.race
- `Async.setTimer(fn, ms)` - setTimeout
- `Async.clearTimer(id)` - clearTimeout
- `Async.repeatInterval(fn, ms)` - setInterval
- `Async.clearRepeat(id)` - clearInterval

**Exemplo:**
```trest
импорт * как Async измодуля "std/async"

# Aguardar 1 segundo
Async.delay(1000)
печать("Passou 1 segundo")

# Promise
пусть promessa = Async.createPromise(функция(resolve, reject) {
    если (успех) {
        resolve(данные)
    } иначе {
        reject(ошибка)
    }
})

# Timer
пусть timerId = Async.setTimer(функция() {
    печать("Executado após 2 segundos")
}, 2000)

# Interval
пусть intervalId = Async.repeatInterval(функция() {
    печать("Executado a cada 1 segundo")
}, 1000)
```

---

### 🔍 RegEx - Expressões Regulares

**Importação:**
```trest
импорт * как RegEx измодуля "std/regex"
```

**Funções Disponíveis:**
- `RegEx.create(pattern, flags)` - Criar padrão regex
- `RegEx.test(pattern, text, flags)` - Testar padrão
- `RegEx.match(pattern, text, flags)` - Encontrar primeira correspondência
- `RegEx.findAll(pattern, text, flags)` - Encontrar todas as correspondências
- `RegEx.replace(pattern, text, replacement, flags)` - Substituir
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
печать(numeros)  # ["100", "50"]

# Substituir
пусть novoTexto = RegEx.replace("\\d+", "3 gatos", "4")
печать(novoTexto)  # "4 gatos"

# Dividir
пусть partes = RegEx.split("\\s+", "a   b    c")
печать(части)  # ["a", "b", "c"]
```

---

### 📁 Path - Manipulação de Caminhos

**Importação:**
```trest
импорт * как Path измодуля "std/path"
```

**Funções Disponíveis:**
- `Path.join(...segments)` - Juntar segmentos de caminho
- `Path.resolve(...segments)` - Resolver caminho absoluto
- `Path.dirname(path)` - Obter diretório pai
- `Path.basename(path, ext)` - Obter nome base do arquivo
- `Path.extname(path)` - Obter extensão do arquivo
- `Path.normalize(path)` - Normalizar caminho
- `Path.isAbsolute(path)` - Verificar se é caminho absoluto
- `Path.relative(from, to)` - Obter caminho relativo

**Propriedades:**
- `Path.cwd` - Diretório atual de trabalho

**Exemplo:**
```trest
импорт * как Path измодуля "std/path"

пусть caminho = Path.join("src", "utils", "helper.js")
печать(caminho)  # "src/utils/helper.js"

пусть nome = Path.basename("/usr/bin/file.js")    # "file.js"
пусть ext = Path.extname("file.js")                # ".js"
пусть dir = Path.dirname("/usr/bin/file.js")       # "/usr/bin"

пусть absoluto = Path.resolve("src", "app.trest")
печать(Path.isAbsolute(абсолютный))  # истина

пусть relativo = Path.relative("/a", "/a/b/c.js")  # "b/c.js"
печать(Path.cwd)  # "/current/directory"
```

---

### ⚙️ Process - Variáveis de Ambiente e Sistema

**Importação:**
```trest
импорт * как Process измодуля "std/process"
```

**Funções Disponíveis:**
- `Process.getEnv(name)` - Obter variável de ambiente
- `Process.getAllEnv()` - Obter todas as variáveis de ambiente
- `Process.setEnv(name, value)` - Definir variável de ambiente
- `Process.chdir(path)` - Mudar diretório de trabalho
- `Process.exit(code)` - Sair do processo

**Propriedades:**
- `Process.platform` - Plataforma (win32, linux, darwin)
- `Process.arch` - Arquitetura (x64, arm64, etc)
- `Process.version` - Versão do Node.js
- `Process.cwd` - Diretório de trabalho atual
- `Process.pid` - ID do processo

**Exemplo:**
```trest
импорт * как Process измодуля "std/process"

# Variáveis de ambiente
пусть home = Process.getEnv("HOME")
пусть todas = Process.getAllEnv()
печать(todas.USER)

# Informações do sistema
печать("Plataforma: " + Process.platform)    # win32
печать("Arquitetura: " + Process.arch)       # x64
печать("Versão Node: " + Process.version)
печать("Diretório atual: " + Process.cwd)
печать("Process ID: " + Process.pid)

# Mudar diretório
Process.chdir("/outro/diretorio")

# Sair do programa
Process.exit(0)  # código 0 = sucesso
```

---

### 📖 IO - Entrada e Saída (✅ Implementado em 2.4.7)

**Importação:**
```trest
импорт * как IO измодуля "std/io"
```

**Funções Disponíveis:**
- `IO.читать()` - Ler entrada do usuário (bloqueia até Enter) - **✅ Implementado em 2.4.7**
- `IO.печать(...)` - Exibir valores (equivalente a `печать`)
- `IO.печатьВстроенный(...)` - Imprimir sem quebra de linha

**Exemplo Básico:**
```trest
импорт * как IO измодуля "std/io"

IO.печать("Digite seu nome: ")
пусть nome = IO.читать()
IO.печать("Olá, " + nome + "!")
```

**Exemplo Completo - Formulário Interativo:**
```trest
импорт * как IO измодуля "std/io"

печать("=== Sistema de Cadastro ===")
печать("")

IO.печать("Digite seu nome: ")
пусть nome = IO.читать()

IO.печать("Digite sua idade: ")
пусть idadeStr = IO.читать()
пусть idade = Number(idadeStr)

IO.печать("Digite sua cidade: ")
пусть cidade = IO.читать()

печать("")
печать("=== Dados Cadastrados ===")
печать("Nome: " + nome)
печать("Idade: " + idade)
печать("Cidade: " + cidade)
печать("")

если (idade >= 18) {
    печать("✅ Cadastro realizado com sucesso!")
} иначе {
    печать("⚠️ Menor de idade - cadastro supervisionado")
}
```

**Nota Técnica:**
- `IO.читать()` é uma função **síncrona** que bloqueia a execução até o usuário pressionar Enter
- Utiliza `readline-sync` para leitura síncrona de entrada
- Funciona em terminais interativos (TTY) e em modo pipe (stdin)
- Suporta leitura de múltiplas linhas sequencialmente

---

### 🌐 DOM - Manipulação de DOM (Front-End) (✅ Novo em 2.5.2)

**Importação:**
```trest
импорт * как DOM измодуля "std/dom"
```

**⚠️ Importante:** O módulo DOM só funciona quando compilado para web (`--mode web`). No Node.js, as funções lançam erro explicativo.

**Funções Disponíveis:**

**Seleção de Elementos:**
- `DOM.selecionar(seletor)` / `DOM.select(seletor)` - Selecionar elemento (querySelector)
- `DOM.criar(tag)` / `DOM.create(tag)` - Criar elemento (createElement)

**Manipulação de Conteúdo:**
- `DOM.texto(elemento, valor?)` / `DOM.setText(elemento, valor?)` - Obter/definir innerText
- `DOM.html(elemento, valor?)` / `DOM.setHTML(elemento, valor?)` - Obter/definir innerHTML
- `DOM.valor(elemento, valor?)` / `DOM.val(elemento, valor?)` - Obter/definir value (inputs)

**Eventos:**
- `DOM.evento(elemento, tipo, callback)` / `DOM.addEvent(elemento, tipo, callback)` - Adicionar evento (addEventListener)

**Gerenciamento de DOM:**
- `DOM.adicionar(parent, child)` / `DOM.append(parent, child)` - Adicionar elemento (appendChild)
- `DOM.remover(elemento)` / `DOM.remove(elemento)` - Remover elemento
- `DOM.atributo(elemento, nome)` / `DOM.getAttr(elemento, nome)` - Obter atributo (getAttribute)
- `DOM.definirАтрибут(elemento, nome, valor)` / `DOM.setAttr(elemento, nome, valor)` - Definir atributo (setAttribute)

**Exemplo Completo:**
```trest
импорт * как DOM измодуля "std/dom"

# Selecionar elemento
пусть botao = DOM.select("#meu-botao")

# Adicionar evento
DOM.addEvent(botao, "click", функция() {
    печать("Botão clicado!")
    DOM.setText(botao, "Clicado!")
})

# Criar e adicionar elemento
пусть novoElemento = DOM.create("div")
DOM.setText(novoElemento, "Novo elemento")
DOM.append(document.body, novoElemento)

# Manipular input
пусть input = DOM.select("#meu-input")
пусть valor = DOM.val(input)  # Ler valor
DOM.val(input, "Novo valor")   # Definir valor

# Atributos
DOM.setAttr(botao, "disabled", "true")
пусть disabled = DOM.getAttr(botao, "disabled")
```

**Compilação:**
```bash
trestc app.trest --mode web --output app.js
```

---

### 🎨 Style - Sistema de CSS e Estilização (✅ Novo em 2.5.2)

**Importação:**
```trest
импорт * как Style измодуля "std/style"
```

**⚠️ Importante:** O módulo Style só funciona quando compilado para web (`--mode web`). No Node.js, algumas funções apenas logam (como `loadFile`).

**Funções Disponíveis:**

**Carregamento de CSS:**
- `Style.carregарCDN(url)` / `Style.loadCDN(url)` - Carregar CSS de CDN (Bootstrap, Tailwind, etc)
- `Style.carregарАрхив(caminho)` / `Style.loadFile(caminho)` - **Carregar CSS de arquivo local (✅ Build Time em 2.5.2)**
  - Durante compilação web, o compilador lê o arquivo CSS do disco
  - O CSS é minificado automaticamente (remove comentários, espaços extras)
  - O conteúdo é injetado diretamente no JavaScript gerado como tag `<style>`
  - Não requer requisição HTTP adicional em runtime

**Manipulação de Estilos:**
- `Style.aplicар(elemento, estilos)` / `Style.apply(elemento, estilos)` - Aplicar estilos via objeto
- `Style.obter(elemento, propriedade)` / `Style.get(elemento, propriedade)` - Obter estilo computado
- `Style.definir(elemento, propriedade, valor)` / `Style.set(elemento, propriedade, valor)` - Definir estilo individual

**Classes CSS:**
- `Style.добавитьКласс(elemento, classe)` / `Style.addClass(elemento, classe)` - Adicionar classe
- `Style.удалитьКласс(elemento, classe)` / `Style.removeClass(elemento, classe)` - Remover classe
- `Style.переключитьКласс(elemento, classe)` / `Style.toggleClass(elemento, classe)` - Alternar classe

**Mapeamento de Propriedades:**
O método `apply()` mapeia automaticamente propriedades em cirílico para CSS:
- `cor` → `color`
- `фон` / `фонЦвет` → `backgroundColor`
- `ширина` → `width`
- `высота` → `height`
- `отступ` → `padding`
- `маржа` → `margin`
- `граница` → `border`
- `размерШрифта` → `fontSize`
- `весШрифта` → `fontWeight`
- `выравнивание` → `textAlign`
- `отображение` → `display`

**Exemplo Completo:**
```trest
импорт * как DOM измодуля "std/dom"
импорт * как Style измодуля "std/style"

# Carregar Bootstrap via CDN
Style.loadCDN("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css")

# Carregar CSS local (Build Time - CSS é lido do disco durante compilação)
Style.loadFile("./meu-estilo.css")  # ✅ CSS minificado incluído no bundle

# Selecionar elemento
пусть elemento = DOM.select(".meu-elemento")

# Aplicar estilos via objeto (CSS-in-Trest)
Style.apply(elemento, {
    cor: "red",
    фон: "blue",
    ширина: "100px",
    высота: "50px",
    отступ: "10px",
    размерШрифта: "16px"
})

# Ou usar propriedades CSS diretamente
Style.set(elemento, "color", "red")
Style.set(elemento, "backgroundColor", "blue")

# Obter estilo computado
пусть cor = Style.get(elemento, "color")

# Gerenciar classes
Style.addClass(elemento, "btn-primary")
Style.removeClass(elemento, "btn-secondary")
Style.toggleClass(elemento, "active")
```

**Compilação:**
```bash
trestc app.trest --mode web --output app.js
```

---

### 🧪 Test - Framework de Testes Unitários (✅ Novo em 2.5.2)

**Importação:**
```trest
импорт * как Test измодуля "std/test"
```

**Funções Disponíveis:**

**Descrever Testes:**
- `Test.descrever(nome, callback)` / `Test.describe(nome, callback)` - Registrar teste

**Asserções:**
- `Test.afirmар(condicao, mensagem)` / `Test.assert(condicao, mensagem)` - Afirmar condição
- `Test.igual(esperado, atual, mensagem?)` / `Test.equal(esperado, atual, mensagem?)` - Afirmar igualdade
- `Test.verdadeiro(valor, mensagem?)` / `Test.isTrue(valor, mensagem?)` - Afirmar que é verdadeiro
- `Test.ложь(valor, mensagem?)` / `Test.isFalse(valor, mensagem?)` - Afirmar que é falso

**Execução:**
- `Test.выполнить()` / `Test.run()` - Executar todos os testes e retornar relatório

**Exemplo Completo:**
```trest
импорт * как Test измодуля "std/test"

# Teste básico
Test.describe("Teste de soma", функция() {
    пусть resultado = 2 + 2
    пусть esperado = 4
    Test.equal(resultado, esperado, "2+2 deve ser 4")
})

# Teste de igualdade
Test.describe("Teste de igualdade", функция() {
    Test.equal(5, 5, "5 deve ser igual a 5")
    Test.equal("hello", "hello", "Strings devem ser iguais")
})

# Teste de verdadeiro/falso
Test.describe("Teste de booleanos", функция() {
    Test.isTrue(истина, "true deve ser verdadeiro")
    пусть condicao = 10 > 5
    Test.isTrue(condicao, "10 > 5 deve ser verdadeiro")
    Test.isFalse(ложь, "false deve ser falso")
})

# Executar todos os testes
пусть resultado = Test.run()

печать("Passaram: " + resultado.passed)
печать("Falharam: " + resultado.failed)
```

**Saída:**
```
✅ Teste de soma
✅ Teste de igualdade
✅ Teste de booleanos

📊 Testes: 3 passaram, 0 falharam
```

---

### 🎨 GUI - Interface Gráfica

**Importação:**
```trest
импорт * как GUI измодуля "std/gui"
```

**Funções Disponíveis:**
- `GUI.createWindow(title, width, height)` - Criar janela
- `GUI.createButton(label, onClick)` - Criar botão
- `GUI.createText(placeholder, onChange)` - Criar campo de texto
- `GUI.createList(data, onSelect)` - Criar lista

> **Nota:** GUI está em desenvolvimento ativo.

---

### 📚 Módulo Principal (std/index)

Importar todos os módulos de uma vez:

```trest
импорт * измодуля "std/index"

# Todos os módulos disponíveis:
# Math, String, Array, IO, HTTP, Async, GUI, DB, JSON, Date, Crypto, RegEx, Path, Process, FileSystem, DOM, Style, Test
```

---

## 🔧 Sistema de Módulos

### Importar Módulos

```trest
# Importar módulo inteiro
импорт * как Math измодуля "std/math"

# Importar funções específicas
импорт { abs, max, min } измодуля "std/math"

# Importar de arquivo local
импорт * как Utils измодуля "./utils.trest"
импорт { minhaFuncao } измодуля "../helpers.trest"

# Importar pacote NPM (✅ Novo em 2.5.2)
импорт * как Axios изpkg "axios"
импорт * как Lodash fromPkg "lodash"  # Alias em inglês

# Importar tudo de uma vez (namespace)
импорт * как StdLib измодуля "std/index"
StdLib.Math.sqrt(25)
```

### Exportar de Módulos

```trest
# Exportar função
экспорт функция minhaFuncao() {
    вернуть "Olá"
}

# Exportar constante
экспорт константа PI = 3.14159

# Exportar variável
экспорт пусть contador = 0

# Exportar múltiplos itens
экспорт {
    функция1,
    функция2,
    константа
}
```

**Exemplo Completo:**

**math_utils.trest:**
```trest
экспорт функция сложить(a, b) {
    вернуть a + b
}

экспорт функция умножить(a, b) {
    вернуть a * b
}

экспорт конст PI = 3.14159
```

**main.trest:**
```trest
импорт { сложить, умножить, PI } измодуля "./math_utils.trest"

печать(сложить(5, 3))      # 8
печать(умножить(2, 4))     # 8
печать(PI)                 # 3.14159
```

---

### 📦 Importação de Pacotes NPM (✅ Novo em 2.5.2)

Trest agora suporta importação direta de pacotes do ecossistema Node.js usando a sintaxe `изpkg` ou `fromPkg`.

**Sintaxe:**
```trest
импорт * как Nome изpkg "nome-do-pacote"
импорт * как Nome fromPkg "nome-do-pacote"  # Alias em inglês
```

**Comportamento:**
- No Node.js: Compilado para `require("nome-do-pacote")`
- No Web: Compilado para `require()` ou incluído no bundle (dependendo do bundler)
- Erros claros se o pacote não estiver instalado

**Exemplo:**
```trest
# Instalar pacote primeiro: npm install axios
импорт * как Axios изpkg "axios"

# Usar o pacote
пусть resposta = Axios.get("https://api.exemplo.com/dados")
печать(resposta.data)
```

**Pacotes Populares que Funcionam:**
- `axios` - Cliente HTTP
- `lodash` - Utilitários JavaScript
- `moment` - Manipulação de datas
- `express` - Framework web (quando usado no Node.js)
- Qualquer pacote do npm!

**⚠️ Importante:**
- Certifique-se de instalar o pacote antes de usar: `npm install nome-do-pacote`
- Pacotes que dependem de APIs do navegador só funcionam quando compilados para web
- Pacotes que dependem de APIs do Node.js só funcionam no Node.js

**Tratamento de Erros:**
```trest
попробовать {
    импорт * как FakePkg изpkg "pacote-inexistente"
} поймать(ошибка) {
    печать("Erro: " + ошибка)
    # Mensagem clara: "Não foi possível importar o pacote..."
}
```

---

## 🛡️ Tratamento de Erros

### Try/Catch/Finally

```trest
попытаться {
    # Código que pode gerar erro
    пусть resultado = dividir(10, 0)
} перехватить (ошибка) {
    # Capturar e tratar o erro
    печать("Ошибка: " + ошибка)
} наконец {
    # Código sempre executado
    печать("Операция завершена")
}
```

### Throw (Lançar Erro)

```trest
функция делить(a, b) {
    если (b == 0) {
        бросить "Деление на ноль невозможно!"
    }
    вернуть a / b
}

попытаться {
    делить(10, 0)
} перехватить (ошибка) {
    печать("Ошибка: " + ошибка)  # "Ошибка: Деление на ноль невозможно!"
}
```

### Múltiplos Catches

```trest
попытаться {
    # código
} перехватить (ошибка) {
    если (ошибка == "Тип 1") {
        # tratar tipo 1
    } иначе если (ошибка == "Тип 2") {
        # tratar tipo 2
    } иначе {
        # tratar erro genérico
    }
}
```

---

## 🏗️ Compilação

Trest pode compilar código para diferentes plataformas:

### Compilar para Web (JavaScript)

```bash
trestc programa.trest --mode web --output app.js
```

**Opções:**
- `--mode web` - Modo de compilação web
- `--output` ou `-o` - Arquivo de saída
- `--minify` - Minificar código JavaScript
- `--bundle` - Incluir dependências no bundle

**Exemplo:**
```bash
trestc src/app.trest --mode web --output dist/app.js --minify
```

### Compilar para Desktop (.exe)

```bash
trestc programa.trest --mode exe --output app.exe
```

**Opções:**
- `--mode exe` - Modo de compilação executável
- `--output` ou `-o` - Arquivo de saída
- `--target` - Plataforma alvo (win32, linux, darwin)

**Exemplo:**
```bash
trestc src/app.trest --mode exe --output dist/app.exe --target win32
```

### Executar Direto (Interpretador)

```bash
trest programa.trest
```

**Opções:**
- `-e` ou `--eval` - Executar código inline
- `--version` - Mostrar versão
- `--help` - Mostrar ajuda

**Exemplo:**
```bash
trest -e "печать('Olá Mundo')"
```

---

## 💡 Exemplos

### Exemplo 1: Calculadora

```trest
функция калькулятор(a, операция, b) {
    переключатель (операция) {
        случай "+":
            вернуть a + b
        случай "-":
            вернуть a - b
        случай "*":
            вернуть a * b
        случай "/":
            если (b == 0) {
                бросить "Деление на ноль!"
            }
            вернуть a / b
        поумолчанию:
            бросить "Неизвестная операция: " + операция
    }
}

печать(калькулятор(10, "+", 5))   # 15
печать(калькулятор(10, "*", 3))   # 30
```

### Exemplo 2: Fatorial

```trest
функция факториал(n) {
    если (n <= 1) {
        вернуть 1
    }
    вернуть n * факториал(n - 1)
}

печать(факториал(5))  # 120
печать(факториал(10)) # 3628800
```

### Exemplo 3: Fibonacci

```trest
функция фибоначчи(n) {
    если (n <= 1) {
        вернуть n
    }
    вернуть фибоначчи(n - 1) + фибоначчи(n - 2)
}

для (пусть i = 0; i < 10; i = i + 1) {
    печать(фибоначчи(i))
}
```

### Exemplo 4: Gerenciamento de Usuários

```trest
класс Пользователь {
    функция конструктор(имя, email) {
        это.имя = имя
        это.email = email
        это.id = Math.random() * 1000000
    }
    
    функция показать() {
        печать("ID: " + это.id)
        печать("Имя: " + это.имя)
        печать("Email: " + это.email)
    }
}

класс МенеджерПользователей {
    функция конструктор() {
        это.пользователи = []
    }
    
    функция добавить(пользователь) {
        это.пользователи.добавить(пользователь)
    }
    
    функция найти(id) {
        для (пусть пользователь из это.пользователи) {
            если (пользователь.id == id) {
                вернуть пользователь
            }
        }
        вернуть нуль
    }
    
    функция список() {
        для (пусть пользователь из это.пользователи) {
            пользователь.показать()
            печать("---")
        }
    }
}

# Uso
пусть менеджер = новый МенеджерПользователей()
пусть иван = новый Пользователь("Иван", "ivan@example.com")
пусть мария = новый Пользователь("Мария", "maria@example.com")

менеджер.добавить(иван)
менеджер.добавить(мария)
менеджер.список()
```

### Exemplo 5: Leitura de Arquivo com Tratamento de Erro

```trest
импорт * как FileSystem измодуля "std/filesystem"

функция прочитатьФайлБезопасно(путь) {
    попытаться {
        если (!FileSystem.exists(путь)) {
            бросить "Файл не существует: " + путь
        }
        
        пусть содержимое = FileSystem.readFile(путь)
        печать("Файл прочитан успешно!")
        вернуть содержимое
        
    } перехватить (ошибка) {
        печать("Ошибка при чтении файла: " + ошибка)
        вернуть нуль
    } наконец {
        печать("Операция завершена")
    }
}

пусть данные = прочитатьФайлБезопасно("dados.txt")
если (данные != нуль) {
    печать(данные)
}
```

### Exemplo 6: API HTTP Simples

```trest
импорт * как HTTP измодуля "std/http"

пусть servidor = HTTP.создатьСервер()

# Rota principal
servidor.get("/", функция(запрос, ответ) {
    печать("📄 Requisição: GET /")
    ответ.status(200)
    ответ.json({ message = "Добро пожаловать в Trest API!" })
})

# Rota de usuários
servidor.get("/users", функция(запрос, ответ) {
    печать("📄 Requisição: GET /users")
    пусть usuarios = [
        { id = 1, имя = "Иван", idade = 30 },
        { id = 2, имя = "Мария", idade = 25 }
    ]
    ответ.json(usuarios)
})

# Rota 404
servidor.get("/404", функция(запрос, ответ) {
    ответ.status(404)
    ответ.send("<h1>404 - Página não encontrada</h1>")
})

# Iniciar servidor
servidor.listen(3000, функция() {
    печать("✅ Сервер запущен на порту 3000")
    печать("🌐 Acesse: http://localhost:3000")
})
```

### Exemplo 7: Site Web Completo (Novo em 2.4.7)

Exemplo completo de site web com múltiplas páginas HTML:

```trest
импорт * как HTTP измодуля "std/http"

# Função para gerar HTML da página inicial
функция obterHTMLInicial() {
    вернуть "<!DOCTYPE html>\n" +
"<html><head><title>Trest Site</title></head>\n" +
"<body><h1>Bem-vindo ao Trest!</h1>\n" +
"<p>Linguagem de programação moderna.</p>\n" +
"<a href=\"/sobre\">Sobre</a></body></html>"
}

# Criar servidor
пусть servidor = HTTP.создатьСервер()

# Rotas
servidor.get("/", функция(запрос, ответ) {
    ответ.send(obterHTMLInicial())
})

servidor.get("/sobre", функция(запрос, ответ) {
    ответ.send("<h1>Sobre Trest</h1><p>Versão 2.5.3</p>")
})

servidor.get("/api/status", функция(запрос, ответ) {
    пусть status = { servidor = "Trest", versao = "2.4.7", online = истина }
    ответ.json(status)
})

# Iniciar
servidor.listen(3000, функция() {
    печать("🚀 Site web iniciado em http://localhost:3000")
})
```

**Veja o exemplo completo em:** `exemplos/site_web.trest`

---

## 🎓 Melhores Práticas

### Nomenclatura

✅ **Bom:**
```trest
пусть имяПользователя = "Иван"
пусть возрастПользователя = 30
функция рассчитатьСумму(a, b) {
    вернуть a + b
}
```

❌ **Ruim:**
```trest
пусть x = "Иван"
пусть y = 30
функция f(a, b) {
    вернуть a + b
}
```

**Regras:**
- Use nomes claros em russo
- Use camelCase para variáveis e funções: `имяПользователя`
- Use PascalCase para classes: `МенеджерПользователей`
- Evite abreviações
- Nomes devem refletir o propósito

### Organização de Código

✅ **Dividir em Módulos:**
```trest
# utils/math.trest
экспорт функция сложить(a, b) {
    вернуть a + b
}

# main.trest
импорт { сложить } из "./utils/math.trest"
```

✅ **Comentários Úteis:**
```trest
# Calcula a área de um círculo dado o raio
функция площадьКруга(радиус) {
    вернуть Math.PI * радиус ** 2
}
```

### Funções

✅ **Funções Pequenas e Específicas:**
```trest
функция валидировать(данные) {
    # validação
}

функция обработать(данные) {
    # processamento
}

функция сохранить(данные) {
    # salvamento
}
```

❌ **Função Gigante:**
```trest
функция обработатьДанные(данные) {
    # 100 linhas de código
    # fazendo tudo junto
}
```

### Tratamento de Erros

✅ **Sempre Trate Erros:**
```trest
попытаться {
    пусть результат = делить(10, 0)
} перехватить (ошибка) {
    печать("Ошибка: " + ошибка)
}
```

✅ **Mensagens Claras:**
```trest
бросить "Не удалось загрузить файл: " + путь
```

### Desempenho

✅ **Cache de Valores:**
```trest
пусть длина = массив.длина
для (пусть i = 0; i < длина; i = i + 1) {
    # ...
}
```

❌ **Recálculo Desnecessário:**
```trest
для (пусть i = 0; i < массив.длина; i = i + 1) {
    # массив.длина calculado em cada iteração
}
```

---

## 📖 Referência Completa

### Palavras-chave Completas

| Cirílico | Latim | Tipo |
|----------|-------|------|
| `пусть` | let | Declaração |
| `константа` | const | Declaração |
| `variavel` | var | Declaração |
| `если` | if | Controle |
| `иначе` | else | Controle |
| `иначе если` | else if | Controle |
| `для` | for | Controle |
| `пока` | while | Controle |
| `прервать` | break | Controle |
| `продолжить` | continue | Controle |
| `переключатель` | switch | Controle |
| `случай` | case | Controle |
| `поумолчанию` | default | Controle |
| `функция` | function | Função |
| `вернуть` | return | Função |
| `импорт` | import | Módulo |
| `экспорт` | export | Módulo |
| `измодуля` | from | Módulo |
| `попытаться` | try | Erro |
| `перехватить` | catch | Erro |
| `наконец` | finally | Erro |
| `бросить` | throw | Erro |
| `класс` | class | OOP |
| `расширяет` | extends | OOP |
| `это` | this | OOP |
| `супер` | super | OOP |
| `новый` | new | OOP |
| `истина` | true | Valor |
| `ложь` | false | Valor |
| `нуль` | null | Valor |
| `неопределен` | undefined | Valor |
| `Array` | Array (global) | Objeto Global JavaScript ✅ Novo em 2.5.2 |
| `Object` | Object (global) | Objeto Global JavaScript ✅ Novo em 2.5.2 |
| `typeof` | typeof (função) | Verificar tipo de valor ✅ Novo em 2.5.2 |

### Operadores Completos

**Aritméticos:**
- `+` (adição)
- `-` (subtração)
- `*` (multiplicação)
- `/` (divisão)
- `%` (resto/módulo)
- `**` (potência)

**Comparação:**
- `==` (igual)
- `!=` (diferente)
- `<` (menor)
- `>` (maior)
- `<=` (menor ou igual)
- `>=` (maior ou igual)

**Lógicos:**
- `&&` (E/AND)
- `||` (OU/OR)
- `!` (NÃO/NOT)

**Atribuição:**
- `=` (atribuição)
- `+=`, `-=`, `*=`, `/=`, `%=` (compostos)

### Biblioteca Padrão - Resumo

| Módulo | Funções Principais | Status |
|--------|-------------------|--------|
| **Math** | abs, max, min, sqrt, pow, ceil, floor, round, PI, E | ✅ Completo |
| **String** | размер, верхний, нижний, заменить, разделить | ✅ Completo |
| **Array** | длина, добавить, удалить, включает, обратить, срез, отсортировать | ✅ Completo |
| **HTTP** | GET, POST, PUT, DELETE, fetch, создатьСервер, use (wildcard) | ✅ Completo (melhorias em 2.4.8) |
| **Crypto** | md5, sha256, sha512, encrypt, decrypt, randomBytes | ✅ Completo |
| **FileSystem** | readFile, writeFile, exists, deleteFile, listDir, createDir, deleteDir, getStats | ✅ Completo |
| **JSON** | parse, stringify | ✅ Completo |
| **Date** | теперь, timestamp, format, timezone | ✅ Completo (timestamp adicionado em 2.4.8) |
| **Database** | openDB (detecção automática), openSQLite, openMySQL, openPostgreSQL, execute(query, params), query(query, params), transaction, close - **Implementação Real** com better-sqlite3, mysql2, pg | ✅ Completo (100% Funcional - SQLite Testado, MySQL/PostgreSQL Prontos) |
| **Async** | delay, createPromise, allPromises, anyPromise, setTimer, clearTimer, repeatInterval, clearRepeat | ✅ Completo |
| **RegEx** | create, test, match, findAll, replace, split | ✅ Completo |
| **Path** | join, resolve, dirname, basename, extname, normalize, isAbsolute, relative | ✅ Completo |
| **Process** | getEnv, getAllEnv, setEnv, chdir, exit, platform, arch, version, cwd, pid | ✅ Completo |
| **IO** | читать, печать | ✅ Completo |
| **GUI** | createWindow, createButton, createText, createList | 🚧 Em desenvolvimento |
| **DOM** | select, addEvent, setText, setHTML, val, create, append, remove, getAttr, setAttr | ✅ Completo (2.5.2) |
| **Style** | loadCDN, loadFile, apply, get, set, addClass, removeClass, toggleClass | ✅ Completo (2.5.2) |
| **Test** | describe, assert, equal, isTrue, isFalse, run | ✅ Completo (2.5.2) |

---

## 🏗️ Arquitetura e Funcionamento Interno

A linguagem Trest funciona em **4 estágios principais**:

1. **Lexer (Análise Léxica)** - Converte código fonte em tokens
2. **Parser (Análise Sintática)** - Constrói a Árvore Sintática Abstrata (AST)
3. **Interpreter (Execução)** - Executa o código diretamente
4. **Compiler (Compilação)** - Gera código para Web (.js) ou Desktop (.exe)

### 📊 Fluxo de Execução

```
Código Fonte (.trest)
        ↓
    [Lexer]
        ↓
    Tokens (palavras-chave, operadores, literais)
        ↓
    [Parser]
        ↓
    AST (Árvore Sintática Abstrata)
        ↓
    ┌─────────────────────────┐
    │                         │
    [Interpreter]      [Compiler]
    │                         │
    Execução          Web/Exe
    Direta             Gerado
```

### 🔍 Estágio 1: Lexer (Análise Léxica)

O Lexer é responsável por **tokenizar** o código fonte, convertendo texto em tokens.

**Como Funciona:**

1. **Lê o código fonte** caractere por caractere
2. **Identifica tipos de tokens:**
   - Palavras-chave: `если`, `пока`, `функция`, `печать`
   - Identificadores: nomes de variáveis e funções
   - Literais: números, strings, booleanos
   - Operadores: `+`, `-`, `*`, `/`, `==`, `!=`
   - Delimitadores: `(`, `)`, `{`, `}`, `[`, `]`

3. **Suporta Unicode:**
   - Caracteres cirílicos: `а-яА-ЯёЁ`
   - Caracteres latinos: `a-zA-Z`
   - Caracteres especiais portugueses: `áàâãéêíóôõúç`

**Exemplo:**

**Código:**
```trest
печать("Привет")
```

**Tokens gerados:**
```javascript
[
  { type: 'PRINT', value: 'печать', line: 1, column: 1 },
  { type: 'LPAREN', value: '(', line: 1, column: 8 },
  { type: 'STRING', value: 'Привет', line: 1, column: 9 },
  { type: 'RPAREN', value: ')', line: 1, column: 17 },
  { type: 'EOF', value: '', line: 1, column: 18 }
]
```

### 🌳 Estágio 2: Parser (Análise Sintática)

O Parser constrói a **Árvore Sintática Abstrata (AST)** a partir dos tokens.

**Como Funciona:**

1. **Recebe os tokens** do Lexer
2. **Constrói a AST** seguindo a gramática da linguagem:
   - Expressões (aritméticas, lógicas, chamadas de função)
   - Declarações (variáveis, funções, imports, exports)
   - Estruturas de controle (if, while, for, try/catch)
   - Blocos de código

3. **Validação sintática:**
   - Verifica se parênteses, chaves e colchetes estão balanceados
   - Verifica se a ordem dos tokens está correta
   - Reporta erros de sintaxe com linha e coluna

**Exemplo:**

**Tokens:**
```
[PRINT, LPAREN, STRING("Привет"), RPAREN]
```

**AST gerada:**
```javascript
{
  type: 'Program',
  body: [
    {
      type: 'PrintStatement',
      arguments: [
        { type: 'Literal', value: 'Привет' }
      ]
    }
  ]
}
```

### ⚙️ Estágio 3: Interpreter (Interpretador)

O Interpreter **executa** a AST diretamente, sem compilar.

**Como Funciona:**

1. **Recebe a AST** do Parser
2. **Executa cada nó da árvore:**
   - **Declarações:** Cria variáveis e funções no ambiente
   - **Expressões:** Calcula valores
   - **Estruturas de controle:** Executa condicionais e loops
   - **Chamadas de função:** Executa funções com escopo próprio

3. **Sistema de Escopo:**
   - Cada bloco tem seu próprio ambiente (scope)
   - Variáveis são procuradas no escopo atual e nos pais
   - Funções têm closures (capturam variáveis do escopo onde foram definidas)

4. **Tipos Dinâmicos:**
   - Tipos são inferidos em tempo de execução
   - Conversões automáticas (ex: string + number → string)

### 🏗️ Estágio 4: Compiler (Compilação)

#### 4.1 Compilador Web

Converte código Trest para **JavaScript**.

**Como Funciona:**
1. Recebe a AST do Parser
2. Percorre a AST recursivamente
3. Gera código JavaScript equivalente
4. Suporta minificação e bundling

**Exemplo:**

**Código Trest:**
```trest
пусть x = 10
печать(x)
```

**JavaScript gerado:**
```javascript
(function() {
  let x = 10;
  console.log(x);
})();
```

#### 4.2 Compilador Executável

Cria executáveis `.exe` standalone.

**Como Funciona:**
1. Compila para JavaScript (usando WebCompiler)
2. Cria wrapper Node.js
3. Usa `pkg` para criar executável
4. Inclui todas as dependências

**Resultado:**
- Arquivo `.exe` que não requer Node.js instalado
- Auto-contido (todas as dependências incluídas)

### 📦 Sistema de Módulos Interno

Permite importar/exportar código entre arquivos.

**Como Funciona:**

1. **Resolução de Módulos:**
   - Caminhos relativos: `./meuModulo.trest`
   - Módulos std: `std/math`
   - Caminhos absolutos

2. **Carregamento:**
   - Lê o arquivo do módulo
   - Tokeniza e faz parse (mesmo processo)
   - Cria ambiente isolado
   - Expõe apenas exports declarados

3. **Cache:**
   - Módulos são carregados apenas uma vez
   - Reutilizados em múltiplos imports

### 🎯 Fluxo Completo de Exemplo

**Código Trest:**
```trest
функция приветствие(имя) {
    вернуть "Привет, " + имя
}

пусть сообщение = приветствие("Trest")
печать(сообщение)
```

**1. Lexer produz tokens:**
```javascript
[FUNC, IDENTIFIER('приветствие'), LPAREN, IDENTIFIER('имя'), RPAREN, 
 LBRACE, RETURN, STRING('Привет, '), PLUS, IDENTIFIER('имя'), RBRACE, ...]
```

**2. Parser constrói AST:**
```javascript
{
  type: 'Program',
  body: [
    {
      type: 'FunctionDeclaration',
      name: 'приветствие',
      params: ['имя'],
      body: { /* AST do corpo da função */ }
    },
    {
      type: 'VariableDeclaration',
      name: 'сообщение',
      value: { /* AST da chamada de função */ }
    },
    {
      type: 'PrintStatement',
      arguments: [{ type: 'Identifier', name: 'сообщение' }]
    }
  ]
}
```

**3a. Interpreter executa:**
1. Cria função `приветствие` no ambiente global
2. Avalia chamada `приветствие("Trest")` → `"Привет, Trest"`
3. Atribui resultado a `сообщение`
4. Imprime `"Привет, Trest"`

**3b. Compiler gera JavaScript:**
```javascript
(function() {
  function приветствие(имя) {
    return "Привет, " + имя;
  }
  let сообщение = приветствие("Trest");
  console.log(сообщение);
})();
```

### 🔄 Diferenças: Interpreter vs Compiler

#### Interpreter (Execução Direta)
- ✅ Mais rápido para desenvolvimento
- ✅ Erros mais fáceis de depurar
- ❌ Mais lento em execução
- ❌ Requer runtime (Node.js)

#### Compiler (Compilação)
- ✅ Execução mais rápida
- ✅ Pode otimizar código
- ✅ Gera código standalone (.exe)
- ❌ Processo mais longo
- ❌ Depuração mais difícil

### 🛠️ Recursos Especiais Internos

1. **Suporte a Unicode**
   - Identificadores podem usar cirílico, latim e caracteres especiais
   - Palavras-chave em múltiplos idiomas

2. **Tipagem Dinâmica**
   - Tipos inferidos em tempo de execução
   - Conversões automáticas quando apropriado

3. **Closures**
   - Funções capturam variáveis do escopo onde foram definidas
   - Permite programação funcional avançada

4. **Tratamento de Erros**
   - Try/Catch/Throw completo
   - Erros formatados com linha e coluna

5. **Sistema de Escopo**
   - Block scope para `let` e `const`
   - Function scope para `var`
   - Escopo global para declarações de nível superior

---

## 🛡️ Segurança

### Política de Segurança

A versão 2.4.4 inclui **correções importantes de segurança** na cadeia de suprimentos do pacote NPM.

### ✅ Medidas de Segurança Implementadas

#### 1. Scripts de Instalação Removidos

**Status:** ✅ **RESOLVIDO**

Os scripts `preinstall` e `postinstall` **NÃO são mais executados automaticamente** durante a instalação do pacote. Eles foram removidos do `package.json` para prevenir execução automática de código.

**Antes:**
- Scripts executados automaticamente durante `npm install`
- Usavam `child_process` para executar comandos do sistema

**Agora:**
- Scripts removidos da instalação automática
- Podem ser executados manualmente se necessário (apenas para desenvolvimento)
- Sem acesso ao shell durante instalação

#### 2. Acesso ao Shell (child_process)

**Status:** ✅ **RESOLVIDO**

O acesso ao shell via `child_process` foi **removido** dos scripts de instalação.

**Antes:**
- `preinstall.js` usava `execSync` para verificar versões
- Risco de execução de código arbitrário

**Agora:**
- `child_process` removido do `preinstall.js`
- Scripts de instalação não executam mais comandos do sistema
- Verificações feitas via APIs do Node.js (sem shell)

#### 3. Acesso à Rede (fetch/HTTP)

**Status:** ⚠️ **ALERTA LEGÍTIMO** (Funcionalidade Esperada)

O módulo `HTTP.fetch` e funções HTTP **acessam a rede** - isso é uma **funcionalidade legítima** do pacote.

**Por quê?**
- O pacote `treste` inclui um módulo HTTP completo (`std/http`)
- Este módulo precisa acessar a rede para fazer requisições HTTP
- Funciona apenas quando o código Trest **explicitamente usa** o módulo HTTP

**Quando é usado?**
```trest
# Apenas quando você explicitamente importa e usa:
импорт * как HTTP измодуля "std/http"
HTTP.GET("https://api.example.com")  # ← Aqui a rede é acessada
```

**Segurança:**
- ✅ Acesso à rede ocorre **apenas** quando o código Trest usa HTTP
- ✅ Não há acesso automático durante instalação
- ✅ Usuário tem controle total sobre quando usar

### 📋 Resumo dos Alertas

| Alerta | Status | Explicação |
|--------|--------|------------|
| **Instalar scripts** | ✅ Resolvido | Scripts removidos da instalação automática |
| **Acesso à Shell** | ✅ Resolvido | `child_process` removido dos scripts |
| **Acesso à Rede** | ⚠️ Legítimo | Funcionalidade esperada do módulo HTTP |

### 🔒 Boas Práticas de Segurança

#### Para Usuários do Pacote

1. **Revise o código** antes de executar programas Trest desconhecidos
2. **Use o módulo HTTP** apenas quando necessário
3. **Mantenha o pacote atualizado** para receber correções de segurança

#### Para Desenvolvedores

1. **Não execute** scripts desconhecidos automaticamente
2. **Revise dependências** antes de instalar
3. **Use `npm audit`** regularmente para verificar vulnerabilidades

### 📝 Dependências de Segurança

#### Dependências de Produção
- `minimist@^1.2.8` - ✅ Sem vulnerabilidades conhecidas

#### Dependências de Desenvolvimento
- `pkg@^5.8.1` - ⚠️ Vulnerabilidade moderada (Local Privilege Escalation)
  - **Status:** Movido para `devDependencies`
  - **Impacto:** Apenas em desenvolvimento, não instalado em produção
  - **Uso:** Apenas no script `bundle` para criar executáveis

### 🚨 Reportar Problemas de Segurança

Se você encontrar uma vulnerabilidade de segurança:

1. **NÃO** abra um issue público
2. Envie email para: [marcus.vieiraleal94@gmail.com](mailto:marcus.vieiraleal94@gmail.com)
3. Inclua detalhes sobre a vulnerabilidade encontrada

### 📚 Changelog de Segurança

#### Versão 2.4.4 - Correções de Segurança

**Problemas Resolvidos:**

1. **Scripts de Instalação Automáticos (RISCO DA CADEIA DE SUPRIMENTOS)**
   - ✅ Removidos scripts `preinstall` e `postinstall` do `package.json`
   - ✅ Scripts agora são opcionais e só executados manualmente
   - ✅ Scripts removidos do pacote publicado via `.npmignore`

2. **Acesso ao Shell (child_process) (RISCO DA CADEIA DE SUPRIMENTOS)**
   - ✅ Removido uso de `child_process` do `preinstall.js`
   - ✅ Verificações agora usam apenas APIs seguras do Node.js
   - ✅ Sem acesso ao shell durante instalação

3. **Acesso à Rede (fetch/HTTP)**
   - ⚠️ **FUNCIONALIDADE ESPERADA** - Não é um problema de segurança
   - Acesso ocorre apenas quando o código Trest explicitamente usa o módulo HTTP

**Compatibilidade:**
- Versão Anterior: 2.4.3
- Nova Versão: 2.4.4
- **Totalmente compatível** - Nenhuma mudança incompatível

Para mais detalhes, consulte:
- `SECURITY.md` - Política completa de segurança
- `CHANGELOG_SECURITY.md` - Detalhes das correções

---

## 📚 Recursos Adicionais

### Documentação Online

- **Site Oficial**: [https://trest-site.vercel.app](https://trest-site.vercel.app)
- **npm**: [https://www.npmjs.com/package/treste](https://www.npmjs.com/package/treste)

### Exemplos de Código

Veja a pasta `exemplos/` para mais exemplos:
- `crypto_demo.trest` - Demonstração de criptografia
- `http_demo.trest` - Cliente HTTP e servidor
- `database_demo.trest` - Operações de banco de dados
- `filesystem_demo.trest` - Operações de arquivo
- `site_web.trest` - **Site web completo (Novo em 2.4.7)** - Exemplo de site com múltiplas rotas HTML e API JSON
- `api_calculadora.trest` - **API Calculadora (Novo em 2.4.8)** - API REST completa com query parameters e tratamento robusto de erros
- `todas_funcionalidades.trest` - Exemplo completo

### Scripts Úteis

```bash
# Desenvolvimento
npm run build          # Compilar TypeScript
npm run build:watch    # Compilar em modo watch
npm run dev            # Executar em modo desenvolvimento
npm run test           # Executar testes

# Compilação
npm run compile:web    # Compilar para JavaScript
npm run compile:exe    # Compilar para executável
npm run bundle         # Criar bundle executável
```

---

## 🎉 Conclusão

Trest é uma linguagem moderna e poderosa que combina:
- ✅ Sintaxe intuitiva em cirílico
- ✅ Biblioteca padrão rica
- ✅ Compilação universal (Web e Desktop)
- ✅ Sistema de módulos completo
- ✅ Tratamento de erros robusto

**Comece agora mesmo:**

```bash
npm install -g treste
trest -e "печать('Привет, Trest!')"
```

---

**Versão:** 2.5.3  
**Autor:** PoktWeb  
**Licença:** MIT  
**Ano:** 2025

### 🆕 Novidades da Versão 2.5.3 (Correções de Segurança e Melhorias)

A versão 2.5.3 inclui correções importantes de segurança e melhorias de estabilidade:

**🛡️ Correções de Segurança:**
- ✅ **Electron atualizado** - De 28.3.3 para 35.7.5 (corrige CVE moderado GHSA-vmqv-hx8q-j7mg)
- ✅ **better-sqlite3 atualizado** - De 9.6.0 para 12.6.0 (versão mais recente)
- ✅ **Documentação de segurança** - SECURITY.md criado com explicações completas
- ✅ **npm audit --production** - 0 vulnerabilidades em dependências de produção

**📚 Melhorias:**
- ✅ **Documentação completa** - Todas as funcionalidades documentadas em SECURITY.md
- ✅ **Shell access documentado** - Uso de child_process explicado e justificado
- ✅ **Network access documentado** - Acesso à rede controlado pelo usuário

### 🆕 Novidades da Versão 2.5.2 (Full Stack Revolution)

A versão 2.5.2 consolida Trest como uma linguagem completa para Web e Desktop, adicionando manipulação de DOM, estilização (CSS) e interoperabilidade com NPM:

**🌐 Módulo std/dom (Front-End):**
- ✅ **Manipulação de DOM Completa** - Funções para interagir com a página web quando compilado para web
- ✅ **Seleção de Elementos** - `DOM.selecionar(seletor)` mapeia para `document.querySelector`
- ✅ **Eventos** - `DOM.evento(elemento, tipo, callback)` para `addEventListener`
- ✅ **Manipulação de Texto/HTML** - `DOM.texto()` e `DOM.html()` para `innerText` e `innerHTML`
- ✅ **Valores de Input** - `DOM.valor(elemento, valor)` para ler/escrever valores de inputs
- ✅ **Criação de Elementos** - `DOM.criar(tag)` para `createElement`
- ✅ **Gerenciamento de DOM** - `DOM.adicionar()`, `DOM.remover()`, `DOM.atributo()`
- ✅ **Compilação Web** - Todas as funções DOM compilam para JavaScript nativo do navegador
- ✅ **Suporte Duplo** - Funções disponíveis em cirílico e inglês

**🎨 Sistema de Estilização e CSS (std/style):**
- ✅ **CSS Remoto** - `Style.carregarCDN(url)` injeta tag `<link>` no head (ideal para Bootstrap/Tailwind)
- ✅ **CSS Local com Build** - `Style.carregarАрхив('./arquivo.css')` lê arquivo CSS do disco durante compilação e injeta conteúdo minificado como `<style>` no JS gerado (✅ Novo em 2.5.2 - Build Time)
- ✅ **CSS-in-Trest** - Manipular estilos via objeto: `Style.aplicar(elemento, { cor: "red", фон: "blue" })`
- ✅ **Classes CSS** - `Style.addClass()`, `Style.removeClass()`, `Style.toggleClass()`
- ✅ **Estilos Individuais** - `Style.definir(elemento, propriedade, valor)`
- ✅ **Mapeamento Automático** - Propriedades em cirílico mapeadas para CSS (ex: `cor` → `color`)

**📦 Interoperabilidade com NPM:**
- ✅ **Importação de Pacotes** - Sintaxe: `импорт * как Axios изpkg "axios"` (ou `fromPkg`)
- ✅ **Compilação Inteligente** - Compilador detecta `изpkg` e faz `require()` nativo do Node ou inclui no bundle web
- ✅ **Suporte Completo** - Qualquer pacote do ecossistema Node.js pode ser usado
- ✅ **Mensagens de Erro Claras** - Erros informativos se pacote não estiver instalado
- ✅ **Async/Await Nativo** - Suporte completo a `ожидать` (await) para trabalhar com Promises de forma limpa (✅ Novo em 2.5.2)

**🗄️ Banco de Dados Real (std/database) - Implementação Completa:**
- ✅ **SQLite Real** - Implementado com `better-sqlite3` (100% funcional e testado)
- ✅ **MySQL Real** - Implementado com `mysql2` (pronto para uso em produção)
- ✅ **PostgreSQL Real** - Implementado com `pg` (pronto para uso em produção)
- ✅ **Prepared Statements Nativos** - Todos os bancos usam prepared statements nativos dos drivers
- ✅ **Detecção Automática** - `DB.открытьБД()` detecta automaticamente o tipo de banco pela connection string
- ✅ **Pool de Conexões** - MySQL e PostgreSQL usam pool automático para performance
- ✅ **Transações Atômicas** - Suporte completo a transações com commit/rollback
- ✅ **100% Testado** - Todos os testes passando com verificações completas

**🧪 Framework de Testes (std/test):**
- ✅ **Testes Unitários** - Módulo simples com `Test.descrever(nome, callback)` e `Test.afirmar(condicao, mensagem)`
- ✅ **Asserções** - `Test.igual()`, `Test.verdadeiro()`, `Test.ложь()` (isFalse)
- ✅ **Execução** - `Test.выполнить()` executa todos os testes e retorna relatório
- ✅ **Relatórios** - Contagem de testes passados/falhados com mensagens de erro

**Exemplo de Uso - DOM:**
```trest
импорт * как DOM измодуля "std/dom"

пусть botao = DOM.selecionar("#meu-botao")
DOM.evento(botao, "click", функция() {
    печать("Botão clicado!")
    DOM.texto(botao, "Clicado!")
})
```

**Exemplo de Uso - Style:**
```trest
импорт * как Style измодуля "std/style"

# Carregar Bootstrap
Style.carregarCDN("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css")

пусть elemento = DOM.selecionar(".meu-elemento")
Style.aplicar(elemento, { cor: "red", фон: "blue", ширина: "100px" })
Style.addClass(elemento, "btn-primary")
```

**Exemplo de Uso - NPM com Async/Await:**
```trest
импорт * как Axios изpkg "axios"

асинхронный функция pegarDados() {
    пусть resposta = ожидать Axios.get("https://api.exemplo.com/dados")
    печать(resposta.data)
}

# Ou usando alias
async function buscarUsuario() {
    пусть user = aguardar Axios.get("https://api.exemplo.com/users/1")
    печать(user.data)
}
```

**Exemplo de Uso - CSS Build (Web):**
```trest
импорт * как Style измодуля "std/style"

# Durante compilação, o arquivo CSS é lido do disco e injetado no JS
Style.carregарАрхив("./styles.css")  # CSS é minificado e incluído no bundle
```

**Exemplo de Uso - Database (SQLite Real):**
```trest
импорт * как DB измодуля "std/database"

# SQLite (funciona imediatamente)
пусть db = DB.открытьБД("dados.db")
db.execute("CREATE TABLE usuarios (id INTEGER PRIMARY KEY, nome TEXT)")
db.execute("INSERT INTO usuarios (nome) VALUES (?)", ["João"])
пусть usuarios = db.query("SELECT * FROM usuarios WHERE nome = ?", ["João"])
db.close()
```

**Exemplo de Uso - Database (MySQL):**
```trest
# MySQL (requer servidor)
пусть db = DB.открытьБД("mysql://user:pass@localhost:3306/database")
# ou
пусть db = DB.открытьMySQL({host: "localhost", port: 3306, user: "root", password: "pass", database: "mydb"})
```

**Exemplo de Uso - Database (PostgreSQL):**
```trest
# PostgreSQL (requer servidor)
пусть db = DB.открытьБД("postgresql://user:pass@localhost:5432/database")
# ou
пусть db = DB.открытьPostgreSQL({host: "localhost", port: 5432, user: "postgres", password: "pass", database: "mydb"})
```

**Exemplo de Uso - Testes:**
```trest
импорт * как Test измодуля "std/test"

Test.descrever("Teste de soma", функция() {
    Test.afirmар(2 + 2 === 4, "2+2 deve ser 4")
    Test.igual(5, 5, "5 deve ser igual a 5")
})

Test.выполнить()
```

**Exemplo de Uso - Objetos Globais (✅ Novo em 2.5.2):**
```trest
# Verificar se é array
пусть arr = [1, 2, 3]
пусть isArray = Array.isArray(arr)
печать(isArray)  # true

# Verificar tipo
пусть db = DB.открытьБД("test.db")
пусть tipo = typeof(db.execute)
печать(tipo)  # "function"

# Usar Object
пусть obj = {nome: "João", idade: 30}
пусть chaves = Object.keys(obj)
печать(chaves)  # ["nome", "idade"]

пусть valores = Object.values(obj)
печать(valores)  # ["João", 30]

# Verificar null/undefined
пусть resultado = db.query("SELECT * FROM usuarios")
если (resultado != null && Array.isArray(resultado)) {
    печать("Resultado válido: " + resultado.length + " registros")
}
```

**Compatibilidade:**
- Versão Anterior: 2.5.2
- Nova Versão: 2.5.3
- **Totalmente compatível** - Nenhuma mudança incompatível

### 🆕 Novidades da Versão 2.5.1

A versão 2.5.1 introduz suporte completo para deploy na Vercel e criação de projetos otimizados para serverless functions:

**🚀 Deploy na Vercel - Suporte Completo:**
- ✅ **Adapter para Serverless Functions** - Criado adapter completo (`api/index.js`) que converte aplicações Trest para serverless functions da Vercel
- ✅ **create-trest-app Otimizado** - Comando `npx create-trest-app` cria projetos otimizados para Vercel com toda estrutura necessária
- ✅ **Estrutura Vercel-ready** - Projetos criados incluem `api/index.js`, `vercel.json`, `app.trest` configurados e prontos para deploy
- ✅ **Rotas Dinâmicas Suportadas** - Suporte completo para rotas com parâmetros dinâmicos (ex: `/api/users/:id`)
- ✅ **Instalação Automática** - Dependências instaladas automaticamente com versão mais recente do Trest (2.5.1)

**Como Usar:**
```bash
# Criar novo projeto Vercel-ready (Recomendado - Funciona Imediatamente)
npx create-trest-app meu-projeto

# Ou usando npx com alias
npx create-trest meu-projeto

# ⚠️ Nota: O comando 'npm create trest' não funciona diretamente porque
# o npm procura por um pacote separado chamado 'create-trest' no npm registry.
# Use 'npx create-trest-app' que funciona imediatamente!

# Fazer deploy
cd meu-projeto
vercel --prod
```

**Estrutura Criada:**
```
meu-projeto/
├── api/
│   └── index.js          # Serverless function adapter
├── app.trest             # Arquivo principal da aplicação
├── vercel.json           # Configuração Vercel
├── package.json          # Com treste@^2.5.1
├── .gitignore
└── README.md             # Com instruções de deploy
```

**Melhorias no create-trest-app:**
- ✅ **Detecção Automática de Versão** - Detecta versão atual do Trest automaticamente
- ✅ **Template Completo** - Inclui template completo de `api/index.js` otimizado
- ✅ **README Detalhado** - README com instruções completas de deploy
- ✅ **Configuração Vercel** - `vercel.json` configurado com timeout adequado

**Compatibilidade:**
- Versão Anterior: 2.5.0
- Nova Versão: 2.5.1
- **Totalmente compatível** - Nenhuma mudança incompatível

Para mais informações sobre deploy na Vercel, consulte [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md).

### 🆕 Novidades da Versão 2.5.0

A versão 2.5.0 traz melhorias significativas na biblioteca padrão, correções importantes no sistema de módulos e novas funcionalidades no servidor HTTP:

**Melhorias na Biblioteca Padrão - Aliases em Inglês:**
- ✅ **FileSystem Module** - Adicionados aliases em inglês para todas as funções: `readFile`, `writeFile`, `exists`, `deleteFile`, `listDir`, `createDir`, `deleteDir`, `getStats` (além dos nomes em cirílico)
- ✅ **Crypto Module** - Adicionados aliases em inglês: `randomBytes`, `encrypt`, `decrypt` (além dos nomes em cirílico)
- ✅ **Array Module** - Adicionada função `длина` (length) ao moduleMap
- ✅ **String Module** - Adicionadas funções `разделить` (split) e `заменить` (replace) ao moduleMap

**Correções Críticas:**
- ✅ **Indexação em Objetos** - Corrigido `evaluateAssignment` para permitir indexação em objetos (ex: `obj["key"] = value`), não apenas arrays
- ✅ **Mensagens de Erro Melhoradas** - Mensagens de erro para MemberExpression agora mostram o nome correto da função quando ocorre erro
- ✅ **Módulos Padrão Funcionais** - Todos os módulos std agora funcionam corretamente quando importados com `импорт * как ModuleName измодуля "std/modulename"`

**Novas Funcionalidades no Servidor HTTP:**
- ✅ **Rotas Dinâmicas com Parâmetros** - Suporte completo para rotas com parâmetros dinâmicos (ex: `/api/users/:id`, `/api/admin/comments/:id`)
- ✅ **Extração Automática de Parâmetros** - Parâmetros de rota são extraídos automaticamente e disponibilizados em `запрос.params`
- ✅ **Compatibilidade com Rotas Exatas** - Rotas exatas continuam funcionando normalmente

**Exemplo de Uso de Rotas Dinâmicas:**
```trest
# Rota com parâmetro :id
servidor.post("/api/admin/comments/:id", функция(запрос, ответ) {
    пусть id = запрос.params.id  # Parâmetro extraído automaticamente
    # ... código ...
})
```

**Correções de Compatibilidade:**
- ✅ **Módulos FileSystem, Crypto, Array, String** - Todos os módulos agora funcionam tanto com nomes em cirílico quanto em inglês
- ✅ **Indexação de Objetos** - Corrigido problema onde `sessions[token] = value` não funcionava

**Compatibilidade:**
- Versão Anterior: 2.4.9
- Nova Versão: 2.5.0
- **Totalmente compatível** - Nenhuma mudança incompatível

> **Nota:** Esta seção documenta a versão 2.5.0. Para as novidades mais recentes, veja [Novidades da Versão 2.5.1](#novidades-da-versão-251).

### 📋 Versão Anterior (2.4.9)

A versão 2.4.9 traz correções críticas no sistema de compilação para executáveis, melhorias significativas na biblioteca padrão e correção de todas as limitações conhecidas:

**Melhorias na Compilação de Executáveis:**
- ✅ **Wrapper Robusto** - Novo wrapper com tratamento completo de erros e gerenciamento de ciclo de vida do processo
- ✅ **Detecção Automática de GUI/Server** - O wrapper detecta automaticamente se o programa usa GUI ou servidor HTTP e ajusta o comportamento
- ✅ **Tratamento de Erros Melhorado** - Handlers para `uncaughtException` e `unhandledRejection` garantem que erros sejam exibidos corretamente
- ✅ **Gerenciamento de Ciclo de Vida** - Para programas simples, aguarda 500ms antes de fechar (permite operações assíncronas completarem)
- ✅ **Executáveis Funcionais** - Corrigido problema onde executáveis abriam e fechavam imediatamente

**Melhorias na Biblioteca Padrão:**
- ✅ **Módulos Math, String e Array Nativos** - Implementações nativas adicionadas ao interpreter para melhor performance
- ✅ **Suporte Completo aos Módulos** - Todos os módulos std agora funcionam corretamente via import
- ✅ **Aliases de Palavras-chave** - Suporte adicional para `константа` e `вариавель` como aliases

**Melhorias na Interface Gráfica (GUI):**
- ✅ **Detecção Automática de GUI** - O CLI detecta automaticamente quando um arquivo usa GUI e executa via Electron
- ✅ **Execução Transparente** - Aplicações GUI executam automaticamente através do Electron sem necessidade de comandos especiais
- ✅ **Método `manterRodando()`** - Função corrigida e exportada corretamente no módulo GUI
- ✅ **Suporte Completo ao Electron** - Detecção automática do caminho do Electron no Windows

**Correções Críticas:**
- ✅ **Keyword `из` Reconhecida** - Corrigido reconhecimento da palavra-chave `из` (of) no lexer
- ✅ **Importação de Módulos** - Correção no sistema de importação para garantir que módulos sejam carregados corretamente
- ✅ **Sintaxe de Constantes** - Corrigido uso de `конст` (const) nos testes
- ✅ **Carregamento de Módulos Nativos** - Correção no carregamento de módulos `std/` para sempre priorizar implementações nativas
- ✅ **Compatibilidade Windows** - Melhorias na detecção e execução do Electron no Windows

**Limitações Corrigidas (100% Funcional):**
- ✅ `for...of` e `for...in` - CORRIGIDO E FUNCIONANDO
- ✅ Atribuição direta a índices de array (`arr[0] = valor`) - CORRIGIDO E FUNCIONANDO
- ✅ Classes com `это` (this) em MemberExpression - CORRIGIDO E FUNCIONANDO

**Testes e Qualidade:**
- ✅ **Suite Completa de Testes** - Criada suite de 13 testes cobrindo todas as funcionalidades principais
- ✅ **Relatório de Testes** - Documento completo com status de todos os testes
- ✅ **100% dos Testes Passando** - Todos os 13 testes funcionando completamente
- ✅ **Todas as Limitações Corrigidas** - for...of, for...in, atribuição a arrays e classes com `это` funcionando

**Compatibilidade:**
- Versão Anterior: 2.4.8
- Nova Versão: 2.4.9
- **Totalmente compatível** - Nenhuma mudança incompatível

**Melhorias na Interface Gráfica (GUI):**
- ✅ **Detecção Automática de GUI** - O CLI detecta automaticamente quando um arquivo usa GUI e executa via Electron
- ✅ **Execução Transparente** - Aplicações GUI executam automaticamente através do Electron sem necessidade de comandos especiais
- ✅ **Método `manterRodando()`** - Função corrigida e exportada corretamente no módulo GUI
- ✅ **Suporte Completo ao Electron** - Detecção automática do caminho do Electron no Windows
- ✅ **Correções de Carregamento de Módulos** - Garantia de que módulos nativos sempre têm prioridade sobre arquivos `.trest`

**Melhorias no CLI:**
- ✅ **Detecção Inteligente de GUI** - Detecta uso de GUI através de padrões no código
- ✅ **Execução via Electron Automática** - Quando GUI é detectada, o código executa automaticamente via Electron
- ✅ **Correções de Caminhos** - Correção do caminho do Electron para funcionar em todos os sistemas operacionais

**Correções:**
- ✅ **Carregamento de Módulos Nativos** - Correção no carregamento de módulos `std/` para sempre priorizar implementações nativas
- ✅ **Exportação de Métodos GUI** - Todos os métodos do módulo GUI agora são exportados corretamente
- ✅ **Compatibilidade Windows** - Melhorias na detecção e execução do Electron no Windows

**Exemplos Adicionados:**
- ✅ **Exemplo GUI Desktop** - Exemplo completo de aplicação GUI desktop em `exemplos/exemplo_gui.trest`

### 📋 Versão Anterior (2.4.8)

A versão 2.4.8 torna a API HTTP mais robusta e confiável:

**Melhorias Críticas na API HTTP:**
- ✅ **Sistema de Módulos Nativos** - Módulos `std/` sempre usam implementações nativas (mais robustas e performáticas)
- ✅ **Date.timestamp()** - Nova função para obter timestamp em milissegundos
- ✅ **Tratamento de Erros Robusto** - Handlers envolvidos em try-catch, erros 500 retornam JSON formatado
- ✅ **Método `use()`** - Suporte a rotas wildcard (`*`) para catch-all e middlewares
- ✅ **Parsing de Body Melhorado** - Detecção automática e parsing seguro de JSON
- ✅ **Validação de Headers** - Proteção contra envio duplo de headers
- ✅ **Respostas JSON Formatadas** - JSON indentado (2 espaços) para melhor legibilidade
- ✅ **Objeto Request Aprimorado** - Propriedade `ip` adicionada, `method` com fallback
- ✅ **Objeto Response Aprimorado** - Método `header()` para headers customizados
- ✅ **404 Automático** - Respostas 404 em JSON formatado com timestamp

**Correções:**
- ✅ **Parsing de Query Parameters** - Correção no parsing de query parameters da URL
- ✅ **Indexação de Objetos** - Melhor tratamento de `null` em indexação
- ✅ **Conversão de Números** - Função de conversão sem dependência de `Number` ou `isNaN`

**Exemplos Adicionados:**
- ✅ **API Calculadora** - Exemplo completo em `exemplos/api_calculadora.trest`

### 📋 Versão Anterior (2.4.7)

A versão 2.4.7 implementa funcionalidades críticas que tornam Trest ainda mais funcional e prático:

**Principais adições:**
- ✅ **IO.читать() Totalmente Funcional** - Leitura síncrona de entrada do usuário implementada com `readline-sync`
- ✅ **Correções de Sintaxe** - Objetos literais usam `=` em vez de `:` (conforme sintaxe Trest)
- ✅ **Servidor HTTP Completo** - Suporte total a rotas GET, POST, PUT, DELETE com handlers
- ✅ **Conversão Automática de Funções** - Funções Trest convertidas automaticamente para JavaScript quando passadas para métodos nativos
- ✅ **Exemplo de Site Web** - Exemplo completo de site web em `exemplos/site_web.trest`

**Melhorias:**
- ✅ Melhor integração entre funções Trest e código nativo JavaScript
- ✅ Suporte completo a callbacks Trest em métodos nativos
- ✅ Documentação expandida com exemplos práticos

### 📋 Versão Anterior (2.4.6)

A versão 2.4.6 trouxe funcionalidades poderosas:
- ✅ **Classes e OOP Completo** - Suporte total a classes, herança e instanciação
- ✅ **For...of e For...in** - Loops modernos para iterar arrays e objetos
- ✅ **Operadores Compostos** - Atribuição com operação em uma única expressão
- ✅ **Funções Anônimas** - Funções sem nome para maior flexibilidade
- ✅ **Validação de Constantes** - Proteção contra reatribuição de constantes

### 🔒 Nota de Segurança

A versão 2.4.4 incluiu correções importantes de segurança na cadeia de suprimentos. A versão 2.4.7 mantém todas essas melhorias:

**Correções de segurança:**
- ✅ Scripts de instalação automáticos removidos
- ✅ Acesso ao shell durante instalação removido
- ✅ Melhorias na segurança do pacote NPM

---

*Documentação completa e atualizada. Para questões ou sugestões, visite: https://trest-site.vercel.app*
