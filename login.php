<?php
session_start();
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Carregar os dados de login de um arquivo JSON para fins de exemplo
$users = json_decode(file_get_contents('bd/users.json'), true);
$secretKey = 'edimilson'; // Troque pelo seu segredo
$algoritmo = 'HS256';

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? null;
$password = $data['password'] ?? null;

// Função para limpar o nome de usuário
function sanitizeUsername($username) {
    return strtolower(preg_replace('/[^a-zA-Z0-9_]/', '', $username));
}

// Sanitize the username
if ($username) {
    $username = sanitizeUsername($username);
}

if ($username && $password && isset($users[$username]) && $users[$username]['password'] === $password) {
    // Gera o token
    $token = JWT::encode([
        'username' => $username,
        'exp' => time() + 3600 // Token expira em 1 hora
    ], $secretKey, $algoritmo);

    echo json_encode(['success' => true, 'token' => $token]);
} else {
    echo json_encode(['success' => false]);
}
?>
