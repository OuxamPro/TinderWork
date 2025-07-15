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
    // Supprimer la table job_swipes si elle existe
    $pdo->exec("DROP TABLE IF EXISTS job_swipes");
    
    // Créer la table job_swipes avec la bonne référence
    $pdo->exec("CREATE TABLE IF NOT EXISTS job_swipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        job_id INT NOT NULL,
        action ENUM('like', 'dislike') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        UNIQUE KEY unique_swipe (user_id, job_id)
    )");
    
    echo "Table job_swipes recréée avec succès avec la bonne référence à la table jobs !";
} catch (PDOException $e) {
    echo "Erreur lors de la création de la table job_swipes : " . $e->getMessage() . "\n";
}
?> 