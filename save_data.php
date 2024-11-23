<?php
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['username']) && isset($data['items'])) {
    $directory = 'bd/json_usersDB';
    $filename = $directory . '/data_' . $data['username'] . '.json';

    if (!is_dir($directory)) {
        mkdir($directory, 0777, true);
    }

    file_put_contents($filename, json_encode($data['items']));
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
}
