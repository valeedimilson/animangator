<?php
if (isset($_GET['username'])) {
    $directory = 'bd/json_usersDB';
    $filename = $directory . '/data_' . $_GET['username'] . '.json';
    if (file_exists($filename)) {
        echo file_get_contents($filename);
    } else {
        echo json_encode([]);
    }
} else {
    echo json_encode([]);
}
