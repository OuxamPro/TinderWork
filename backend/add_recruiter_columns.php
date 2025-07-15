<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inclure la configuration de la base de données
require_once 'config.php';

try {
    // Lire le fichier SQL
    $sql = file_get_contents('add_recruiter_columns.sql');
    
    // Exécuter la requête SQL
    $pdo->exec($sql);
    
    echo "<h2>Succès</h2>";
    echo "<p>Les colonnes pour les recruteurs ont été ajoutées avec succès.</p>";
    
    // Vérifier la structure mise à jour
    $stmt = $pdo->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h3>Structure mise à jour de la table users</h3>";
    echo "<pre>";
    foreach ($columns as $column) {
        if (in_array($column['Field'], ['companyName', 'companyDescription', 'companyLocation', 'companyWebsite', 'companySize', 'industry'])) {
            echo "Colonne : " . $column['Field'] . "\n";
            echo "Type : " . $column['Type'] . "\n";
            echo "Null : " . $column['Null'] . "\n";
            echo "------------------------\n";
        }
    }
    echo "</pre>";
    
} catch (PDOException $e) {
    echo "<h2>Erreur</h2>";
    echo "<pre>";
    echo "Erreur lors de l'ajout des colonnes : " . $e->getMessage();
    echo "</pre>";
}
?> 