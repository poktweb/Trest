# 🌐 Site Web em Trest

Exemplo completo de site web usando o módulo HTTP do Trest Language.

## 📋 Descrição

Este exemplo demonstra como criar um servidor web completo em Trest com:

- ✅ Múltiplas rotas HTML
- ✅ API REST com JSON
- ✅ Páginas estilizadas com CSS
- ✅ Tratamento de rotas 404
- ✅ Servidor HTTP completo

## 🚀 Como Executar

```bash
# A partir da raiz do projeto
trest exemplos/site_web.trest
```

Ou se estiver instalado globalmente:

```bash
trest exemplos/site_web.trest
```

## 🌐 Rotas Disponíveis

### Páginas HTML

- **GET /** - Página inicial do site
- **GET /sobre** - Página sobre o Trest Language
- **GET /api** - Documentação da API
- **GET /contato** - Página de contato

### API REST (JSON)

- **GET /api/usuarios** - Lista de usuários em formato JSON
- **GET /api/status** - Status do servidor em formato JSON

### Tratamento de Erros

- Qualquer outra rota retorna **404** com página de erro personalizada

## 📝 Estrutura do Código

```trest
# 1. Importar módulos
импорт * как HTTP измодуля "std/http"

# 2. Criar servidor
пусть servidor = HTTP.создатьСервер()

# 3. Definir rotas
servidor.get("/", функция(запрос, ответ) {
    ответ.send(obterHTMLInicial())
})

# 4. Iniciar servidor
servidor.listen(3000, функция() {
    печать("Servidor iniciado na porta 3000")
})
```

## 🎨 Funcionalidades

- **HTML com CSS inline** - Design moderno e responsivo
- **Rotas RESTful** - API JSON completa
- **Logging** - Registro de todas as requisições
- **Tratamento de erros** - Página 404 personalizada

## 📖 Exemplo de Resposta JSON

```json
// GET /api/usuarios
[
    { "id": 1, "nome": "Иван", "idade": 30, "cidade": "Москва" },
    { "id": 2, "nome": "Мария", "idade": 25, "cidade": "Санкт-Петербург" },
    { "id": 3, "nome": "Петр", "idade": 35, "cidade": "Новосибирск" }
]

// GET /api/status
{
    "servidor": "Trest Language Web Server",
    "versao": "2.4.6",
    "status": "online",
    "porta": 3000,
    "timestamp": 1234567890123
}
```

## 💡 Dicas

- O servidor roda na porta **3000** por padrão
- Pressione **Ctrl+C** para parar o servidor
- Abra **http://localhost:3000** no navegador para acessar
- Todas as requisições são logadas no console

## 🔧 Personalização

Você pode facilmente personalizar:

- Mudar a porta alterando a variável `PORTA`
- Adicionar novas rotas usando `servidor.get()`, `servidor.post()`, etc.
- Modificar o HTML nas funções `obterHTML*()`
- Adicionar mais endpoints da API JSON

## 📚 Documentação Completa

Para mais informações sobre o módulo HTTP e outros recursos do Trest, consulte:

- `DOCUMENTACAO_COMPLETA.md` - Documentação completa da linguagem
- `README.md` - Guia rápido de início
