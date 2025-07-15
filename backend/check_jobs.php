<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

header('Content-Type: application/json');

try {
    // Vérifier le contenu de la table jobs
    $stmt = $pdo->query("SELECT * FROM jobs");
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'count' => count($jobs),
        'jobs' => $jobs
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => 'Erreur: ' . $e->getMessage()]);
}
?> 