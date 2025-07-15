<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inclure la configuration de la base de données
require_once 'config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Créer la table users si elle n'existe pas
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        role ENUM('candidate', 'recruiter') NOT NULL,
        token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    // Vérifier si la colonne token existe
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'token'");
    if ($stmt->rowCount() === 0) {
        // Ajouter la colonne token si elle n'existe pas
        $pdo->exec("ALTER TABLE users ADD COLUMN token VARCHAR(255)");
    }

    // Créer la table des compétences si elle n'existe pas
    $pdo->exec("CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
    )");

    // Créer la table de liaison user_skills si elle n'existe pas
    $pdo->exec("CREATE TABLE IF NOT EXISTS user_skills (
        user_id INT,
        skill_id INT,
        PRIMARY KEY (user_id, skill_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
    )");

    // Liste des compétences à insérer
    $skills = [
        'JavaScript', 'Python', 'Java', 'C++', 'PHP',
        'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js',
        'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
        'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind CSS',
        'Git', 'Docker', 'AWS', 'Azure', 'Linux',
        'Agile', 'Scrum', 'DevOps', 'CI/CD'
    ];

    // Commencer une transaction pour l'insertion des compétences
    $pdo->beginTransaction();

    try {
        // Préparer la requête d'insertion
        $stmt = $pdo->prepare("INSERT IGNORE INTO skills (name) VALUES (?)");

        // Insérer chaque compétence
        foreach ($skills as $skill) {
            $stmt->execute([$skill]);
        }

        // Valider la transaction
        $pdo->commit();
        echo "Base de données initialisée avec succès !";
    } catch (PDOException $e) {
        // Annuler la transaction en cas d'erreur
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
} catch (PDOException $e) {
    echo "Erreur lors de l'initialisation de la base de données : " . $e->getMessage() . "\n";
}
?> 