# 🦷 Clínica Odontológica - Sistema de Gestão de Pacientes

Este sistema tem como objetivo auxiliar a gestão de pacientes em clínicas odontológicas, oferecendo funcionalidades completas de agenda, prontuário eletrônico, odontograma, anamnese, tratamentos, orçamentos e histórico clínico. 
Aqui está a estrutura do sistema:

---

## 📆 Agenda

- Integração com Google Agenda (via Google Apps Script ou API do Google).
- Funcionalidades padrão de agendamento.
- Permite marcar e gerenciar consultas.

---

## 📁 Prontuário

- Filtro por **status** e **data da próxima consulta**.
- Acesso à página de cada paciente

---

## 👤 Paciente

### Informações Gerais (Header)
- CPF, foto, telefone, idade e nacionalidade/naturalidade.
- Possibilidade de alteração do **status** do paciente:  
  `"alta"`, `"em tratamento"` ou `"pendente"`.

### Anamnese
- Formulário preenchível e editável com:
  - Respostas **sim/não** (ex: fuma?)
  - Respostas **curtas** (ex: tipo sanguíneo)

### Odontograma
- Utiliza um modelo de odontograma **geométrico** (vide assets)
- Suporte a **vários odontogramas** organizados por data.
- Funcionalidades:
  - Marcar dentes com **cores personalizadas**
  - Adicionar **legenda** com observações

### Tratamentos
- Cada tratamento é exibido em uma **aba separada**.
- Estrutura:
  - **Descrição** do problema
  - **Procedimentos** em checklist
    - Uma vez que todos os procedimentos foram concluídos, o tratamento é finalizado 
  - **Notas** complementares
  - **Anexos** (ex: raio-X)

### Orçamento
- Cada **procedimento** tem um valor associado.
- Selecionando os procedimentos de determinado tratamento, é possível:
  - Gerar um **orçamento automático** com base em modelo (preferencialmente em PDF)

---

### Consultas

- Consultas podem ser agendadas:
  - Diretamente pela **agenda**
  - Por meio desta aba, na página do **paciente**
- Funcionalidades:
  - Marcar como **concluída**
  - Registrar um **resumo clínico**, vinculado ao histórico do paciente
    - O resumo pode ser manual ou automático, e objetiva registrar o que aconteceu em uma consulta

---

### Histórico / Evolução

- Possui o formato de linha do tempo
- Uma entrada é vinculada a uma **consulta**.
- Após a conclusão da consulta, o **resumo clínico** é automaticamente registrado aqui.

---

## ✅ Status

Projeto em desenvolvimento.
