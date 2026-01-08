# Política de Segurança - Trest Language

## 🛡️ Segurança da Cadeia de Suprimentos

Este documento explica os alertas de segurança que podem aparecer ao instalar o pacote `treste`.

---

## ✅ Medidas de Segurança Implementadas

### 1. Scripts de Instalação Removidos

**Status:** ✅ **RESOLVIDO**

Os scripts `preinstall` e `postinstall` **NÃO são mais executados automaticamente** durante a instalação do pacote. Eles foram removidos do `package.json` para prevenir execução automática de código.

**Antes:**
- Scripts executados automaticamente durante `npm install`
- Usavam `child_process` para executar comandos do sistema

**Agora:**
- Scripts removidos da instalação automática
- Podem ser executados manualmente se necessário (apenas para desenvolvimento)
- Sem acesso ao shell durante instalação

---

### 2. Acesso à Rede (fetch/HTTP)

**Status:** ⚠️ **ALERTA LEGÍTIMO** (Funcionalidade Esperada)

O módulo `HTTP.fetch` e funções HTTP **acessam a rede** - isso é uma **funcionalidade legítima** do pacote.

**Por quê?**
- O pacote `treste` inclui um módulo HTTP completo (`std/http`)
- Este módulo precisa acessar a rede para fazer requisições HTTP
- Funciona apenas quando o código Trest **explicitamente usa** o módulo HTTP

**Quando é usado?**
```trest
# Apenas quando você explicitamente importa e usa:
импорт * как HTTP измодуля "std/http"
HTTP.GET("https://api.example.com")  # ← Aqui a rede é acessada
```

**Segurança:**
- ✅ Acesso à rede ocorre **apenas** quando o código Trest usa HTTP
- ✅ Não há acesso automático durante instalação
- ✅ Usuário tem controle total sobre quando usar

---

### 3. Acesso ao Shell (child_process)

**Status:** ✅ **RESOLVIDO**

O acesso ao shell via `child_process` foi **removido** dos scripts de instalação.

**Antes:**
- `preinstall.js` usava `execSync` para verificar versões
- Risco de execução de código arbitrário

**Agora:**
- `child_process` removido do `preinstall.js`
- Scripts de instalação não executam mais comandos do sistema
- Verificações feitas via APIs do Node.js (sem shell)

---

## 📋 Resumo dos Alertas

| Alerta | Status | Explicação |
|--------|--------|------------|
| **Instalar scripts** | ✅ Resolvido | Scripts removidos da instalação automática |
| **Acesso à Shell** | ✅ Resolvido | `child_process` removido dos scripts |
| **Acesso à Rede** | ⚠️ Legítimo | Funcionalidade esperada do módulo HTTP |

---

## 🔒 Boas Práticas de Segurança

### Para Usuários do Pacote

1. **Revise o código** antes de executar programas Trest desconhecidos
2. **Use o módulo HTTP** apenas quando necessário
3. **Mantenha o pacote atualizado** para receber correções de segurança

### Para Desenvolvedores

1. **Não execute** scripts desconhecidos automaticamente
2. **Revise dependências** antes de instalar
3. **Use `npm audit`** regularmente para verificar vulnerabilidades

---

## 📝 Dependências de Segurança

### Dependências de Produção
- `minimist@^1.2.8` - ✅ Sem vulnerabilidades conhecidas

### Dependências de Desenvolvimento
- `pkg@^5.8.1` - ⚠️ Vulnerabilidade moderada (Local Privilege Escalation)
  - **Status:** Movido para `devDependencies`
  - **Impacto:** Apenas em desenvolvimento, não instalado em produção
  - **Uso:** Apenas no script `bundle` para criar executáveis

---

## 🚨 Reportar Problemas de Segurança

Se você encontrar uma vulnerabilidade de segurança:

1. **NÃO** abra um issue público no GitHub
2. Envie email para: [marcus.vieiraleal94@gmail.com](mailto:marcus.vieiraleal94@gmail.com)
3. Inclua detalhes sobre a vulnerabilidade encontrada

---

## 📚 Referências

- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supply Chain Security](https://docs.npmjs.com/security-best-practices)

---

**Última atualização:** 2025-01-08  
**Versão:** 2.4.3
