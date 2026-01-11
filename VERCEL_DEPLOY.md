# Deploy Trest na Vercel

Este guia explica como fazer deploy de aplicações Trest na Vercel usando serverless functions.

## 📋 Pré-requisitos

1. Projeto Trest compilado (`npm run build`)
2. Conta na Vercel
3. Arquivo `.trest` com sua aplicação

## 🚀 Passo a Passo

### 1. Preparar o Projeto

Certifique-se de que o projeto está compilado:

```bash
npm run build
```

### 2. Criar Arquivo Principal

Crie um arquivo `app.trest` na raiz do projeto com sua aplicação Trest:

```trest
импорт * как HTTP измодуля "std/http"

пусть servidor = HTTP.создатьСервер()

servidor.get("/", функция(запрос, ответ) {
    ответ.status(200)
    ответ.send("<h1>Olá da Vercel!</h1>")
})

servidor.get("/api/hello", функция(запрос, ответ) {
    ответ.json({ message = "Hello from Trest!" })
})

servidor.post("/api/echo", функция(запрос, ответ) {
    ответ.json({ received = запрос.body })
})

servidor.listen(3000, функция() {
    печать("✅ Servidor inicializado (modo Vercel)")
})
```

### 3. Configurar vercel.json

O arquivo `vercel.json` já está configurado para rotear todas as requisições para `api/index.js`.

### 4. Estrutura de Pastas

```
projeto/
├── api/
│   └── index.js          # Serverless function adapter
├── app.trest             # Sua aplicação Trest
├── dist/                 # Código compilado do Trest
├── package.json
├── vercel.json           # Configuração Vercel
└── ...
```

### 5. Deploy

#### Opção A: Via CLI da Vercel

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Fazer deploy
vercel

# Para produção
vercel --prod
```

#### Opção B: Via GitHub/GitLab

1. Conecte seu repositório na Vercel
2. Configure o projeto (Vercel detectará automaticamente)
3. Faça deploy

### 6. Ajustar Caminho do Arquivo (se necessário)

Se você quiser usar um arquivo diferente de `app.trest`, edite `api/index.js` e altere:

```javascript
const TREST_FILE = path.join(__dirname, '../app.trest');
```

Para:

```javascript
const TREST_FILE = path.join(__dirname, '../seu-arquivo.trest');
```

## 📝 Notas Importantes

### Rotas Dinâmicas

Rotas com parâmetros funcionam normalmente:

```trest
servidor.get("/api/users/:id", функция(запрос, ответ) {
    пусть userId = запрос.params.id
    ответ.json({ userId = userId })
})
```

### Body Parsing

A Vercel faz parse automático do body JSON. O adapter converte automaticamente para o formato esperado pelo Trest.

### Variáveis de Ambiente

Use variáveis de ambiente da Vercel normalmente:

```trest
импорт * как Process измодуля "std/process"

пусть apiKey = Process.переменнаяОкружения("API_KEY")
```

### Limitações

- **GUI/Election**: Não funciona na Vercel (serverless não suporta GUI)
- **WebSockets**: Não suportado nativamente
- **Long-running processes**: Não recomendado (timeout de 30s no plano Hobby)

### Timeout

O timeout padrão é de 10s no plano Hobby. Pode ser configurado até 30s no `vercel.json`:

```json
{
  "functions": {
    "api/index.js": {
      "maxDuration": 30
    }
  }
}
```

## 🔧 Troubleshooting

### Erro: "Cannot find module '../dist/interpreter'"

Certifique-se de que executou `npm run build` antes do deploy.

### Erro: "File not found: app.trest"

Verifique se o arquivo `app.trest` está na raiz do projeto e o caminho em `api/index.js` está correto.

### Rotas retornando 404

Verifique se as rotas estão definidas corretamente no arquivo `.trest` e se não há erros de sintaxe.

### Erro ao fazer parse do body

O adapter tenta fazer parse automático. Se houver problemas, verifique se o Content-Type está correto (`application/json`).

## 📚 Exemplos

### Exemplo Completo: API REST

```trest
импорт * как HTTP измодуля "std/http"
импорт * как JSON измодуля "std/json"
импорт * как FileSystem измодуля "std/filesystem"

пусть servidor = HTTP.создатьСервер()

# GET - Listar items
servidor.get("/api/items", функция(запрос, ответ) {
    если (FileSystem.exists("data/items.json")) {
        пусть data = FileSystem.readFile("data/items.json")
        пусть items = JSON.parse(data)
        ответ.json(items)
    } иначе {
        ответ.status(404)
        ответ.json({ error = "Items not found" })
    }
})

# POST - Criar item
servidor.post("/api/items", функция(запрос, ответ) {
    пусть newItem = запрос.body
    # ... lógica para salvar item ...
    ответ.status(201)
    ответ.json({ success = true, item = newItem })
})

servidor.listen(3000, функция() {
    печать("✅ API rodando na Vercel")
})
```

## 🎯 Próximos Passos

- Adicione autenticação
- Configure CORS se necessário
- Use variáveis de ambiente para secrets
- Configure domínio personalizado na Vercel
