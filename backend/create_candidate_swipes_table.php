<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inclure la configuration de la base de données
require_once 'config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Créer la table candidate_swipes si elle n'existe pas
    $pdo->exec("CREATE TABLE IF NOT EXISTS candidate_swipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recruiter_id INT NOT NULL,
        candidate_id INT NOT NULL,
        action ENUM('like', 'dislike') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_swipe (recruiter_id, candidate_id)
    )");
    
    echo "Table candidate_swipes créée avec succès !";
} catch (PDOException $e) {
    echo "Erreur lors de la création de la table candidate_swipes : " . $e->getMessage() . "\n";
}
?> 