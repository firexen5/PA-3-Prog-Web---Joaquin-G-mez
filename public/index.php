<?php

if (PHP_SAPI === 'cli-server') {
    $ruta = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    if ($ruta !== '/' && $ruta !== '/index.php' && is_file(__DIR__ . $ruta)) {
        return false;
    }
}
require_once __DIR__ . '/../src/config/database.php';
require_once __DIR__ . '/../src/models/Users.php';
require_once __DIR__ . '/../src/controllers/UsersController.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $db = Database::connect();

    $users = new Users($db);

    $controller = new UsersController($users);

    require_once __DIR__ . '/../src/routes/api.php';

} catch (Throwable $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        'error' => 'Error interno del servidor',
        'detalle' => $e->getMessage()
    ]);
}