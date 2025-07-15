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
    if (!isset($data['email']) || !isset($data['password'])) {
        echo json_encode(['message' => 'Email et mot de passe requis']);
        exit();
    }

    try {
        // Rechercher l'utilisateur par email
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Vérifier si l'utilisateur existe et si le mot de passe est correct
        if ($user && password_verify($data['password'], $user['password'])) {
            // Générer un token unique
            $token = bin2hex(random_bytes(32));
            
            // Mettre à jour le token de l'utilisateur
            $stmt = $pdo->prepare("UPDATE users SET token = ? WHERE id = ?");
            $stmt->execute([$token, $user['id']]);

            // Retourner les informations de l'utilisateur (sans le mot de passe)
            unset($user['password']);
            $user['token'] = $token;

            echo json_encode([
                'message' => 'Connexion réussie',
                'user' => $user,
                'token' => $token
            ]);
        } else {
            echo json_encode(['message' => 'Email ou mot de passe incorrect']);
        }
    } catch (PDOException $e) {
        echo json_encode(['message' => 'Erreur lors de la connexion: ' . $e->getMessage()]);
    }
} else {
    // Si ce n'est pas une requête POST, retourner une erreur
    echo json_encode(['message' => 'Méthode non autorisée']);
}
?>