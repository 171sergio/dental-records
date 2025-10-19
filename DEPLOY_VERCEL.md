# 🚀 Deploy no Vercel - Sistema Prontuário Odontológico

## 📋 Pré-requisitos

1. ✅ Conta no [Vercel](https://vercel.com)
2. ✅ Projeto no [Supabase](https://supabase.com) configurado
3. ✅ Repositório no GitHub/GitLab/Bitbucket

## 🔧 Configuração das Variáveis de Ambiente

### No Vercel Dashboard:

1. Acesse seu projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

**Opcional** (para Google Calendar):
```env
VITE_GOOGLE_CLIENT_ID=seu_google_client_id
VITE_GOOGLE_CLIENT_SECRET=seu_google_client_secret
```

### Como obter as credenciais do Supabase:

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

## 🚀 Deploy Automático

### Opção 1: Via GitHub (Recomendado)

1. **Push para GitHub**:
   ```bash
   git add .
   git commit -m "Preparado para deploy no Vercel"
   git push origin main
   ```

2. **Conectar no Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em **"New Project"**
   - Importe seu repositório do GitHub
   - Configure as variáveis de ambiente
   - Clique em **"Deploy"**

### Opção 2: Via Vercel CLI

1. **Instalar Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login e Deploy**:
   ```bash
   vercel login
   vercel --prod
   ```

## ⚙️ Configurações Automáticas

O arquivo `vercel.json` já está configurado com:

- ✅ **Build Command**: `npm run build`
- ✅ **Output Directory**: `dist`
- ✅ **Framework**: Vite
- ✅ **SPA Routing**: Redirecionamentos configurados
- ✅ **Cache Headers**: Otimização de assets
- ✅ **Environment Variables**: Mapeamento automático

## 🔒 Configurações de Segurança no Supabase

### Atualizar URLs permitidas:

1. No Supabase, vá em **Authentication** → **Settings**
2. Adicione sua URL do Vercel em:
   - **Site URL**: `https://seu-app.vercel.app`
   - **Redirect URLs**: `https://seu-app.vercel.app/**`

## 🧪 Teste Local da Build

Antes do deploy, teste localmente:

```bash
# Build de produção
npm run build

# Preview da build
npm run preview
```

## 📊 Monitoramento

Após o deploy:

1. ✅ Teste todas as funcionalidades
2. ✅ Verifique o console do navegador
3. ✅ Teste login/logout
4. ✅ Teste CRUD de pacientes
5. ✅ Teste upload de documentos

## 🔄 Deploy Contínuo

Com GitHub conectado:
- ✅ **Auto-deploy** em push para `main`
- ✅ **Preview deploys** para pull requests
- ✅ **Rollback** automático em caso de erro

## 🆘 Troubleshooting

### Erro de Build:
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Erro de Variáveis de Ambiente:
- Verifique se todas as variáveis estão configuradas no Vercel
- Certifique-se de que começam com `VITE_`

### Erro de Roteamento:
- O arquivo `vercel.json` já configura SPA routing
- Todas as rotas redirecionam para `index.html`

### Erro de Supabase:
- Verifique URLs permitidas no Supabase
- Confirme se as credenciais estão corretas

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. 🔒 **Configurar domínio customizado** (opcional)
2. 📈 **Configurar analytics** do Vercel
3. 🔔 **Configurar notificações** de deploy
4. 🛡️ **Revisar políticas de segurança** do Supabase

---

## 📞 Suporte

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)

**🎉 Seu sistema estará online e acessível globalmente!**