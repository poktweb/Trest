# 🧮 API Calculadora - Trest Language

API REST simples que recebe dois números via query parameters e retorna todas as operações matemáticas básicas.

## 🚀 Como Executar

```bash
trest exemplos/api_calculadora.trest
```

O servidor será iniciado na porta **3001**.

## 📋 Endpoints

### GET `/calc`

Realiza operações matemáticas (soma, subtração, multiplicação e divisão) com dois números.

**Parâmetros:**
- `num1` ou `calc1` - Primeiro número
- `num2` ou `calc2` - Segundo número

**Exemplos:**

```
http://localhost:3001/calc?num1=10&num2=5
http://localhost:3001/calc?calc1=10&calc2=5
```

**Resposta JSON:**

```json
{
  "sucesso": true,
  "entrada": {
    "num1": 10,
    "num2": 5
  },
  "operacoes": {
    "soma": 15,
    "subtracao": 5,
    "multiplicacao": 50,
    "divisao": 2,
    "divisaoErro": ""
  },
  "timestamp": 1234567890
}
```

**Erro (parâmetros inválidos):**

```json
{
  "erro": true,
  "mensagem": "Parâmetros inválidos. Use: /calc?num1=2&num2=2 ou /calc?calc1=2&calc2=2",
  "exemplo": "http://localhost:3001/calc?num1=10&num2=5"
}
```

**Divisão por zero:**

Quando `num2` for 0, a resposta incluirá um aviso:

```json
{
  "sucesso": true,
  "entrada": {
    "num1": 10,
    "num2": 0
  },
  "operacoes": {
    "soma": 10,
    "subtracao": 10,
    "multiplicacao": 0,
    "divisao": 0,
    "divisaoErro": "Divisão por zero não é permitida"
  },
  "aviso": "Divisão por zero não é permitida",
  "timestamp": 1234567890
}
```

### GET `/`

Documentação da API em HTML.

## 🛠️ Funcionalidades

- ✅ Suporte a query parameters (`num1`/`num2` ou `calc1`/`calc2`)
- ✅ Validação de parâmetros
- ✅ Tratamento de divisão por zero
- ✅ Respostas em JSON formatado
- ✅ Documentação HTML integrada

## 📝 Notas Técnicas

Esta API demonstra:
- Criação de servidor HTTP em Trest
- Parsing de query parameters
- Validação de entrada
- Tratamento de erros
- Respostas JSON estruturadas

**Versão:** 2.4.7-1 (com melhorias no parsing de query parameters)
