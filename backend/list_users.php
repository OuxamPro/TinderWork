<?php
require_once 'config.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("SELECT id, firstName, lastName, email, role, token FROM users");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($users, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?> 