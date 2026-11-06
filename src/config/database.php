<?php

Class Database {
    public static function connect(): PDO{
        $host = 'localhost';
        $dbname = 'bd_users';
        $user = 'root';
        $password = '';

        $dsn = "mysql:host=$host; dbname=$dbname; charset=utf8mb4";

        return new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
    }
}