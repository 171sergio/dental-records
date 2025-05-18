<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Gestão de Pacientes</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="main-header">
        <div class="container">
            <div class="logo">
                <h1>DentalCare</h1>
            </div>
            <nav class="main-nav">
                <ul>
                    <li><a href="#" class="active">Dashboard</a></li>
                    <li><a href="#">Pacientes</a></li>
                    <li><a href="#">Agenda</a></li>
                    <li><a href="#">Financeiro</a></li>
                    <li><a href="#">Configurações</a></li>
                </ul>
            </nav>
            <div class="user-menu">
                <span class="user-name">Dr. Silva</span>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" class="user-avatar">
            </div>
        </div>
    </header>

    <div class="dashboard-container">
        <div class="sidebar">
            <div class="sidebar-header">
                <h3>Menu Rápido</h3>
            </div>
            <ul class="sidebar-menu">
                <li><a href="#"><i class="fas fa-home"></i> Dashboard</a></li>
                <li class="active"><a href="#"><i class="fas fa-user-injured"></i> Pacientes</a></li>
                <li><a href="#"><i class="fas fa-calendar-alt"></i> Agenda</a></li>
                <li><a href="#"><i class="fas fa-clipboard-list"></i> Prontuários</a></li>
                <li><a href="#"><i class="fas fa-chart-line"></i> Relatórios</a></li>
                <li><a href="#"><i class="fas fa-cog"></i> Configurações</a></li>
            </ul>
        </div>

        <main class="main-content">
            <div class="page-header">
                <h2>Gerenciamento de Pacientes</h2>
                <button id="addPatientBtn" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Novo Paciente
                </button>
            </div>

            <div class="filter-row">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchPatient" placeholder="Buscar paciente...">
                </div>
                <div class="filter-box">
                    <label for="statusFilter">Status:</label>
                    <select id="statusFilter">
                        <option value="all">Todos</option>
                        <option value="active">Ativo</option>
                        <option value="pending">Pendente</option>
                        <option value="completed">Concluído</option>
                        <option value="cancelled">Cancelado</option>
                    </select>
                </div>
            </div>

            <div class="patients-table-container">
                <table class="patients-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Contato</th>
                            <th>Última Consulta</th>
                            <th>Próxima Consulta</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="patientsTableBody">
                        <?php include 'pacientes.php'; ?>
                    </tbody>
                </table>
            </div>

            <div class="sticky-note">
                <h4>Lembretes</h4>
                <p>Conferir exames da Ana Oliveira</p>
                <p>Ligar para confirmar consulta do Marcos</p>
            </div>
        </main>
    </div>

    <!-- Modal para adicionar paciente -->
    <div id="addPatientModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Novo Paciente</h3>
                <span class="close-modal">&times;</span>
            </div>
            <form id="addPatientForm" action="pacientes.php" method="post">
                <input type="hidden" name="action" value="add">
                <div class="form-row">
                    <div class="form-group">
                        <label for="patientName">Nome Completo</label>
                        <input type="text" id="patientName" name="patientName" required>
                    </div>
                    <div class="form-group">
                        <label for="patientEmail">Email</label>
                        <input type="email" id="patientEmail" name="patientEmail" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="patientPhone">Telefone</label>
                        <input type="tel" id="patientPhone" name="patientPhone" required>
                    </div>
                    <div class="form-group">
                        <label for="patientBirthdate">Data de Nascimento</label>
                        <input type="date" id="patientBirthdate" name="patientBirthdate" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="patientAddress">Endereço</label>
                    <input type="text" id="patientAddress" name="patientAddress" required>
                </div>
                <div class="form-group">
                    <label for="patientNotes">Observações</label>
                    <textarea id="patientNotes" name="patientNotes" rows="3"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn cancel-btn">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal para visualizar paciente -->
    <div id="viewPatientModal" class="modal">
        <div class="modal-content patient-profile">
            <div class="modal-header">
                <h3>Perfil do Paciente</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="profile-header">
                <div class="patient-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="patient-info">
                    <h2 id="viewPatientName">Nome do Paciente</h2>
                    <div class="patient-meta">
                        <span id="viewPatientAge">35 anos</span> • 
                        <span id="viewPatientContact">email@exemplo.com • (11) 99999-9999</span>
                    </div>
                    <span id="viewPatientStatusBadge" class="status-badge active">Ativo</span>
                </div>
            </div>
            <div class="profile-tabs">
                <div class="tabs-header">
                    <button class="tab-btn active" data-tab="infoTab">Informações</button>
                    <button class="tab-btn" data-tab="historyTab">Histórico</button>
                    <button class="tab-btn" data-tab="treatmentTab">Tratamento</button>
                </div>
                <div class="tabs-content">
                    <div id="infoTab" class="tab-pane active">
                        <div class="info-group">
                            <div class="info-label">Endereço</div>
                            <div id="viewPatientAddress" class="info-value">Rua Exemplo, 123</div>
                        </div>
                        <div class="info-group">
                            <div class="info-label">Data de Nascimento</div>
                            <div id="viewPatientBirthdate" class="info-value">15/05/1988</div>
                        </div>
                        <div class="info-group">
                            <div class="info-label">Profissão</div>
                            <div id="viewPatientProfession" class="info-value">Engenheiro</div>
                        </div>
                        <div class="info-group">
                            <div class="info-label">Observações</div>
                            <div id="viewPatientNotes" class="info-value">Paciente com histórico de tratamento ortodôntico...</div>
                        </div>
                    </div>
                    <div id="historyTab" class="tab-pane">
                        <div class="history-timeline">
                            <div class="timeline-item">
                                <div class="timeline-date">10/04/2025</div>
                                <div class="timeline-content">
                                    <h4>Consulta de Rotina</h4>
                                    <p>Limpeza e avaliação geral. Sem problemas identificados.</p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-date">25/01/2025</div>
                                <div class="timeline-content">
                                    <h4>Tratamento de Canal</h4>
                                    <p>Iniciado tratamento no dente 36. Paciente relatou dor moderada.</p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-date">03/12/2024</div>
                                <div class="timeline-content">
                                    <h4>Consulta de Emergência</h4>
                                    <p>Paciente com dor intensa no dente 36. Prescrito analgésico.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="treatmentTab" class="tab-pane">
                        <div class="treatment-plan">
                            <h4>Plano de Tratamento Atual</h4>
                            <div class="treatment-item">
                                <div class="treatment-status completed">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="treatment-details">
                                    <div class="treatment-title">Avaliação Inicial</div>
                                    <div class="treatment-date">Concluído em 03/12/2024</div>
                                </div>
                            </div>
                            <div class="treatment-item">
                                <div class="treatment-status completed">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="treatment-details">
                                    <div class="treatment-title">Primeira sessão de tratamento de canal</div>
                                    <div class="treatment-date">Concluído em 25/01/2025</div>
                                </div>
                            </div>
                            <div class="treatment-item">
                                <div class="treatment-status in-progress">
                                    <i class="fas fa-spinner"></i>
                                </div>
                                <div class="treatment-details">
                                    <div class="treatment-title">Segunda sessão de tratamento de canal</div>
                                    <div class="treatment-date">Agendado para 25/05/2025</div>
                                </div>
                            </div>
                            <div class="treatment-item">
                                <div class="treatment-status pending">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="treatment-details">
                                    <div class="treatment-title">Restauração final</div>
                                    <div class="treatment-date">A agendar</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html> 