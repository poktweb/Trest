# 🚀 Como Publicar o Trest Language no npm

Guia passo a passo para publicar o pacote trest-language no npm Registry.

## 📋 Pré-requisitos

1. **Conta no npm**
   - Criar em: https://www.npmjs.com/signup
   - Verificar email

2. **Configuração local**
   ```bash
   npm login
   ```

3. **Verificar namespace**
   - Verificar se `trest-language` está disponível: https://www.npmjs.com/package/trest-language
   - Se já existe, considerar renomear no `package.json`

## 🔧 Passos para Publicação

### 1. Preparar o Ambiente

```bash
# Certificar-se que está no diretório raiz
cd /caminho/para/treste

# Limpar node_modules e reinstalar
npm run clean
npm install
```

### 2. Testar a Build

```bash
# Compilar o projeto
npm run build

# Verificar se tudo funciona
node dist/cli.js --version
node dist/cli.js --help

# Testar compilador
node dist/compiler.js --version
node dist/compiler.js --help
```

### 3. Verificar o Pacote

```bash
# Ver o que será publicado
npm pack --dry-run

# Criar tarball local
npm pack

# Instalar localmente para testar
npm install -g ./trest-language-2.0.0.tgz
```

### 4. Testar Instalação Local

```bash
# Verificar instalação
trest --version
trestc --version

# Testar com exemplos
trest exemplos/hello_cyrillic.trest

# Remover instalação de teste
npm uninstall -g trest-language
```

### 5. Verificar Configurações

```bash
# Verificar package.json
cat package.json | grep -A 5 "name:"
cat package.json | grep -A 3 "version:"

# Verificar .npmignore
cat .npmignore

# Verificar files no package.json
cat package.json | grep -A 10 "files"
```

### 6. Publicar no npm

#### Primeira Publicação

```bash
# Login no npm (se ainda não fez)
npm login

# Publicar
npm publish

# Se for scoped package (ex: @seu-org/trest-language)
npm publish --access public
```

#### Atualizações Futuras

```bash
# Atualizar versão
npm version patch  # 2.0.0 -> 2.0.1
npm version minor  # 2.0.0 -> 2.1.0
npm version major  # 2.0.0 -> 3.0.0

# Ou editar manualmente
# package.json -> "version": "2.0.1"
npm publish
```

### 7. Verificar Publicação

```bash
# Ver no site
# https://www.npmjs.com/package/trest-language

# Ver via CLI
npm view trest-language

# Testar instalação do npm
npm install -g trest-language
trest --version
```

## 📝 Checklist Antes de Publicar

- [ ] Build passa sem erros (`npm run build`)
- [ ] Todos os testes passam (se houver)
- [ ] Version está correta no package.json
- [ ] README está atualizado
- [ ] LICENSE está incluído
- [ ] CHANGELOG está atualizado
- [ ] .npmignore está configurado corretamente
- [ ] "files" no package.json inclui todos os arquivos necessários
- [ ] Nome do pacote não conflita no npm
- [ ] npm login foi feito
- [ ] Credenciais estão corretas
- [ ] Dry-run foi testado
- [ ] Instalação local foi testada

## 🐛 Troubleshooting

### Erro: "You do not have permission"

**Causa:** Você não tem permissão para publicar neste pacote.

**Solução:**
```bash
# Fazer login
npm login

# Verificar usuário atual
npm whoami

# Se necessário, solicitar permissão aos mantenedores
```

### Erro: "Package name already exists"

**Causa:** O nome do pacote já está em uso.

**Solução:**
```bash
# Escolher outro nome no package.json
# Exemplo: trest-lang, trest-compiler, etc.

# Ou usar scoped package
# "@seu-usuario/trest-language"
```

### Erro: "Invalid package name"

**Causa:** Nome do pacote não segue regras do npm.

**Regras:**
- Até 214 caracteres
- Apenas letras minúsculas, números, hífens, underscores
- Não pode começar com hífen ou underscore
- Não pode ter espaços

### Erro: "Repository field is required"

**Causa:** Campo repository vazio no package.json.

**Solução:**
```bash
# Editar package.json e adicionar:
"repository": {
  "type": "git",
  "url": "https://github.com/seu-usuario/trest"
}
```

### Pacote publicado mas não aparece

**Solução:**
```bash
# Aguardar alguns minutos (cache do npm)

# Verificar via CLI
npm view trest-language

# Verificar no site
# https://www.npmjs.com/package/trest-language
```

## 🔐 Segurança

### Tokens e Autenticação

```bash
# Criar token de autenticação
npm token create

# Ver tokens ativos
npm token list

# Remover token
npm token revoke
```

### Publicação Automatizada

Para CI/CD, use tokens:

```bash
# No GitHub Actions ou similar
npm config set //registry.npmjs.org/:_authToken $NPM_TOKEN
npm publish
```

## 📊 Depois da Publicação

### 1. Verificar Estatísticas

```bash
# Ver downloads
npm view trest-language

# Ver versões
npm view trest-language versions

# Ver detalhes da versão
npm view trest-language@2.0.0
```

### 2. Compartilhar

```bash
# Criar release no GitHub
git tag v2.0.0
git push origin v2.0.0

# Postar nas redes sociais
# #trest #programming #language #cirillic #compiler

# Adicionar ao README.md
# 📦 Install: npm install -g trest-language
```

### 3. Monitorar

- Inspecionar downloads: https://www.npmjs.com/package/trest-language
- Revisar issues
- Manter CHANGELOG.md atualizado

## 🔄 Processo de Atualização

```bash
# 1. Fazer mudanças
# ... código ...

# 2. Atualizar version
npm version patch  # ou minor/major

# 3. Atualizar CHANGELOG.md
# ... documentar mudanças ...

# 4. Build
npm run build

# 5. Testar
npm pack --dry-run

# 6. Commit e push
git add .
git commit -m "v2.0.1: description"
git push

# 7. Publicar
npm publish

# 8. Criar tag
git tag v2.0.1
git push origin v2.0.1
```

## 📈 Estratégia de Versionamento

Use [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 -> 2.0.0): Breaking changes
- **MINOR** (1.0.0 -> 1.1.0): Novas features compatíveis
- **PATCH** (1.0.0 -> 1.0.1): Bug fixes

Exemplos:
```bash
npm version patch  # 2.0.0 -> 2.0.1 (bug fix)
npm version minor  # 2.0.0 -> 2.1.0 (nova feature)
npm version major  # 2.0.0 -> 3.0.0 (breaking change)
```

## 🎯 Comandos Úteis

```bash
# Ver informações do pacote
npm view trest-language

# Ver histórico de versões
npm view trest-language time

# Despublicar versão (dentro de 72h)
npm unpublish trest-language@2.0.0

# Ver estatísticas
npm view trest-language downloads

# Baixar pacote específico
npm install trest-language@2.0.0

# Verificar vulnerabilidades
npm audit
npm audit fix
```

## ✅ Conclusão

Após seguir estes passos, o Trest Language estará disponível para instalação via:

```bash
npm install -g trest-language
```

**Boa sorte com a publicação! 🚀**

