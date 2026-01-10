# 📦 Guia de Instalação - Trest Language

Este guia fornece instruções detalhadas para instalar e usar o Trest Language em diferentes cenários.

## 📋 Pré-requisitos

Antes de instalar o Trest, certifique-se de ter:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

Verifique suas versões:
```bash
node --version
npm --version
```

Se você não tem o Node.js instalado, baixe em: https://nodejs.org/

## 🚀 Instalação

### Opção 1: Instalação Global (Recomendado)

Instale o Trest globalmente para ter acesso aos comandos `trest` e `trestc` em qualquer lugar:

```bash
npm install -g treste
```

**Verifique a instalação:**
```bash
trest --version
trestc --version
```

**Uso:**
```bash
trest arquivo.trest
trestc arquivo.trest --mode web
```

### Opção 2: Criar Novo Projeto com create-trest-app (Recomendado para Novos Projetos)

Crie um novo projeto Trest localmente com estrutura completa:

```bash
npx create-trest-app meu-projeto
```

ou

```bash
npx create-treste-app meu-projeto
```

Isso criará:
- ✅ Estrutura de pastas (`src/`, `exemplos/`)
- ✅ Arquivo principal (`src/main.trest`)
- ✅ Exemplo de código (`exemplos/exemplo.trest`)
- ✅ `package.json` configurado com scripts
- ✅ `README.md` com instruções
- ✅ Instalação local do Trest (versão atualizada)

**Entrar no projeto e executar:**
```bash
cd meu-projeto
npm start
```

Veja [CREATE_APP.md](CREATE_APP.md) para mais informações.

### Opção 3: Instalação Local em Projeto Existente

Para usar o Trest em um projeto já existente:

```bash
npm install treste
```

**Uso via npx:**
```bash
npx trest arquivo.trest
npx trestc arquivo.trest --mode web
```

### Opção 4: Instalação a partir do Código Fonte

Se você quer contribuir ou customizar o Trest:

```bash
# Clone o repositório
# Baixar o código-fonte do projeto
cd trest

# Instale as dependências
npm install

# Compile o projeto
npm run build

# (Opcional) Linke globalmente para testes
npm link
```

## 🎯 Verificação da Instalação

Após instalar, teste com um arquivo de exemplo:

```bash
# Verificar versão
trest --version

# Ver ajuda
trest --help

# Executar exemplo
trest exemplos/hello_cyrillic.trest
```

## 🔧 Configuração

### Arquivo de Configuração

O Trest cria automaticamente um arquivo `.trestrc` na primeira execução:

```json
{
  "version": "2.4.9",
  "compiler": {
    "web": {
      "minify": false,
      "bundle": true
    },
    "exe": {
      "minify": false,
      "standalone": true
    }
  },
  "runtime": {
    "strictMode": false,
    "debugMode": false
  }
}
```

### Variáveis de Ambiente (Opcional)

Você pode configurar variáveis de ambiente:

```bash
# Modo debug global
export TREST_DEBUG=true

# Caminho para módulos std customizados
export TREST_STD_PATH=/caminho/para/std
```

## 🐛 Resolução de Problemas

### Erro: "command not found: trest"

**Causa:** Instalação global não funcionou ou PATH não está configurado.

**Solução:**
```bash
# Reinstalar globalmente
npm install -g treste

# Verificar local de instalação global
npm config get prefix

# Adicionar ao PATH (Linux/Mac)
export PATH=$PATH:$(npm config get prefix)/bin
```

### Erro: "Node version too old"

**Causa:** Versão do Node.js é menor que 18.

**Solução:** Atualize o Node.js:
```bash
# Usando nvm (recomendado)
nvm install 18
nvm use 18

# Ou baixe do site oficial
# https://nodejs.org/
```

### Erro: "Permission denied"

**Causa:** Sem permissões para instalar globalmente.

**Soluções:**

**Linux/Mac:**
```bash
# Usar sudo (não recomendado)
sudo npm install -g treste

# Ou configurar npm para não usar sudo
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

**Windows:** Execute o PowerShell como Administrador

### Binários não encontrados após build

**Solução:**
```bash
# Limpar e reconstruir
npm run clean
npm run build

# Verificar se os arquivos existem
ls dist/cli.js dist/compiler.js
```

## 🔄 Atualização

Para atualizar para a versão mais recente:

```bash
# Global
npm update -g treste

# Local
npm update treste

# Verificar versão
trest --version
```

## 🗑️ Desinstalação

Para remover o Trest:

```bash
# Desinstalar globalmente
npm uninstall -g treste

# Desinstalar localmente
npm uninstall treste
```

## 📚 Próximos Passos

Depois de instalar, consulte:

- [README.md](README.md) - Visão geral do projeto
- [CREATE_APP.md](CREATE_APP.md) - Como criar novos projetos com `create-trest-app`
- [DOCUMENTACAO_COMPLETA.md](DOCUMENTACAO_COMPLETA.md) - Documentação completa unificada

## 💡 Dicas

1. **Use `--verbose`** para ver detalhes da execução:
   ```bash
   trest arquivo.trest --verbose
   ```

2. **Use `--debug`** para debugging detalhado:
   ```bash
   trest arquivo.trest --debug
   ```

3. **Use `--strict`** para erros mais informativos:
   ```bash
   trest arquivo.trest --strict
   ```

4. **Para compilação de produção:**
   ```bash
   trestc app.trest --mode web --minify
   ```

## 🤝 Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para informações sobre como contribuir.

## 📞 Suporte

Se você encontrar problemas:

1. Verifique a seção de resolução de problemas acima
2. Consulte a documentação em https://trest-site.vercel.app
3. Abra uma nova issue se necessário

## 📄 Licença

MIT - veja [LICENSE](LICENSE) para mais detalhes.

