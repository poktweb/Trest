# CHANGELOG - Trest Language

Histórico de mudanças da linguagem Trest.

## [2.4.0] - 01/11/2025

### ✨ Novidades Críticas
- **Operadores Ternários**: Implementado `? :` - `result = x > 5 ? 'sim' : 'não'`
- **Switch/Case**: Implementado completamente com fall-through
  - `переключатель (value) { случай 1: ... прервать }`
  - Suporte a `случай`, `поумолчанию` e `прервать`
- **Modo Execute Inline**: Funcional e testado
  - `trest -e "код"` funciona perfeitamente

### 📈 Progresso
- Versão 2.4.0: ~82% completo (antes 75%)
- Features adicionadas hoje: 2/5 prioridade alta

## [2.3.3] - 01/11/2025

### 📝 Documentação Atualizada
- README.md atualizado com exemplos de execução inline
- Seção "Guia Rápido" reorganizada para destacar modo inline

## [2.3.2] - 01/11/2025

### ✨ Novidades
- **Modo Execute Inline**: Novo comando `-e/--execute` para executar código sem arquivo
  - `trest -e "печать('Olá')"` - Executar código direto na linha de comando
  - Útil para comandos rápidos e testes simples
  - Suporta todas as funcionalidades básicas da linguagem

## [2.3.1] - 01/11/2025

### 📝 Mudanças de Documentação
- **README.md em PT-BR**: Documentação principal agora em português brasileiro
- Mantida sintaxe cirílica em todos os exemplos de código
- Organização completa da documentação na pasta `docs/`
- Melhorias na descrição do pacote NPM

## [2.3.0] - 31/10/2025

### ✨ Novidades
- **3 Novos Módulos Nativos**: RegEx, Path e Process
- **Módulo RegEx**: Expressões regulares completas
  - `RegEx.create(pattern)` - Criar padrão
  - `RegEx.test(pattern, text)` - Testar match
  - `RegEx.match(pattern, text)` - Primeira correspondência
  - `RegEx.findAll(pattern, text)` - Todas correspondências
  - `RegEx.replace(pattern, text, replacement)` - Substituir
  - `RegEx.split(pattern, text, limit)` - Dividir
- **Módulo Path**: Manipulação de caminhos
  - `Path.join(...segments)` - Juntar caminhos
  - `Path.resolve(...segments)` - Caminho absoluto
  - `Path.dirname(path)` - Diretório pai
  - `Path.basename(path, ext)` - Nome base
  - `Path.extname(path)` - Extensão
  - `Path.normalize(path)` - Normalizar
  - `Path.isAbsolute(path)` - Verificar absoluto
  - `Path.relative(from, to)` - Caminho relativo
  - `Path.cwd` - Diretório atual
- **Módulo Process**: Variáveis de ambiente e sistema
  - `Process.getEnv(name)` - Obter variável
  - `Process.getAllEnv()` - Todas variáveis
  - `Process.setEnv(name, value)` - Definir variável
  - `Process.platform` - Plataforma (win32/linux/darwin)
  - `Process.arch` - Arquitetura (x64/arm64)
  - `Process.version` - Versão Node.js
  - `Process.cwd` - Diretório atual
  - `Process.pid` - ID do processo
  - `Process.chdir(path)` - Mudar diretório
  - `Process.exit(code)` - Sair do programa
- **Documentação 100% pt-BR**: Toda documentação traduzida
- **Novo arquivo FEATURES.md**: Funcionalidades completas
- **Melhorias no Interpreter**: Sistema de importação otimizado

### 🔄 Alterações
- Sistema de módulos nativos expandido de 8 para 11 módulos
- Integração completa de RegEx, Path e Process
- Documentação atualizada com novos módulos
- Guia de funcionalidades adicionado

---

## [2.2.1] - 31/10/2025

### ✨ Novidades
- **Comando de atualização**: `trest --update` para atualização automática do NPM
- **Interpretador corrigido**: Carregamento correto de módulos .trest da biblioteca padrão
- **Suporte total a imports**: Importação de módulos funciona tanto de arquivos .trest quanto de módulos nativos

### 🔄 Alterações
- Melhorada a sistema de importação de módulos
- Otimizado o carregamento de bibliotecas padrão

---

## [2.2.0] - 2025

### ✨ Novidades
- **Publicação inicial no NPM**: Pacote publicado como `treste`
- **Comando de atualização**: `trest --update`

### 🔄 Alterações
- Configuração inicial para publicação no NPM

---

## [2.1.0] - 2025

### ✨ Novidades

#### 🌐 Módulo HTTP
- Requisições GET, POST, PUT, DELETE
- Servidor HTTP com roteamento
- Suporte a Fetch API
- Manipulação de cabeçalhos

#### 🔐 Módulo Crypto
- Hash MD5, SHA256, SHA512
- Criptografia/descriptografia AES
- Geração de dados aleatórios

#### 📁 Módulo FileSystem
- Leitura/escrita de arquivos
- Verificação de existência
- Exclusão de arquivos/diretórios
- Criação de diretórios
- Obtenção de estatísticas de arquivos

#### 📄 Módulo JSON
- Parse de JSON
- Conversão para string
- Formatação

#### 📅 Módulo Date
- Obter hora atual
- Formatação de datas
- Trabalhar com fusos horários

#### 🗄️ Módulo Database
- Conexão com BD
- Query Builder
- Modelo ORM
- Transações

#### 🖥️ Módulo GUI
- Criação de janelas
- Botões, campos de texto, listas
- Interface de terminal

#### ⚡ Módulo Async
- Promises
- Delay/Sleep
- Timers (setTimeout/setInterval)
- Promise.all / Promise.race

### 🔧 Melhorias Técnicas
- Implementação nativa de módulos em TypeScript
- Vinculação automática de funções
- Suporte a métodos estáticos de classes
- Melhorada a manipulação de MemberExpression

---

## [2.0.0] - 2025

### ✨ Novidades
- Suporte completo a cirílico
- Biblioteca padrão (Math, String, Array, IO)
- Sistema de módulos
- Compilação para Web e Desktop
- Try/catch/throw
- Classes e herança
- Funções de ordem superior
- Funções arrow

### 🔧 Correções
- Parse de imports
- Tratamento de erros
- Trabalhar com closures

---

## [1.0.0] - 2025

### Primeiro lançamento
- Interpretador básico
- Analisador léxico
- Parser AST
- Construções principais da linguagem
- Suporte a variáveis e funções

---

**Versão:** 2.3.0  
**Autor:** PoktWeb  
**Site:** https://trest-site.vercel.app  
**Data de Lançamento:** 31/10/2025
