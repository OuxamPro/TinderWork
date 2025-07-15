<?php
require_once 'config.php';

try {
    $sql = file_get_contents(__DIR__ . '/create_swipes_table.sql');
    $pdo->exec($sql);
    echo "Table swipes créée avec succès\n";
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
} 