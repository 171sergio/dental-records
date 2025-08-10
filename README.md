# Sistema de Prontuário Odontológico

Um sistema completo para gerenciamento de prontuários odontológicos, desenvolvido para facilitar o trabalho de dentistas e clínicas odontológicas.

## 🚀 Funcionalidades Principais

### 👨‍⚕️ Para Dentistas
- **Dashboard Intuitivo**: Visão geral dos pacientes com filtros avançados
- **Gestão de Pacientes**: Cadastro completo com informações pessoais e histórico
- **Odontograma Interativo**: Registro visual de procedimentos por dente usando imagem geométrica real
- **Histórico de Procedimentos**: Acompanhamento completo dos tratamentos realizados
- **Sistema de Documentos**: Upload e organização de radiografias, exames e fotos
- **Interface Responsiva**: Funciona perfeitamente em desktop, tablet e mobile

### 🏥 Para Administradores
- **Gestão de Usuários**: Controle de acesso de dentistas e assistentes
- **Relatórios**: Estatísticas de atendimentos e procedimentos
- **Backup de Dados**: Segurança e integridade das informações

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Bootstrap 5 + CSS customizado
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form + Yup (validação)
- **Ícones**: Lucide React
- **Upload de Arquivos**: React Dropzone
- **Utilitários**: date-fns, uuid

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── OdontogramaTab.tsx      # Odontograma interativo
│   ├── DocumentsTab.tsx        # Gestão de documentos
│   └── PatientInfoTab.tsx      # Informações do paciente
├── pages/              # Páginas principais
│   ├── Login.tsx              # Página de login
│   ├── Dashboard.tsx          # Dashboard principal
│   ├── PatientForm.tsx        # Formulário de paciente
│   └── PatientRecord.tsx      # Prontuário do paciente
├── hooks/              # Custom hooks
│   └── useAuth.tsx            # Hook de autenticação
├── services/           # Configuração de serviços
│   └── supabase.ts            # Cliente Supabase
├── types/              # Definições TypeScript
│   └── index.ts               # Interfaces e tipos
├── utils/              # Funções utilitárias
├── assets/             # Imagens e recursos
│   └── odentograma_geometrico.jpg  # Imagem do odontograma
└── App.tsx             # Componente principal
```

## ⚙️ Instalação e Configuração

### 1. Pré-requisitos
- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com)

### 2. Clone o repositório
```bash
git clone https://github.com/seu-usuario/dental-records.git
cd dental-records
```

### 3. Instale as dependências
```bash
npm install
```

### 4. Configure o Supabase

#### 4.1 Crie um projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Anote a URL do projeto e a chave anônima

#### 4.2 Configure as tabelas do banco de dados
Execute os seguintes scripts SQL no editor SQL do Supabase:

```sql
-- Tabela de pacientes
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR NOT NULL,
  cpf VARCHAR UNIQUE NOT NULL,
  email VARCHAR NOT NULL,
  telefone VARCHAR NOT NULL,
  endereco TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  status VARCHAR DEFAULT 'Ativo',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de procedimentos
CREATE TABLE procedures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  dente_numero INTEGER NOT NULL,
  procedimento VARCHAR NOT NULL,
  observacoes TEXT,
  data_procedimento DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de documentos
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  nome_arquivo VARCHAR NOT NULL,
  tipo_documento VARCHAR NOT NULL,
  descricao TEXT,
  url_arquivo VARCHAR NOT NULL,
  tamanho_arquivo INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de perfis de usuário
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  nome VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'dentista',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Políticas de segurança (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários autenticados
CREATE POLICY "Users can view all patients" ON patients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert patients" ON patients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update patients" ON patients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete patients" ON patients FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all procedures" ON procedures FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert procedures" ON procedures FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update procedures" ON procedures FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete procedures" ON procedures FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all documents" ON documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert documents" ON documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update documents" ON documents FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete documents" ON documents FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

#### 4.3 Configure o Storage
1. No painel do Supabase, vá para "Storage"
2. Crie um bucket chamado "documents"
3. Configure as políticas de acesso para usuários autenticados

### 5. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### 6. Execute o projeto
```bash
npm run dev
```

O sistema estará disponível em `http://localhost:5173`

## 🎯 Como Usar

### Primeiro Acesso
1. Crie uma conta no sistema de autenticação do Supabase
2. Faça login com suas credenciais
3. Comece cadastrando pacientes no dashboard

### Cadastro de Pacientes
1. No dashboard, clique em "Novo Paciente"
2. Preencha todas as informações obrigatórias
3. Salve o cadastro

### Uso do Odontograma
1. Acesse o prontuário de um paciente
2. Vá para a aba "Odontograma"
3. Clique em qualquer dente na imagem
4. Registre o procedimento realizado
5. Dentes com procedimentos ficam destacados em azul

### Upload de Documentos
1. Na aba "Documentos" do prontuário
2. Clique em "Adicionar Documentos"
3. Arraste arquivos ou clique para selecionar
4. Escolha o tipo de documento
5. Adicione uma descrição (opcional)
6. Faça o upload

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- Abra uma [issue](https://github.com/seu-usuario/dental-records/issues)
- Entre em contato: seu-email@exemplo.com

## 🎨 Screenshots

*Adicione screenshots do sistema aqui quando estiver pronto*

---

**Desenvolvido com ❤️ para facilitar o trabalho de profissionais da odontologia**
