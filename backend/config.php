<?php
// Configuration de la base de données
$host = '127.0.0.1';
$port = '3306';
$dbname = 'tinderwork';
$user = 'root';
$password = '';

try {
    // Créer la connexion PDO
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    // Si la base de données n'existe pas, la créer
    if ($e->getCode() == 1049) {
        try {
            $pdo = new PDO("mysql:host=$host;port=$port", $user, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Créer la base de données
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            
            // Sélectionner la base de données
            $pdo->exec("USE `$dbname`");
        } catch (PDOException $e) {
            error_log("Erreur lors de la création de la base de données : " . $e->getMessage());
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['message' => 'Erreur lors de la création de la base de données']);
            exit();
        }
    } else {
        error_log("Erreur de connexion : " . $e->getMessage());
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['message' => 'Erreur de connexion à la base de données']);
        exit();
    }
}
?>