# Sistema de Prontuário Eletrônico Odontológico (PEP)

## 1. Visão Geral do Produto

Sistema web completo para gestão de prontuários eletrônicos de pacientes em clínicas odontológicas, focado em segurança, usabilidade e odontograma interativo para registro de procedimentos.

O sistema resolve a necessidade de digitalização e organização de prontuários médicos odontológicos, permitindo que dentistas e administradores gerenciem pacientes, tratamentos e documentos de forma eficiente e segura.

O produto visa modernizar clínicas odontológicas através de tecnologia web responsiva e integração com serviços em nuvem.

## 2. Funcionalidades Principais

### 2.1 Papéis de Usuário

| Papel         | Método de Registro               | Permissões Principais                                                       |
| ------------- | -------------------------------- | --------------------------------------------------------------------------- |
| Dentista      | Registro por email com validação | Acesso completo a prontuários, criação e edição de pacientes, procedimentos |
| Administrador | Convite do sistema               | Gestão de usuários, relatórios, configurações da clínica                    |

### 2.2 Módulos de Funcionalidades

Nosso sistema de prontuário odontológico consiste nas seguintes páginas principais:

1. **Página de Login**: autenticação via Supabase, recuperação de senha
2. **Dashboard Principal**: lista de pacientes com filtros dinâmicos, botão novo paciente
3. **Cadastro de Paciente**: formulário completo de dados pessoais e contato
4. **Prontuário do Paciente**: abas para informações, odontograma e documentos
5. **Agenda**: visualização e agendamento de consultas
6. **Relatórios**: estatísticas e relatórios da clínica

### 2.3 Detalhes das Páginas

| Nome da Página               | Nome do Módulo         | Descrição da Funcionalidade                                                                |
| ---------------------------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| Página de Login              | Autenticação           | Formulário de email/senha, integração Supabase Auth, redirecionamento pós-login            |
| Dashboard Principal          | Lista de Pacientes     | Tabela paginada com filtro em tempo real por nome/CPF/email, botão "+ Novo Paciente"       |
| Dashboard Principal          | Cabeçalho              | Logo da clínica, nome do usuário logado, botão logout                                      |
| Cadastro de Paciente         | Formulário             | Campos: nome completo, CPF, email, telefone, endereço, data nascimento, status             |
| Prontuário - Aba Informações | Dados Cadastrais       | Exibição e edição de informações pessoais do paciente                                      |
| Prontuário - Aba Odontograma | Odontograma Interativo | Renderização da imagem odentograma\_geometrico.jpg com elementos clicáveis para cada dente |
| Prontuário - Aba Odontograma | Modal de Procedimento  | Formulário para adicionar procedimento e observações por dente, histórico de procedimentos |
| Prontuário - Aba Odontograma | Destaque Visual        | Dentes com procedimentos destacados em azul no odontograma                                 |
| Prontuário - Aba Documentos  | Upload de Arquivos     | Integração Supabase Storage para upload, galeria de documentos anexados                    |
| Prontuário - Aba Documentos  | Galeria                | Lista de documentos com nome, tipo, data e link para visualização/download                 |
| Agenda                       | Visualização           | Calendário mensal/semanal com consultas agendadas                                          |
| Agenda                       | Agendamento            | Formulário para nova consulta com paciente, data, hora e observações                       |
| Relatórios                   | Estatísticas           | Gráficos de pacientes por status, procedimentos mais realizados, faturamento               |

## 3. Processo Principal

**Fluxo do Dentista:**

1. Login no sistema via email/senha
2. Acesso ao dashboard com lista de pacientes
3. Busca paciente por filtros ou cadastra novo
4. Acessa prontuário do paciente
5. Registra procedimentos no odontograma
6. Anexa documentos (raio-X, fotos)
7. Agenda próxima consulta

**Fluxo do Administrador:**

1. Login no sistema
2. Acesso a relatórios e estatísticas
3. Gestão de usuários do sistema
4. Configurações da clínica

```mermaid
graph TD
    A[Login] --> B[Dashboard]
    B --> C[Novo Paciente]
    B --> D[Prontuário Existente]
    C --> E[Cadastro]
    E --> F[Prontuário]
    D --> F[Prontuário]
    F --> G[Informações]
    F --> H[Odontograma]
    F --> I[Documentos]
    H --> J[Modal Procedimento]
    I --> K[Upload Arquivo]
    F --> L[Agenda]
    B --> M[Relatórios]
```

## 4. Design da Interface do Usuário

### 4.1 Estilo de Design

* **Cores Primárias**: Azul médico (#2563eb), Branco (#ffffff)

* **Cores Secundárias**: Cinza claro (#f8fafc), Verde sucesso (#10b981), Vermelho alerta (#ef4444)

* **Estilo de Botões**: Arredondados com sombra sutil, efeito hover

* **Fonte**: Inter ou Roboto, tamanhos 14px (corpo), 16px (títulos), 24px (cabeçalhos)

* **Layout**: Design limpo com cards, navegação superior fixa

* **Ícones**: Lucide React ou Heroicons para consistência

### 4.2 Visão Geral do Design das Páginas

| Nome da Página | Nome do Módulo     | Elementos da UI                                                                             |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------- |
| Login          | Formulário Central | Card centralizado, campos com ícones, botão azul primário, link "Esqueci senha"             |
| Dashboard      | Cabeçalho          | Navbar azul com logo, nome usuário, avatar, botão logout branco                             |
| Dashboard      | Lista Pacientes    | Tabela Bootstrap com hover, paginação, campo busca com ícone lupa                           |
| Dashboard      | Ações              | Botão "+ Novo Paciente" verde, botões "Ver Prontuário" azuis pequenos                       |
| Prontuário     | Navegação Abas     | Bootstrap Nav Pills, aba ativa azul, inativas cinza                                         |
| Prontuário     | Odontograma        | Imagem de fundo com divs sobrepostas, cursor pointer, dentes azuis quando têm procedimentos |
| Prontuário     | Modal              | Bootstrap Modal com título dinâmico, formulário organizado, botões ação                     |
| Documentos     | Upload             | Área drag-and-drop estilizada, progress bar, cards para arquivos                            |
| Agenda         | Calendário         | Grid responsivo, eventos coloridos por tipo, modal para detalhes                            |

### 4.3 Responsividade

Aplicação mobile-first com breakpoints Bootstrap 5:

* **Mobile** (< 768px): Menu hambúrguer, cards empilhados, odontograma redimensionado

* **Tablet** (768px - 1024px): Layout híbrido, sidebar colapsável

* **Desktop** (> 1024px): Layout completo com sidebar fixa

Otimização para touch em dispositivos móveis com botões maiores e espaçamento adequado.

<br />

Supabase credentials:

Url: <https://qudrqnngvxoxgaaxddzw.supabase.co>

Apikey: anon = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZHJxbm5ndnhveGdhYXhkZHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0Mzg4MzQsImV4cCI6MjA3MDAxNDgzNH0.fGgydO7A7c5qDyP9w18OU\_vaUhjwLhPA8grFAPouy4Y

service\_role = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZHJxbm5ndnhveGdhYXhkZHp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQzODgzNCwiZXhwIjoyMDcwMDE0ODM0fQ.PVajxGO\_6c2gNbqK2gzl\_T02swrf3uLYD8gbgAkZH\_s

Senha do banco caso necessário: alvaropaixaosergio171

Caso precise de mais alguma coisa peça
