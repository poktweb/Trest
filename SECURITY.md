# 🛡️ Política de Segurança - Trest

## Resumo de Segurança

Este documento descreve as medidas de segurança implementadas no Trest e explica o uso de funcionalidades que podem ser sinalizadas por ferramentas de análise de segurança.

## ✅ Medidas de Segurança Implementadas

### 1. Dependências Atualizadas

- **Electron**: Atualizado para `^35.7.5` (corrige CVE moderado GHSA-vmqv-hx8q-j7mg)
- **better-sqlite3**: Atualizado para `^12.6.0` (versão mais recente)
- Todas as dependências são verificadas regularmente com `npm audit`

**⚠️ Vulnerabilidade Conhecida (DevDependency):**
- **pkg**: CVE moderado GHSA-22r3-9w55-cj54 (Local Privilege Escalation)
  - **Status**: Sem correção disponível no momento
  - **Impacto**: Apenas em desenvolvimento (devDependency)
  - **Mitigação**: `pkg` é usado apenas para criar executáveis durante desenvolvimento. Não é incluído no pacote publicado.
  - **Recomendação**: Usar apenas em ambientes de desenvolvimento confiáveis

### 2. Scripts de Instalação

**Status:** ✅ **SEGURO**

O script `prepare` é necessário para compilar o TypeScript antes da instalação. Ele:
- Executa apenas `npm run build` (compilação TypeScript)
- Não acessa rede ou shell
- É um padrão da indústria para pacotes TypeScript

**Scripts removidos:**
- ❌ `preinstall` - Removido (não executa código externo)
- ❌ `postinstall` - Removido (não executa código externo)

### 3. Acesso ao Shell (child_process)

**Status:** ⚠️ **FUNCIONALIDADE NECESSÁRIA** (Documentado)

O Trest usa `child_process.spawn()` e `child_process.execSync()` para:

1. **Executar compilador** (`src/cli.ts`):
   - Quando `--mode` é usado, o CLI spawna o processo do compilador
   - Isso é necessário para separar a execução do interpretador do compilador
   - **Segurança**: Apenas executa `node compiler.js` com argumentos validados

2. **Executar Electron** (`src/cli.ts`):
   - Quando código GUI é detectado, spawna o processo Electron
   - Isso é necessário porque Electron precisa ser o processo principal
   - **Segurança**: Apenas executa `electron` com caminhos validados

3. **Atualização** (`src/cli.ts`):
   - O comando `trest --update` executa script de atualização
   - **Segurança**: Apenas executa scripts locais do próprio pacote

**Mitigações:**
- ✅ Apenas executa processos conhecidos (`node`, `electron`)
- ✅ Argumentos são validados antes da execução
- ✅ Não executa código arbitrário do usuário
- ✅ Não usa `shell: true` exceto quando necessário (Windows)

### 4. Acesso à Rede

**Status:** ✅ **FUNCIONALIDADE LEGÍTIMA**

O módulo `std/http` acessa a rede para:
- Fazer requisições HTTP/HTTPS
- Criar servidores HTTP
- Funciona apenas quando o código Trest **explicitamente usa** o módulo

**Quando é usado:**
```trest
импорт * как HTTP измодуля "std/http"
HTTP.fetch("https://api.exemplo.com")
```

**Segurança:**
- ✅ Acesso à rede é controlado pelo usuário
- ✅ Não faz requisições automáticas
- ✅ Usa APIs nativas do Node.js (`http`, `https`)

### 5. Código Nativo

**Status:** ✅ **NECESSÁRIO PARA FUNCIONALIDADE**

Os seguintes pacotes contêm código nativo:

- **better-sqlite3**: Requerido para acesso a banco de dados SQLite
- **electron**: Requerido para aplicações GUI
- **mysql2**: Requerido para acesso a banco de dados MySQL (contém código nativo para performance)

**Segurança:**
- ✅ Todos os pacotes são de fontes confiáveis (npm oficial)
- ✅ Código nativo é compilado durante instalação
- ✅ Não há binários pré-compilados suspeitos

### 6. Uso de `require()` Dinâmico

**Status:** ✅ **FUNCIONALIDADE NECESSÁRIA**

O Trest usa `require()` dinâmico para:
- Carregar módulos NPM via `изpkg` / `fromPkg`
- Carregar módulos Trest via `импорт`

**Segurança:**
- ✅ Apenas carrega módulos especificados pelo usuário
- ✅ Não executa código arbitrário
- ✅ Usa o sistema de módulos padrão do Node.js

### 7. Dependências com Wildcards

**Status:** ✅ **CORRIGIDO**

Todas as dependências agora usam versões específicas ou ranges seguros:
- `^` (caret) permite apenas atualizações de patch e minor
- Não usa `*` ou ranges muito amplos

### 8. Pacotes Deprecados

**Status:** ✅ **VERIFICADO**

- Nenhum pacote direto está deprecado
- Dependências transitivas são verificadas regularmente

## 🔍 Verificação de Segurança

Para verificar a segurança do projeto:

```bash
# Verificar vulnerabilidades
npm audit

# Verificar dependências desatualizadas
npm outdated

# Verificar licenças
npm ls --depth=0
```

## 📝 Relatório de Vulnerabilidades

Se você encontrar uma vulnerabilidade de segurança, por favor:

1. **NÃO** abra uma issue pública
2. Envie um email para: [seu-email]
3. Inclua detalhes sobre a vulnerabilidade
4. Aguarde resposta antes de divulgar publicamente

## ✅ Checklist de Segurança

- [x] Dependências atualizadas
- [x] Scripts de instalação seguros
- [x] Shell access documentado
- [x] Network access documentado
- [x] Código nativo justificado
- [x] Require dinâmico documentado
- [x] Wildcards corrigidos
- [x] Pacotes deprecados verificados
- [x] CVE de produção corrigidos
- [x] CVE de desenvolvimento documentado (pkg - devDependency apenas)

## 📚 Referências

- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
