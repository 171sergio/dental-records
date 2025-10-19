-- Script para criar dados de exemplo no banco de dados
-- Execute este script diretamente no Supabase SQL Editor

-- Primeiro, desabilitar RLS temporariamente para permitir inserções
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE procedures DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- Inserir pacientes de exemplo
INSERT INTO patients (nome_completo, cpf, email, telefone, endereco, data_nascimento, status) VALUES
('João Silva Santos', '12345678901', 'joao.silva@email.com', '11987654321', 'Rua das Flores, 123 - São Paulo, SP', '1985-03-15', 'em_tratamento'),
('Maria Oliveira Costa', '98765432109', 'maria.oliveira@email.com', '11876543210', 'Av. Paulista, 456 - São Paulo, SP', '1990-07-22', 'ativo'),
('Pedro Henrique Lima', '45678912345', 'pedro.lima@email.com', '11765432109', 'Rua Augusta, 789 - São Paulo, SP', '1978-12-03', 'pendente'),
('Ana Carolina Souza', '32165498701', 'ana.souza@email.com', '11654321098', 'Rua Oscar Freire, 321 - São Paulo, SP', '1992-11-18', 'em_tratamento'),
('Carlos Eduardo Ferreira', '78912345601', 'carlos.ferreira@email.com', '11543210987', 'Av. Faria Lima, 654 - São Paulo, SP', '1980-05-30', 'ativo')
ON CONFLICT (cpf) DO NOTHING;

-- Inserir alguns procedimentos de exemplo
INSERT INTO procedures (paciente_id, dente_numero, procedimento, observacoes, data_procedimento) 
SELECT 
    p.id,
    11,
    'Restauração',
    'Restauração em resina composta no dente 11',
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
FROM patients p WHERE p.cpf = '98765432109'
ON CONFLICT DO NOTHING;

INSERT INTO procedures (paciente_id, dente_numero, procedimento, observacoes, data_procedimento) 
SELECT 
    p.id,
    16,
    'Extração',
    'Extração do dente 16 - siso superior direito',
    CURRENT_DATE - INTERVAL '15 days'
FROM patients p WHERE p.cpf = '45678912345'
ON CONFLICT DO NOTHING;

-- Inserir alguns agendamentos de exemplo
INSERT INTO appointments (paciente_id, data_consulta, hora_consulta, observacoes, status)
SELECT 
    p.id,
    CURRENT_DATE + INTERVAL '1 day',
    '09:00',
    'Consulta de rotina - avaliação geral',
    'agendada'
FROM patients p WHERE p.cpf = '12345678901'
ON CONFLICT DO NOTHING;

INSERT INTO appointments (paciente_id, data_consulta, hora_consulta, observacoes, status)
SELECT 
    p.id,
    CURRENT_DATE + INTERVAL '2 days',
    '14:30',
    'Retorno pós-extração',
    'agendada'
FROM patients p WHERE p.cpf = '45678912345'
ON CONFLICT DO NOTHING;

INSERT INTO appointments (paciente_id, data_consulta, hora_consulta, observacoes, status)
SELECT 
    p.id,
    CURRENT_DATE + INTERVAL '3 days',
    '10:15',
    'Continuação do tratamento de canal',
    'agendada'
FROM patients p WHERE p.cpf = '32165498701'
ON CONFLICT DO NOTHING;

INSERT INTO appointments (paciente_id, data_consulta, hora_consulta, observacoes, status)
SELECT 
    p.id,
    CURRENT_DATE,
    '16:00',
    'Consulta de emergência - dor de dente',
    'agendada'
FROM patients p WHERE p.cpf = '78912345601'
ON CONFLICT DO NOTHING;

-- Verificar se os dados foram inseridos
SELECT 'Pacientes inseridos:' as info, COUNT(*) as total FROM patients;
SELECT 'Procedimentos inseridos:' as info, COUNT(*) as total FROM procedures;
SELECT 'Agendamentos inseridos:' as info, COUNT(*) as total FROM appointments;

-- Mostrar alguns dados para verificação
SELECT nome_completo, email, status FROM patients LIMIT 5;