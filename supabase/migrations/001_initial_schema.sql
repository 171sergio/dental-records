-- Criação das tabelas principais do sistema de prontuário odontológico

-- Tabela de pacientes
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo VARCHAR NOT NULL,
  cpf VARCHAR UNIQUE NOT NULL,
  email VARCHAR NOT NULL,
  telefone VARCHAR NOT NULL,
  endereco TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  status VARCHAR DEFAULT 'em_tratamento' CHECK (status IN ('alta', 'em_tratamento', 'pendente', 'ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de procedimentos
CREATE TABLE IF NOT EXISTS procedures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  dente_numero INTEGER NOT NULL CHECK (dente_numero >= 11 AND dente_numero <= 48),
  procedimento VARCHAR NOT NULL,
  observacoes TEXT,
  data_procedimento DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de documentos
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  nome_arquivo VARCHAR NOT NULL,
  tipo_arquivo VARCHAR NOT NULL,
  tipo_documento VARCHAR,
  descricao TEXT,
  url_arquivo VARCHAR NOT NULL,
  tamanho_arquivo INTEGER,
  data_upload DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  data_consulta DATE NOT NULL,
  hora_consulta TIME NOT NULL,
  observacoes TEXT,
  status VARCHAR DEFAULT 'agendada' CHECK (status IN ('agendada', 'concluida', 'cancelada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_patients_cpf ON patients(cpf);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_procedures_paciente_id ON procedures(paciente_id);
CREATE INDEX IF NOT EXISTS idx_procedures_data ON procedures(data_procedimento);
CREATE INDEX IF NOT EXISTS idx_documents_paciente_id ON documents(paciente_id);
CREATE INDEX IF NOT EXISTS idx_appointments_paciente_id ON appointments(paciente_id);
CREATE INDEX IF NOT EXISTS idx_appointments_data ON appointments(data_consulta);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela patients
CREATE TRIGGER update_patients_updated_at 
    BEFORE UPDATE ON patients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para usuários autenticados
-- Pacientes
CREATE POLICY "Authenticated users can view patients" ON patients 
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert patients" ON patients 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update patients" ON patients 
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete patients" ON patients 
    FOR DELETE USING (auth.role() = 'authenticated');

-- Procedimentos
CREATE POLICY "Authenticated users can view procedures" ON procedures 
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert procedures" ON procedures 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update procedures" ON procedures 
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete procedures" ON procedures 
    FOR DELETE USING (auth.role() = 'authenticated');

-- Documentos
CREATE POLICY "Authenticated users can view documents" ON documents 
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert documents" ON documents 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update documents" ON documents 
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete documents" ON documents 
    FOR DELETE USING (auth.role() = 'authenticated');

-- Agendamentos
CREATE POLICY "Authenticated users can view appointments" ON appointments 
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert appointments" ON appointments 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update appointments" ON appointments 
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete appointments" ON appointments 
    FOR DELETE USING (auth.role() = 'authenticated');

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO patients (nome_completo, cpf, email, telefone, endereco, data_nascimento, status) VALUES
('João Silva Santos', '12345678901', 'joao.silva@email.com', '11987654321', 'Rua das Flores, 123 - São Paulo, SP', '1985-03-15', 'em_tratamento'),
('Maria Oliveira Costa', '98765432109', 'maria.oliveira@email.com', '11876543210', 'Av. Paulista, 456 - São Paulo, SP', '1990-07-22', 'em_tratamento'),
('Pedro Henrique Lima', '45678912345', 'pedro.lima@email.com', '11765432109', 'Rua Augusta, 789 - São Paulo, SP', '1978-12-03', 'pendente')
ON CONFLICT (cpf) DO NOTHING;

-- Inserir alguns procedimentos de exemplo
INSERT INTO procedures (paciente_id, dente_numero, procedimento, observacoes, data_procedimento) 
SELECT 
    p.id,
    11,
    'Restauração',
    'Restauração em resina composta',
    CURRENT_DATE - INTERVAL '5 days'
FROM patients p WHERE p.cpf = '12345678901'
ON CONFLICT DO NOTHING;

INSERT INTO procedures (paciente_id, dente_numero, procedimento, observacoes, data_procedimento) 
SELECT 
    p.id,
    21,
    'Limpeza',
    'Profilaxia e aplicação de flúor',
    CURRENT_DATE - INTERVAL '10 days'
FROM patients p WHERE p.cpf = '12345678901'
ON CONFLICT DO NOTHING;

-- Inserir alguns agendamentos de exemplo
INSERT INTO appointments (paciente_id, data_consulta, hora_consulta, observacoes, status)
SELECT 
    p.id,
    CURRENT_DATE + INTERVAL '1 day',
    '09:00',
    'Consulta de rotina',
    'agendada'
FROM patients p WHERE p.cpf = '12345678901'
ON CONFLICT DO NOTHING;

INSERT INTO appointments (paciente_id, data_consulta, hora_consulta, observacoes, status)
SELECT 
    p.id,
    CURRENT_DATE + INTERVAL '1 day',
    '14:30',
    'Avaliação pós-extração',
    'agendada'
FROM patients p WHERE p.cpf = '98765432109'
ON CONFLICT DO NOTHING;