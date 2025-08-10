# Setup do Supabase - Prontuário Odontológico

## Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Node.js instalado
3. Supabase CLI (opcional para desenvolvimento local)

## Configuração do Projeto no Supabase

### 1. Criar Novo Projeto

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Clique em "New Project"
3. Escolha sua organização
4. Defina:
   - **Name**: `dental-records`
   - **Database Password**: (anote esta senha)
   - **Region**: Escolha a mais próxima (ex: South America - São Paulo)

### 2. Configurar Variáveis de Ambiente

Após criar o projeto, copie as credenciais:

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL**
   - **anon/public key**

3. Atualize o arquivo `.env`:

```env
VITE_SUPABASE_URL=sua_project_url_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### 3. Executar Migrações

#### Opção A: Via Dashboard (Recomendado)

1. Vá em **SQL Editor** no dashboard do Supabase
2. Copie e cole o conteúdo do arquivo `supabase/migrations/001_initial_schema.sql`
3. Execute o script

#### Opção B: Via CLI (Avançado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Fazer login
supabase login

# Conectar ao projeto
supabase link --project-ref SEU_PROJECT_REF

# Executar migrações
supabase db push
```

### 4. Configurar Storage (Opcional)

Para upload de documentos:

1. Vá em **Storage** no dashboard
2. Crie um bucket chamado `documents`
3. Configure as políticas de acesso:

```sql
-- Permitir upload para usuários autenticados
CREATE POLICY "Authenticated users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Permitir visualização para usuários autenticados
CREATE POLICY "Authenticated users can view documents" ON storage.objects
FOR SELECT USING (auth.role() = 'authenticated');
```

### 5. Configurar Autenticação

1. Vá em **Authentication** → **Settings**
2. Configure:
   - **Site URL**: `http://localhost:5174` (desenvolvimento)
   - **Redirect URLs**: `http://localhost:5174/**`

### 6. Testar Conexão

Execute o projeto e teste:

```bash
npm run dev
```

1. Acesse `http://localhost:5174`
2. Tente fazer login/cadastro
3. Verifique se os dados aparecem no dashboard do Supabase

## Estrutura das Tabelas

O script de migração cria as seguintes tabelas:

- **patients**: Dados dos pacientes
- **procedures**: Procedimentos realizados
- **documents**: Documentos anexados
- **appointments**: Agendamentos

## Dados de Exemplo

O script inclui alguns dados de exemplo para teste. Para produção, remova a seção de inserção de dados do arquivo de migração.

## Troubleshooting

### Erro de Conexão
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto está ativo no Supabase

### Erro de Permissão
- Verifique se as políticas RLS estão configuradas
- Confirme se o usuário está autenticado

### Erro de Migração
- Execute as migrações uma por vez
- Verifique se não há conflitos de nomes de tabelas

## Próximos Passos

Após a configuração:

1. ✅ Integração com Supabase concluída
2. 🔄 Implementar Google Calendar (opcional)
3. 🎨 Finalizar melhorias visuais
4. 🚀 Deploy para produção

## Suporte

Para dúvidas sobre o Supabase:
- [Documentação Oficial](https://supabase.com/docs)
- [Discord da Comunidade](https://discord.supabase.com)