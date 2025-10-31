# Arquitetura e Funcionamento da Linguagem Trest

## 🏗️ Visão Geral

A linguagem Trest funciona em **4 estágios principais**:

1. **Lexer (Análise Léxica)** - Converte código fonte em tokens
2. **Parser (Análise Sintática)** - Constrói a Árvore Sintática Abstrata (AST)
3. **Interpreter (Execução)** - Executa o código diretamente
4. **Compiler (Compilação)** - Gera código para Web (.js) ou Desktop (.exe)

## 📊 Fluxo de Execução

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

## 🔍 Estágio 1: Lexer (Análise Léxica)

**Arquivo:** `src/lexer.ts`

O Lexer é responsável por **tokenizar** o código fonte, convertendo texto em tokens.

### Como Funciona:

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

### Exemplo:

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

## 🌳 Estágio 2: Parser (Análise Sintática)

**Arquivo:** `src/parser.ts`

O Parser constrói a **Árvore Sintática Abstrata (AST)** a partir dos tokens.

### Como Funciona:

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

### Exemplo:

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

## ⚙️ Estágio 3: Interpreter (Interpretador)

**Arquivo:** `src/interpreter.ts`

O Interpreter **executa** a AST diretamente, sem compilar.

### Como Funciona:

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

### Exemplo de Execução:

**AST:**
```javascript
{
  type: 'Program',
  body: [
    {
      type: 'VariableDeclaration',
      kind: 'let',
      name: 'x',
      value: { type: 'Literal', value: 10 }
    },
    {
      type: 'PrintStatement',
      arguments: [{ type: 'Identifier', name: 'x' }]
    }
  ]
}
```

**Execução:**
1. Cria variável `x = 10` no ambiente global
2. Avalia expressão `x` → retorna `10`
3. Chama `console.log(10)` → imprime "10"

## 🏗️ Estágio 4: Compiler (Compilação)

### 4.1 Compilador Web

**Arquivo:** `src/compiler/web.ts`

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

### 4.2 Compilador Executável

**Arquivo:** `src/compiler/exe.ts`

Cria executáveis `.exe` standalone.

**Como Funciona:**
1. Compila para JavaScript (usando WebCompiler)
2. Cria wrapper Node.js
3. Usa `pkg` para criar executável
4. Inclui todas as dependências

**Resultado:**
- Arquivo `.exe` que não requer Node.js instalado
- Auto-contido (todas as dependências incluídas)

## 📦 Sistema de Módulos

**Arquivo:** `src/module.ts`

Permite importar/exportar código entre arquivos.

### Como Funciona:

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

## 🔧 Biblioteca Padrão (std)

**Localização:** `src/std/`

Módulos prontos para uso comuns:

- **math.trest** - Funções matemáticas (abs, max, min, sqrt, etc.)
- **string.trest** - Manipulação de strings (tamanho, maiuscula, etc.)
- **array.trest** - Operações com arrays (adicionar, remover, ordenar, etc.)
- **io.trest** - Operações de I/O (lerArquivo, escreverArquivo, etc.)

## 🎯 Fluxo Completo de Exemplo

### Código Trest:
```trest
функция приветствие(имя) {
    вернуть "Привет, " + имя
}

пусть сообщение = приветствие("Trest")
печать(сообщение)
```

### 1. Lexer produz tokens:
```javascript
[FUNC, IDENTIFIER('приветствие'), LPAREN, IDENTIFIER('имя'), RPAREN, 
 LBRACE, RETURN, STRING('Привет, '), PLUS, IDENTIFIER('имя'), RBRACE, ...]
```

### 2. Parser constrói AST:
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

### 3a. Interpreter executa:
1. Cria função `приветствие` no ambiente global
2. Avalia chamada `приветствие("Trest")` → `"Привет, Trest"`
3. Atribui resultado a `сообщение`
4. Imprime `"Привет, Trest"`

### 3b. Compiler gera JavaScript:
```javascript
(function() {
  function приветствие(имя) {
    return "Привет, " + имя;
  }
  let сообщение = приветствие("Trest");
  console.log(сообщение);
})();
```

## 🔄 Diferenças: Interpreter vs Compiler

### Interpreter (Execução Direta)
- ✅ Mais rápido para desenvolvimento
- ✅ Erros mais fáceis de depurar
- ❌ Mais lento em execução
- ❌ Requer runtime (Node.js)

### Compiler (Compilação)
- ✅ Execução mais rápida
- ✅ Pode otimizar código
- ✅ Gera código standalone (.exe)
- ❌ Processo mais longo
- ❌ Depuração mais difícil

## 🛠️ Recursos Especiais

### 1. Suporte a Unicode
- Identificadores podem usar cirílico, latim e caracteres especiais
- Palavras-chave em múltiplos idiomas

### 2. Tipagem Dinâmica
- Tipos inferidos em tempo de execução
- Conversões automáticas quando apropriado

### 3. Closures
- Funções capturam variáveis do escopo onde foram definidas
- Permite programação funcional avançada

### 4. Tratamento de Erros
- Try/Catch/Throw completo
- Erros formatados com linha e coluna

### 5. Sistema de Escopo
- Block scope para `let` e `const`
- Function scope para `var`
- Escopo global para declarações de nível superior

## 📝 Exemplo Completo

Veja `src/cli.ts` para o ponto de entrada:

```typescript
// 1. Lê arquivo
const code = fs.readFileSync(filePath, 'utf-8');

// 2. Tokeniza
const lexer = new Lexer(code);
const tokens = lexer.tokenize();

// 3. Faz parse
const parser = new Parser(tokens);
const program = parser.parse();

// 4. Executa ou compila
const interpreter = new Interpreter();
interpreter.interpret(program);
```

Este é o fluxo completo que acontece quando você executa `trest programa.trest`!

