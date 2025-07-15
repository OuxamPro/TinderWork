<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inclure la configuration de la base de données
require_once __DIR__ . '/config.php';

try {
    // Créer la table skills si elle n'existe pas
    $createTableSql = file_get_contents(__DIR__ . '/create_skills_table.sql');
    $pdo->exec($createTableSql);
    
    // Lire le contenu du fichier SQL pour les compétences
    $skillsSql = file_get_contents(__DIR__ . '/add_more_skills.sql');
    
    // Exécuter les requêtes SQL pour ajouter les compétences
    $pdo->exec($skillsSql);
    
    // Vérifier le nombre de compétences ajoutées
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM skills");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "Les compétences ont été ajoutées avec succès. Nombre total de compétences : " . $result['count'];
} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage();
}
?> 