<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inclure la configuration de la base de données
require_once 'config.php';

try {
    // Lire le fichier SQL
    $sql = file_get_contents('update_users_table.sql');
    
    // Diviser le fichier en requêtes individuelles
    $queries = array_filter(array_map('trim', explode(';', $sql)));
    
    echo "<h2>Mise à jour de la table users</h2>";
    echo "<pre>";
    
    // Exécuter chaque requête
    foreach ($queries as $query) {
        if (!empty($query)) {
            try {
                $pdo->exec($query);
                echo "Requête exécutée avec succès : " . substr($query, 0, 100) . "...\n";
            } catch (PDOException $e) {
                // Si la colonne existe déjà, ce n'est pas une erreur
                if (strpos($e->getMessage(), "Column already exists") !== false) {
                    echo "Info : " . $e->getMessage() . "\n";
                } else {
                    throw $e;
                }
            }
        }
    }
    
    echo "\nLa table users a été mise à jour avec succès pour les recruteurs.";
    echo "</pre>";
} catch (PDOException $e) {
    echo "<h2>Erreur</h2>";
    echo "<pre>";
    echo "Erreur lors de la mise à jour de la table : " . $e->getMessage();
    echo "</pre>";
}
?> 