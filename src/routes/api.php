<?php

$method = $_SERVER['REQUEST_METHOD'];

$path = parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);

IF ($path === '/api/users' && $method === 'GET'){
    $controller -> All();
    exit;
}

if ($path === '/api/users/register' && $method === 'POST'){
    $controller -> guardar();
    exit;
}

if (preg_match('#^/api/users/([1-9][0-9]*)$#', $path, $matches)){

    $id = (int) $matches [1];

    if($method === 'GET'){
        $controller -> mostrar($id);
        exit;
    }

    if($method === 'PUT'){
        $controller -> actualizar($id);
        exit;
    }

    if($method === 'DELETE'){
        $controller -> borrar($id);
        exit;
    }
}
http_response_code(404);

echo json_encode([
    'error' => 'Endpoint no encontrado'
]);
