<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Définir le type de contenu
header('Content-Type: application/json');

// Inclure la configuration de la base de données
require_once 'config.php';

try {
    // Récupérer toutes les compétences
    $stmt = $pdo->query("SELECT id, name FROM skills ORDER BY name");
    $skills = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        'message' => 'Liste des compétences récupérée avec succès',
        'skills' => $skills
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur lors de la récupération des compétences: ' . $e->getMessage()]);
}
?> 