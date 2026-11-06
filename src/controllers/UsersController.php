<?php

Class UsersController {
    public function __construct(private Users $users){}

    public function All(): void {
        
        echo json_encode(
            $this -> users -> getAll()
        );
    }

    public function guardar(): void{
        
        $data = json_decode(
            file_get_contents('php://input'),
            true
        );

        $id = $this -> users -> create($data);

        http_response_code(201);

        echo json_encode([
            'mensaje' => 'Usuario creado',
            'id' => $id
        ]);
    }

    public function mostrar(int $id): void {

        $users = $this -> users -> getById($id);

        if (!$users){
            http_response_code(404);

            echo json_encode([
                'error' => 'Usuario no encontrado'
            ]);
            
            return;
        }

        echo json_encode($users);
    }

    public function actualizar(int $id): void{
        
        $data = json_decode(
            file_get_contents('php://input'),
            true
        );

        $result = $this -> users -> update($id, $data);

        if ($result === 0) {
            http_response_code(404);

            echo json_encode([
                'error' => 'Usuario no encontrado o sin modificar'
            ]);

            return;
        }

        echo json_encode([
            'mensaje' => 'Usuario actualizado',
            'id' => $id
        ]);
    }

    public function borrar(int $id): void{
        $result = $this -> users -> delete($id);

        if ($result === 0){

            http_response_code(404);

            echo json_encode([
                'error' => 'Usuario no encontrado'
            ]);
            
            return;

        }
        http_response_code(204);

    }
}