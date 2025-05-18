<?php
// Array of patient data
$pacientes = [
    [
        'id' => 1,
        'nome' => 'Carlos Silva',
        'email' => 'carlos.silva@email.com',
        'telefone' => '(11) 99876-5432',
        'ultimaConsulta' => '10/04/2025',
        'proximaConsulta' => '25/05/2025',
        'status' => 'active',
        'endereco' => 'Rua das Flores, 123',
        'dataNascimento' => '15/08/1985',
        'profissao' => 'Engenheiro',
        'observacoes' => 'Paciente com histórico de hipertensão. Alérgico a penicilina.'
    ],
    [
        'id' => 2,
        'nome' => 'Ana Oliveira',
        'email' => 'ana.oliveira@email.com',
        'telefone' => '(11) 98765-4321',
        'ultimaConsulta' => '15/03/2025',
        'proximaConsulta' => '20/06/2025',
        'status' => 'pending',
        'endereco' => 'Av. Paulista, 1000',
        'dataNascimento' => '22/05/1990',
        'profissao' => 'Advogada',
        'observacoes' => 'Sensibilidade dentária. Necessita de tratamento para bruxismo.'
    ],
    [
        'id' => 3,
        'nome' => 'Marcos Souza',
        'email' => 'marcos.souza@email.com',
        'telefone' => '(11) 97654-3210',
        'ultimaConsulta' => '05/02/2025',
        'proximaConsulta' => '',
        'status' => 'completed',
        'endereco' => 'Rua Augusta, 500',
        'dataNascimento' => '10/12/1978',
        'profissao' => 'Médico',
        'observacoes' => 'Tratamento ortodôntico concluído.'
    ]
];

// Handle form submission if this is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];
    
    if ($action === 'add') {
        // In a real application, you would save this to a database
        // For now, we'll just redirect back to the main page
        header('Location: index.php');
        exit;
    }
}

// Function to get the status label
function getStatusLabel($status) {
    switch($status) {
        case 'active': return 'Ativo';
        case 'pending': return 'Pendente';
        case 'completed': return 'Concluído';
        case 'cancelled': return 'Cancelado';
        default: return 'Desconhecido';
    }
}

// Output the patients table rows if this file is included
foreach ($pacientes as $paciente) {
    echo '<tr>
        <td>
            <div class="patient-name">' . $paciente['nome'] . '</div>
        </td>
        <td>
            <div>' . $paciente['email'] . '</div>
            <div>' . $paciente['telefone'] . '</div>
        </td>
        <td>' . ($paciente['ultimaConsulta'] ?: 'N/A') . '</td>
        <td>' . ($paciente['proximaConsulta'] ?: 'Não agendada') . '</td>
        <td>
            <span class="status-badge ' . $paciente['status'] . '">
                ' . getStatusLabel($paciente['status']) . '
            </span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon view" data-id="' . $paciente['id'] . '" title="Ver detalhes">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon edit" data-id="' . $paciente['id'] . '" title="Editar">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="btn-icon delete" data-id="' . $paciente['id'] . '" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    </tr>';
}

// If this is an AJAX request for patient data (for JavaScript usage)
if (isset($_GET['action']) && $_GET['action'] === 'getPacientes') {
    header('Content-Type: application/json');
    echo json_encode($pacientes);
    exit;
}
?> 