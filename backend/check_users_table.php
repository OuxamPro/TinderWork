<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inclure la configuration de la base de données
require_once 'config.php';

try {
    // Récupérer la structure de la table users
    $stmt = $pdo->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h2>Structure actuelle de la table users</h2>";
    echo "<pre>";
    echo "Nombre de colonnes : " . count($columns) . "\n\n";
    
    foreach ($columns as $column) {
        echo "Colonne : " . $column['Field'] . "\n";
        echo "Type : " . $column['Type'] . "\n";
        echo "Null : " . $column['Null'] . "\n";
        echo "Key : " . $column['Key'] . "\n";
        echo "Default : " . $column['Default'] . "\n";
        echo "Extra : " . $column['Extra'] . "\n";
        echo "------------------------\n";
    }
    echo "</pre>";
    
} catch (PDOException $e) {
    echo "<h2>Erreur</h2>";
    echo "<pre>";
    echo "Erreur lors de la vérification de la table : " . $e->getMessage();
    echo "</pre>";
}
?> 