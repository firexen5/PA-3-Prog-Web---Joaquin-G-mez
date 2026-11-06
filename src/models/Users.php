<?php

Class Users {
    public function __construct(private PDO $db) {}

    public function getAll(): array{

        $stmt = $this-> db -> query("SELECT * FROM usuarios");

        return $stmt -> fetchAll();
    }

    public function create(array $data): int {
        
        $stmt = $this -> db -> prepare(
            "INSERT INTO usuarios (nombre, email, contrasena)
            VALUES (?,?,?)"
            ); 

        $stmt -> execute([
            $data['nombre'],
            $data['email'],
            $data['contrasena']
        ]);

        return (int) $this -> db -> lastInsertId();
    }

    public function getById(int $id): array|false{

        $stmt = $this -> db -> prepare(
            "SELECT * FROM usuarios WHERE id = ?"
        );

        $stmt -> execute([$id]);

        return $stmt -> fetch();
    }

    public function update(int $id, array $data): int {

        $stmt = $this -> db -> prepare(
            "UPDATE usuarios 
            SET nombre = ?, email = ?, contrasena = ?
            WHERE id = ?"
        );

        $stmt -> execute([
            $data['nombre'],
            $data['email'],
            $data['contrasena'],
            $id
        ]);

        return $stmt -> rowCount();
    }

    public function delete(int $id): int {

        $stmt = $this -> db -> prepare(
            "DELETE FROM usuarios
            WHERE id = ?"
        );

        $stmt -> execute([$id]);

        return $stmt -> rowCount();
    }
}