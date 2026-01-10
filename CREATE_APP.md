# 🚀 Create Trest App

Comando para criar novos projetos Trest localmente, similar ao `create-next-app` do Next.js.

## 📋 Descrição

O `create-trest-app` (ou `create-treste-app`) cria um novo projeto Trest em uma pasta local com:
- Estrutura básica de pastas (`src/`, `exemplos/`)
- Arquivo principal (`src/main.trest`)
- Arquivo de exemplo (`exemplos/exemplo.trest`)
- `package.json` configurado com scripts úteis
- `README.md` com instruções
- `.gitignore` configurado
- Instalação local do Trest Language (versão atualizada)

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

Após executar o comando, será criada a seguinte estrutura:

```
meu-projeto/
├── src/
│   └── main.trest          # Arquivo principal da aplicação
├── exemplos/
│   └── exemplo.trest       # Exemplos de código Trest
├── package.json            # Configuração do projeto com scripts
├── README.md              # Documentação do projeto
└── .gitignore            # Arquivos ignorados pelo Git
```

## 📝 Scripts Disponíveis

O `package.json` criado inclui os seguintes scripts:

```json
{
  "scripts": {
    "start": "trest src/main.trest",
    "dev": "trest src/main.trest --verbose",
    "build": "trestc src/main.trest --mode web --output dist/app.js",
    "build:exe": "trestc src/main.trest --mode exe --output dist/app.exe"
  }
}
```

### Executar o projeto:

```bash
cd meu-projeto
npm start
```

### Modo desenvolvimento (verbose):

```bash
npm run dev
```

### Compilar para JavaScript:

```bash
npm run build
```

### Compilar para executável:

```bash
npm run build:exe
```

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

**Versão**: 2.4.9  
**Criado com**: ❤️ usando Trest Language
