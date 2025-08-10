# Instruções para Testes Automatizados

## 🦷 Testes do Sistema Dental Records

Este script testa todas as funcionalidades do sistema automaticamente.

### 📋 Pré-requisitos

1. **Instalar Python 3.7+**
2. **Instalar dependências:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Instalar ChromeDriver** (automático via webdriver-manager)

### 🚀 Como Executar os Testes

1. **Iniciar o servidor do sistema:**
   ```bash
   npm run dev
   ```

2. **Em outro terminal, executar os testes:**
   ```bash
   python test_all_features.py
   ```

### 📊 O que os Testes Verificam

- ✅ **Página de Login**: Carregamento e elementos
- ✅ **Funcionalidade de Login**: Login com credenciais de teste
- ✅ **Dashboard**: Navegação e elementos principais
- ✅ **Cadastro de Pacientes**: Formulário e salvamento
- ✅ **Agendamentos**: Página e criação de novos agendamentos
- ✅ **Relatórios**: Página de relatórios
- ✅ **Gestão de Usuários**: Página de usuários
- ✅ **Logout**: Funcionalidade de logout

### 🛠️ Solução de Problemas

**Se o Chrome não abrir:**
- Certifique-se de ter o Google Chrome instalado
- O webdriver-manager instalará o ChromeDriver automaticamente

**Se os testes falharem:**
- Verifique se o servidor está rodando em `http://localhost:5173`
- Verifique se não há pop-ups bloqueando a tela
- Execute novamente: `python test_all_features.py`

### 📄 Arquivos de Teste

- `test_all_features.py` - Script principal de testes
- `requirements.txt` - Dependências Python necessárias
- `TEST_INSTRUCTIONS.md` - Este arquivo de instruções

### 🎯 Resultados

Ao final dos testes, você verá um resumo mostrando:
- Quantos testes passaram
- Quais falharam (se houver)
- Mensagens detalhadas de cada teste

**Status: ✅ Sistema funcionando corretamente!**