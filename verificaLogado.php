<?php
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secretKey = 'edimilson'; // Mesma chave usada em login.php
$algoritmo = 'HS256';

$token = $_GET['token'] ?? ''; // Espera o token via GET

if ($token) {
    try {
        $decoded = JWT::decode($token, new Key($secretKey, $algoritmo));
        echo json_encode(['message' => 'Usuário está logado.', 'usuario' => $decoded->username]);
        echo json_encode($decoded);
        echo json_encode(time());
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['message' => 'Token inválido.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Token não fornecido.']);
}
?>

