<?php
// Carregar os dados de usuários de um arquivo JSON
$usersFile = 'bd/users.json';
$users = json_decode(file_get_contents($usersFile), true);

// Receber dados do cliente
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? null;
$newPassword = $data['newPassword'] ?? null;

// Verificar se o usuário existe
if (!isset($users[$username])) {
    echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
    exit;
}

// Validar nova senha
if ($newPassword) {
    // Atualizar a senha do usuário
    $users[$username]['password'] = $newPassword;
    
    // Salvar as alterações no arquivo JSON
    file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true, 'message' => 'Senha atualizada com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Senha inválida']);
}
?>
