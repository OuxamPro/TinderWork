<?php
header('Access-Control-Allow-Origin: http://localhost:3001');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inclure la configuration de la base de données
require_once 'config.php';

// Vérifier si la requête est une requête POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les données JSON du corps de la requête
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Vérifier si toutes les données requises sont présentes
    if (!isset($data['email']) || !isset($data['password']) || !isset($data['role']) || 
        !isset($data['firstName']) || !isset($data['lastName'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Données manquantes']);
        exit();
    }

    try {
        // Démarrer une transaction
        $pdo->beginTransaction();

        // Vérifier si l'email existe déjà
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        if ($stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(['message' => 'Cet email est déjà utilisé']);
            exit();
        }

        // Hasher le mot de passe
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        // Insérer le nouvel utilisateur
        $stmt = $pdo->prepare("INSERT INTO users (email, password, role, firstName, lastName) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['email'],
            $hashedPassword,
            $data['role'],
            $data['firstName'],
            $data['lastName']
        ]);
        $userId = $pdo->lastInsertId();

        // Si des compétences sont fournies
        if (isset($data['skills']) && is_array($data['skills'])) {
            foreach ($data['skills'] as $skillName) {
                // Vérifier si la compétence existe déjà
                $stmt = $pdo->prepare("SELECT id FROM skills WHERE name = ?");
                $stmt->execute([$skillName]);
                $skill = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$skill) {
                    // Si la compétence n'existe pas, la créer
                    $stmt = $pdo->prepare("INSERT INTO skills (name) VALUES (?)");
                    $stmt->execute([$skillName]);
                    $skillId = $pdo->lastInsertId();
                } else {
                    $skillId = $skill['id'];
                }

                // Lier la compétence à l'utilisateur
                $stmt = $pdo->prepare("INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)");
                $stmt->execute([$userId, $skillId]);
            }
        }

        // Valider la transaction
        $pdo->commit();

        // Retourner une réponse de succès
        http_response_code(201);
        echo json_encode(['message' => 'Utilisateur créé avec succès.']);
    } catch (PDOException $e) {
        // Annuler la transaction en cas d'erreur
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        
        // En cas d'erreur, retourner un message d'erreur
        http_response_code(500);
        echo json_encode(['message' => 'Erreur lors de la création de l\'utilisateur: ' . $e->getMessage()]);
    }
} else {
    // Si ce n'est pas une requête POST, retourner une erreur
    http_response_code(405);
    echo json_encode(['message' => 'Méthode non autorisée']);
}
?> 