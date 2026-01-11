# 🚀 Create Trest App

Comando para criar novos projetos Trest otimizados para Vercel, similar ao `create-next-app` do Next.js.

## 📋 Descrição

O `create-trest-app` (ou `create-treste-app`) cria um novo projeto Trest otimizado para deploy na Vercel com:
- Estrutura Vercel-ready (`api/`, `app.trest`)
- Adapter para serverless functions (`api/index.js`)
- Configuração Vercel (`vercel.json`)
- Arquivo principal (`app.trest`)
- `package.json` configurado com scripts e dependências
- `README.md` com instruções de deploy
- `.gitignore` configurado
- Instalação local do Trest Language (versão mais recente - 2.5.1)

## ⚙️ Requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🚀 Como Usar

### Opção 1: Usando npx (Recomendado)

```bash
npx create-trest-app meu-projeto
```

ou

```bash
npx create-treste-app meu-projeto
```

### Opção 2: Se já tiver instalado globalmente

```bash
npm install -g treste@latest
create-trest-app meu-projeto
```

### Opção 3: Sem especificar nome (Modo Interativo)

```bash
npx create-trest-app
```

O comando perguntará o nome do projeto interativamente.

## 📁 Estrutura Criada

Após executar o comando, será criada a seguinte estrutura otimizada para Vercel:

```
meu-projeto/
├── api/
│   └── index.js            # Serverless function adapter para Vercel
├── app.trest               # Arquivo principal da aplicação
├── vercel.json             # Configuração Vercel
├── package.json            # Configuração do projeto com scripts
├── README.md               # Documentação do projeto com instruções de deploy
└── .gitignore              # Arquivos ignorados pelo Git
```

## 📝 Scripts Disponíveis

O `package.json` criado inclui os seguintes scripts:

```json
{
  "scripts": {
    "start": "trest app.trest",
    "dev": "trest app.trest --verbose",
    "build": "echo \"Build não necessário - Vercel faz isso automaticamente\"",
    "deploy": "vercel --prod"
  },
  "dependencies": {
    "treste": "^2.5.1"
  }
}
```

### Executar o projeto localmente:

```bash
cd meu-projeto
npm start
```

### Modo desenvolvimento (verbose):

```bash
npm run dev
```

### Deploy na Vercel:

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Fazer deploy
vercel

# Para produção
vercel --prod
```

Para mais informações sobre deploy na Vercel, consulte [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md).

## 🔧 Características

### Instalação Local

O comando instala automaticamente o `treste` localmente na pasta do projeto, garantindo:
- ✅ Versão sempre atualizada
- ✅ Projeto independente (não depende da instalação global)
- ✅ Compatibilidade garantida com a versão especificada
- ✅ Possibilidade de ter diferentes versões em diferentes projetos

### Validação de Nome

O nome do projeto deve:
- ✅ Conter apenas letras, números, hífens (`-`) e underscores (`_`)
- ✅ Não começar com número
- ✅ Não estar vazio

Exemplos válidos:
- `meu-projeto`
- `calculadora_app`
- `app123`
- `projeto-trest`

Exemplos inválidos:
- `123projeto` (começa com número)
- `projeto@especial` (caracteres especiais não permitidos)
- `projeto com espaços` (espaços não permitidos)

## 📚 Exemplos de Uso

### Criar um novo projeto:

```bash
npx create-trest-app calculadora
cd calculadora
npm start
```

### Criar projeto para API:

```bash
npx create-trest-app minha-api
cd minha-api
npm run dev
```

### Criar projeto para desktop:

```bash
npx create-trest-app app-desktop
cd app-desktop
npm run build:exe
```

## ⚠️ Notas Importantes

1. **Instalação Local**: O Trest é instalado localmente no projeto, não globalmente.
2. **Versão Atualizada**: Sempre instala a versão mais recente do `treste` do npm.
3. **Independência**: Cada projeto tem sua própria instalação do Trest.
4. **Pasta Existente**: Se a pasta já existir, o comando exibirá um erro.

## 🔄 Atualizar Projeto

Para atualizar o Trest em um projeto existente:

```bash
cd meu-projeto
npm install treste@latest
```

## 📖 Documentação Adicional

- [Documentação Completa](../DOCUMENTACAO_COMPLETA.md)
- [Guia de Instalação](../INSTALL.md)
- [Site Oficial](https://trest-site.vercel.app)

## 🐛 Solução de Problemas

### Erro: "Nome do projeto inválido"

Verifique se o nome segue as regras de validação acima.

### Erro: "Pasta já existe"

Escolha outro nome ou remova a pasta existente.

### Erro ao instalar treste

Verifique sua conexão com a internet e se o npm está funcionando corretamente:

```bash
npm install treste@latest
```

---

**Versão**: 2.5.1  
**Criado com**: ❤️ usando Trest Language

## 🚀 Deploy na Vercel

Projetos criados com `create-trest-app` já vêm configurados e prontos para deploy na Vercel:

1. **Estrutura Completa** - Inclui `api/index.js` (adapter para serverless functions) e `vercel.json` (configuração)
2. **Versão Atualizada** - Instala automaticamente a versão mais recente do Trest (2.5.1)
3. **Deploy Simples** - Execute `vercel --prod` e seu projeto estará no ar!

Para detalhes completos sobre deploy na Vercel, consulte [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md).
