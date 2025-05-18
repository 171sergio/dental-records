// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky note effect
    const stickyNote = document.querySelector('.sticky-note');
    if (stickyNote) {
        // Add a slight random rotation on page load
        const randomRotation = Math.random() * 10 - 5;
        stickyNote.style.transform = `rotate(${randomRotation}deg)`;

        // Make the sticky note draggable
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
                stickyNote.style.right = 'auto'; // Clear the right property when moving
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            stickyNote.style.cursor = 'grab';
        });

        // Add hover effect
        stickyNote.addEventListener('mouseover', function() {
            this.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
        });

        stickyNote.addEventListener('mouseout', function() {
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });
    }

    // Add animation to feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    
    function checkScroll() {
        featureCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight * 0.8) {
                card.classList.add('animate-fade-in');
                card.style.opacity = 1;
                card.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state for cards
    featureCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    // Initial check in case elements are already in view on page load
    checkScroll();

    // Patient management functionality
    setupPatientFunctionality();
});

function setupPatientFunctionality() {
    // Elements in the interface
    const addPatientBtn = document.getElementById('addPatientBtn');
    const addPatientModal = document.getElementById('addPatientModal');
    const viewPatientModal = document.getElementById('viewPatientModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const addPatientForm = document.getElementById('addPatientForm');
    const searchPatient = document.getElementById('searchPatient');
    const statusFilter = document.getElementById('statusFilter');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Load patient data
    let pacientes = [];
    
    // Fetch patients data from PHP
    function fetchPacientes() {
        fetch('pacientes.php?action=getPacientes')
            .then(response => response.json())
            .then(data => {
                pacientes = data;
                setupViewButtons();
            })
            .catch(error => console.error('Error loading patients:', error));
    }
    
    // Open the modal for adding a patient
    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', function() {
            addPatientModal.style.display = 'block';
        });
    }
    
    // Close the modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            addPatientModal.style.display = 'none';
            viewPatientModal.style.display = 'none';
        });
    });
    
    // Cancel button in the form
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            addPatientModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === addPatientModal) {
            addPatientModal.style.display = 'none';
        } else if (event.target === viewPatientModal) {
            viewPatientModal.style.display = 'none';
        }
    });
    
    // Setup view buttons after the page loads
    function setupViewButtons() {
        document.querySelectorAll('.btn-icon.view').forEach(btn => {
            btn.addEventListener('click', function() {
                const pacienteId = parseInt(this.getAttribute('data-id'));
                const paciente = pacientes.find(p => p.id === pacienteId);
                if (paciente) {
                    abrirPerfilPaciente(paciente);
                }
            });
        });
    }
    
    // Open the patient profile
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
    
    // Calculate age from birthdate (DD/MM/YYYY format)
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
    
    // Return the status label
    function getStatusLabel(status) {
        switch(status) {
            case 'active': return 'Ativo';
            case 'pending': return 'Pendente';
            case 'completed': return 'Concluído';
            case 'cancelled': return 'Cancelado';
            default: return 'Desconhecido';
        }
    }
    
    // Filter patients
    function filtrarPacientes() {
        const termo = searchPatient.value.toLowerCase();
        const status = statusFilter.value;
        
        const rows = document.querySelectorAll('#patientsTableBody tr');
        
        rows.forEach(row => {
            const nome = row.querySelector('.patient-name').textContent.toLowerCase();
            const email = row.querySelectorAll('td:nth-child(2) div')[0].textContent.toLowerCase();
            const telefone = row.querySelectorAll('td:nth-child(2) div')[1].textContent;
            const statusBadge = row.querySelector('.status-badge').classList[1];
            
            const matchTermo = nome.includes(termo) || email.includes(termo) || telefone.includes(termo);
            const matchStatus = status === 'all' || statusBadge === status;
            
            row.style.display = (matchTermo && matchStatus) ? '' : 'none';
        });
    }
    
    // Tab switching in the patient profile
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to the clicked tab
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Filter and search events
    if (searchPatient) {
        searchPatient.addEventListener('input', filtrarPacientes);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filtrarPacientes);
    }
    
    // Setup view buttons
    setupViewButtons();
    
    // Fetch patients data initially
    fetchPacientes();
}

// Mobile navigation toggle (placeholder for future expansion)
// This could be expanded with actual mobile menu functionality
function handleMobileNavigation() {
    // Add mobile navigation implementation here
    console.log('Mobile navigation functionality placeholder');
} 