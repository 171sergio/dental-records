-- Migração para corrigir políticas RLS e permitir acesso público temporário
-- Esta é uma solução temporária para desenvolvimento

-- Remover políticas existentes
DROP POLICY IF EXISTS "Authenticated users can view patients" ON patients;
DROP POLICY IF EXISTS "Authenticated users can insert patients" ON patients;
DROP POLICY IF EXISTS "Authenticated users can update patients" ON patients;
DROP POLICY IF EXISTS "Authenticated users can delete patients" ON patients;

DROP POLICY IF EXISTS "Authenticated users can view procedures" ON procedures;
DROP POLICY IF EXISTS "Authenticated users can insert procedures" ON procedures;
DROP POLICY IF EXISTS "Authenticated users can update procedures" ON procedures;
DROP POLICY IF EXISTS "Authenticated users can delete procedures" ON procedures;

DROP POLICY IF EXISTS "Authenticated users can view documents" ON documents;
DROP POLICY IF EXISTS "Authenticated users can insert documents" ON documents;
DROP POLICY IF EXISTS "Authenticated users can update documents" ON documents;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON documents;

DROP POLICY IF EXISTS "Authenticated users can view appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can insert appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can update appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can delete appointments" ON appointments;

-- Criar políticas públicas temporárias para desenvolvimento
-- ATENÇÃO: Em produção, estas políticas devem ser mais restritivas

-- Pacientes - Acesso público temporário
CREATE POLICY "Public access to patients" ON patients 
    FOR ALL USING (true);

-- Procedimentos - Acesso público temporário
CREATE POLICY "Public access to procedures" ON procedures 
    FOR ALL USING (true);

-- Documentos - Acesso público temporário
CREATE POLICY "Public access to documents" ON documents 
    FOR ALL USING (true);

-- Agendamentos - Acesso público temporário
CREATE POLICY "Public access to appointments" ON appointments 
    FOR ALL USING (true);

-- Comentário importante sobre segurança
-- TODO: Implementar autenticação adequada e políticas RLS mais restritivas
-- As políticas atuais permitem acesso público total - apenas para desenvolvimento