// Aguardar o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const addPatientBtn = document.getElementById('addPatientBtn');
    const addPatientModal = document.getElementById('addPatientModal');
    const viewPatientModal = document.getElementById('viewPatientModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const addPatientForm = document.getElementById('addPatientForm');
    const patientsTableBody = document.getElementById('patientsTableBody');
    const searchPatient = document.getElementById('searchPatient');
    const statusFilter = document.getElementById('statusFilter');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Dados de exemplo de pacientes
    const pacientes = [
        {
            id: 1,
            nome: 'Carlos Silva',
            email: 'carlos.silva@email.com',
            telefone: '(11) 99876-5432',
            ultimaConsulta: '10/04/2025',
            proximaConsulta: '25/05/2025',
            status: 'active',
            endereco: 'Rua das Flores, 123',
            dataNascimento: '15/08/1985',
            profissao: 'Engenheiro',
            observacoes: 'Paciente com histórico de hipertensão. Alérgico a penicilina.'
        },
        {
            id: 2,
            nome: 'Ana Oliveira',
            email: 'ana.oliveira@email.com',
            telefone: '(11) 98765-4321',
            ultimaConsulta: '15/03/2025',
            proximaConsulta: '20/06/2025',
            status: 'pending',
            endereco: 'Av. Paulista, 1000',
            dataNascimento: '22/05/1990',
            profissao: 'Advogada',
            observacoes: 'Sensibilidade dentária. Necessita de tratamento para bruxismo.'
        },
        {
            id: 3,
            nome: 'Marcos Souza',
            email: 'marcos.souza@email.com',
            telefone: '(11) 97654-3210',
            ultimaConsulta: '05/02/2025',
            proximaConsulta: '',
            status: 'completed',
            endereco: 'Rua Augusta, 500',
            dataNascimento: '10/12/1978',
            profissao: 'Médico',
            observacoes: 'Tratamento ortodôntico concluído.'
        }
    ];

    // Carregar os pacientes na tabela
    function carregarPacientes(pacientes) {
        patientsTableBody.innerHTML = '';
        
        pacientes.forEach(paciente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="patient-name">${paciente.nome}</div>
                </td>
                <td>
                    <div>${paciente.email}</div>
                    <div>${paciente.telefone}</div>
                </td>
                <td>${paciente.ultimaConsulta || 'N/A'}</td>
                <td>${paciente.proximaConsulta || 'Não agendada'}</td>
                <td>
                    <span class="status-badge ${paciente.status}">
                        ${getStatusLabel(paciente.status)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon view" data-id="${paciente.id}" title="Ver detalhes">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon edit" data-id="${paciente.id}" title="Editar">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="btn-icon delete" data-id="${paciente.id}" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            patientsTableBody.appendChild(row);
        });
        
        // Adicionar event listeners para os botões de ação
        document.querySelectorAll('.btn-icon.view').forEach(btn => {
            btn.addEventListener('click', function() {
                const pacienteId = parseInt(this.getAttribute('data-id'));
                const paciente = pacientes.find(p => p.id === pacienteId);
                abrirPerfilPaciente(paciente);
            });
        });
    }
    
    // Abrir o modal de perfil do paciente
    function abrirPerfilPaciente(paciente) {
        document.getElementById('viewPatientName').textContent = paciente.nome;
        document.getElementById('viewPatientAge').textContent = calcularIdade(paciente.dataNascimento) + ' anos';
        document.getElementById('viewPatientContact').textContent = paciente.email + ' • ' + paciente.telefone;
        document.getElementById('viewPatientStatusBadge').className = 'status-badge ' + paciente.status;
        document.getElementById('viewPatientStatusBadge').textContent = getStatusLabel(paciente.status);
        document.getElementById('viewPatientAddress').textContent = paciente.endereco;
        document.getElementById('viewPatientBirthdate').textContent = paciente.dataNascimento;
        document.getElementById('viewPatientProfession').textContent = paciente.profissao;
        document.getElementById('viewPatientNotes').textContent = paciente.observacoes;
        
        viewPatientModal.style.display = 'block';
    }
    
    // Calcular idade a partir da data de nascimento (formato DD/MM/AAAA)
    function calcularIdade(dataNascimento) {
        const partes = dataNascimento.split('/');
        const dataNasc = new Date(partes[2], partes[1] - 1, partes[0]);
        const hoje = new Date();
        let idade = hoje.getFullYear() - dataNasc.getFullYear();
        const mesAtual = hoje.getMonth();
        const mesNasc = dataNasc.getMonth();
        
        if (mesAtual < mesNasc || (mesAtual === mesNasc && hoje.getDate() < dataNasc.getDate())) {
            idade--;
        }
        
        return idade;
    }
    
    // Retornar o label do status
    function getStatusLabel(status) {
        switch(status) {
            case 'active': return 'Ativo';
            case 'pending': return 'Pendente';
            case 'completed': return 'Concluído';
            case 'cancelled': return 'Cancelado';
            default: return 'Desconhecido';
        }
    }
    
    // Filtrar pacientes
    function filtrarPacientes() {
        const termo = searchPatient.value.toLowerCase();
        const status = statusFilter.value;
        
        const pacientesFiltrados = pacientes.filter(paciente => {
            const matchTermo = paciente.nome.toLowerCase().includes(termo) || 
                             paciente.email.toLowerCase().includes(termo) ||
                             paciente.telefone.includes(termo);
            
            const matchStatus = status === 'all' || paciente.status === status;
            
            return matchTermo && matchStatus;
        });
        
        carregarPacientes(pacientesFiltrados);
    }
    
    // Event Listeners
    
    // Abrir o modal para adicionar paciente
    addPatientBtn.addEventListener('click', function() {
        addPatientModal.style.display = 'block';
    });
    
    // Fechar os modais
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            addPatientModal.style.display = 'none';
            viewPatientModal.style.display = 'none';
        });
    });
    
    // Botão cancelar no formulário
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            addPatientModal.style.display = 'none';
        });
    }
    
    // Fechar o modal ao clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === addPatientModal) {
            addPatientModal.style.display = 'none';
        } else if (event.target === viewPatientModal) {
            viewPatientModal.style.display = 'none';
        }
    });
    
    // Evento de envio do formulário
    addPatientForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulação de adição de paciente (em um cenário real, isso seria enviado para o backend)
        const novoPaciente = {
            id: pacientes.length + 1,
            nome: document.getElementById('patientName').value,
            email: document.getElementById('patientEmail').value,
            telefone: document.getElementById('patientPhone').value,
            endereco: document.getElementById('patientAddress').value,
            dataNascimento: formatarData(document.getElementById('patientBirthdate').value),
            observacoes: document.getElementById('patientNotes').value,
            status: 'active',
            ultimaConsulta: '',
            proximaConsulta: ''
        };
        
        pacientes.unshift(novoPaciente);
        carregarPacientes(pacientes);
        addPatientModal.style.display = 'none';
        addPatientForm.reset();
        
        // Mostrar mensagem de sucesso
        alert('Paciente adicionado com sucesso!');
    });
    
    // Alternar entre as abas no perfil do paciente
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover classe active de todas as abas
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Adicionar classe active na aba clicada
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Eventos de filtro e pesquisa
    searchPatient.addEventListener('input', filtrarPacientes);
    statusFilter.addEventListener('change', filtrarPacientes);
    
    // Formatar data do input para o formato DD/MM/AAAA
    function formatarData(dataInput) {
        if (!dataInput) return '';
        
        const data = new Date(dataInput);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        
        return `${dia}/${mes}/${ano}`;
    }
    
    // Efeito para o sticky note
    const stickyNote = document.querySelector('.sticky-note');
    if (stickyNote) {
        // Adicionar comportamento de arraste
        let isDragging = false;
        let offsetX, offsetY;

        stickyNote.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - stickyNote.getBoundingClientRect().left;
            offsetY = e.clientY - stickyNote.getBoundingClientRect().top;
            stickyNote.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                stickyNote.style.left = (e.clientX - offsetX) + 'px';
                stickyNote.style.top = (e.clientY - offsetY) + 'px';
                stickyNote.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            stickyNote.style.cursor = 'grab';
        });
    }
    
    // Inicializar a tabela
    carregarPacientes(pacientes);
}); 