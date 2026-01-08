# Changelog de Segurança - Versão 2.4.4

## 🔒 Correções de Segurança Implementadas

### ✅ Problemas Resolvidos

#### 1. Scripts de Instalação Automáticos (RISCO DA CADEIA DE SUPRIMENTOS)

**Problema:**
- Scripts `preinstall` e `postinstall` executavam automaticamente durante `npm install`
- Risco de execução de código malicioso na cadeia de suprimentos

**Solução:**
- ✅ Removidos scripts `preinstall` e `postinstall` do `package.json`
- ✅ Scripts agora são opcionais e só executados manualmente
- ✅ Scripts removidos do pacote publicado via `.npmignore`

**Arquivos Afetados:**
- `package.json` - Removidos hooks `preinstall` e `postinstall`
- `scripts/preinstall.js` - Modificado para não usar `child_process`
- `scripts/postinstall.js` - Marcado como opcional
- `.npmignore` - Criado para excluir scripts do pacote

---

#### 2. Acesso ao Shell (child_process) (RISCO DA CADEIA DE SUPRIMENTOS)

**Problema:**
- `scripts/preinstall.js` usava `child_process.execSync` para executar comandos do sistema
- Risco de escalação de privilégios e execução de código arbitrário

**Solução:**
- ✅ Removido uso de `child_process` do `preinstall.js`
- ✅ Verificações agora usam apenas APIs seguras do Node.js
- ✅ Sem acesso ao shell durante instalação

**Mudanças:**
- Antes: `execSync('npm --version')` 
- Agora: Verificação via `process.env.npm_version` ou removida

---

#### 3. Acesso à Rede (fetch/HTTP) (ALERTA LEGÍTIMO)

**Status:** ⚠️ **FUNCIONALIDADE ESPERADA**

**Explicação:**
- O módulo HTTP (`std/http`) precisa acessar a rede para funcionar
- Isso é uma **funcionalidade legítima** e esperada do pacote
- Acesso ocorre apenas quando o código Trest **explicitamente** usa o módulo HTTP

**Não é um problema de segurança porque:**
- ✅ Não há acesso automático durante instalação
- ✅ Usuário tem controle total sobre quando usar
- ✅ Funcionalidade documentada e esperada

---

## 📋 Resumo das Mudanças

| Item | Status | Ação |
|------|--------|------|
| Scripts `preinstall`/`postinstall` | ✅ Removidos | Não executados automaticamente |
| Uso de `child_process` | ✅ Removido | Sem acesso ao shell |
| Acesso à rede via `fetch` | ⚠️ Legítimo | Funcionalidade esperada |
| `.npmignore` criado | ✅ Criado | Scripts excluídos do pacote |
| `SECURITY.md` criado | ✅ Criado | Documentação de segurança |

---

## 🔄 Compatibilidade

**Versão Anterior:** 2.4.3  
**Nova Versão:** 2.4.4

**Mudanças Incompatíveis:**
- ❌ Nenhuma - Totalmente compatível

**Comportamento:**
- Instalação mais segura (sem scripts automáticos)
- Funcionalidades mantidas
- API inalterada

---

## 📚 Documentação Adicional

Veja `SECURITY.md` para informações detalhadas sobre:
- Políticas de segurança
- Como reportar vulnerabilidades
- Boas práticas de uso

---

**Data:** 2025-01-08  
**Versão:** 2.4.4
