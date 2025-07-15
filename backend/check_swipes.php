<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

header('Content-Type: application/json');

try {
    // Vérifier les swipes de candidats
    $stmt = $pdo->query("SELECT * FROM job_swipes");
    $jobSwipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Vérifier les swipes de recruteurs
    $stmt = $pdo->query("SELECT * FROM candidate_swipes");
    $candidateSwipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'job_swipes_count' => count($jobSwipes),
        'job_swipes' => $jobSwipes,
        'candidate_swipes_count' => count($candidateSwipes),
        'candidate_swipes' => $candidateSwipes
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => 'Erreur: ' . $e->getMessage()]);
}
?> 