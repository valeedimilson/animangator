<?php
// Carregar os dados de login de um arquivo JSON
$usersFile = 'bd/users.json';
$users = json_decode(file_get_contents($usersFile), true);

$data = json_decode(file_get_contents('php://input'), true);
$newUsername = $data['username'] ?? null;
$newPassword = $data['password'] ?? null;

// Função para limpar o nome de usuário
function sanitizeUsername($username) {
    // Remove caracteres especiais e converte para minúsculas
    return strtolower(preg_replace('/[^a-zA-Z0-9_]/', '', $username));
}

// Sanitize the username
if ($newUsername) {
    $newUsername = sanitizeUsername($newUsername);
}

// Verificar se o usuário já existe
if (isset($users[$newUsername])) {
    echo json_encode(['success' => false, 'message' => 'Usuário já existe']);
    exit;
}

// Adicionar novo usuário
if ($newUsername && $newPassword) {
    $users[$newUsername] = ['password' => $newPassword];
    file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Nome de usuário ou senha inválidos']);
}
?>
