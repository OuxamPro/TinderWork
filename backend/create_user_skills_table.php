<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inclure la configuration de la base de données
require_once 'config.php';

try {
    // Lire le fichier SQL
    $sql = file_get_contents(__DIR__ . '/create_user_skills_table.sql');
    
    // Exécuter la requête SQL
    $pdo->exec($sql);
    
    echo "<h2>Succès</h2>";
    echo "<p>La table user_skills a été créée avec succès.</p>";
    
    // Vérifier la structure de la table
    $stmt = $pdo->query("DESCRIBE user_skills");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h3>Structure de la table user_skills</h3>";
    echo "<pre>";
    foreach ($columns as $column) {
        echo "Colonne : " . $column['Field'] . "\n";
        echo "Type : " . $column['Type'] . "\n";
        echo "Null : " . $column['Null'] . "\n";
        echo "Key : " . $column['Key'] . "\n";
        echo "------------------------\n";
    }
    echo "</pre>";
    
} catch (PDOException $e) {
    echo "<h2>Erreur</h2>";
    echo "<pre>";
    echo "Erreur lors de la création de la table : " . $e->getMessage();
    echo "</pre>";
}
?> 