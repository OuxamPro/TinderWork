<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

header('Content-Type: application/json');

try {
    // Récupérer le token du recruteur avec l'ID 2
    $stmt = $pdo->prepare("SELECT id, email, role, token FROM users WHERE id = 2 AND role = 'recruiter'");
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo json_encode([
            'user' => $user
        ]);
    } else {
        echo json_encode(['error' => 'Recruteur avec ID 2 non trouvé']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Erreur: ' . $e->getMessage()]);
}
?> 