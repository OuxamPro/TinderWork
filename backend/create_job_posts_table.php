<?php
require_once 'config.php';

try {
    $sql = file_get_contents(__DIR__ . '/create_job_posts_table.sql');
    $pdo->exec($sql);
    echo "Table job_posts créée avec succès\n";
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
} 