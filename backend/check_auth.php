<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Définir le type de contenu
header('Content-Type: application/json');

// Inclure la configuration de la base de données
require_once 'config.php';

// Vérifier si un token est fourni
$headers = getallheaders();
$token = null;

if (isset($headers['Authorization'])) {
    $auth_header = $headers['Authorization'];
    if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
        $token = $matches[1];
    }
}

if (!$token) {
    http_response_code(401);
    echo json_encode(['message' => 'Token manquant']);
    exit();
}

try {
    // Log pour le débogage
    error_log('Token reçu: ' . $token);

    // Rechercher l'utilisateur avec ce token et récupérer toutes les informations du profil
    $stmt = $pdo->prepare("
        SELECT u.*, GROUP_CONCAT(s.name) as skill_names, GROUP_CONCAT(s.id) as skill_ids
        FROM users u
        LEFT JOIN user_skills us ON u.id = us.userId
        LEFT JOIN skills s ON us.skillId = s.id
        WHERE u.token = ?
        GROUP BY u.id
    ");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Log pour le débogage
    error_log('User trouvé: ' . json_encode($user));

    if ($user) {
        // Formater les compétences pour la réponse
        if ($user['skill_names']) {
            $user['skills'] = array_map(function($id, $name) {
                return ['id' => $id, 'name' => $name];
            }, explode(',', $user['skill_ids']), explode(',', $user['skill_names']));
        } else {
            $user['skills'] = [];
        }
        unset($user['skill_names'], $user['skill_ids']);

        // S'assurer que le rôle est en minuscules
        $user['role'] = strtolower($user['role']);

        // Log pour le débogage
        error_log('User data being sent: ' . json_encode($user));

        http_response_code(200);
        echo json_encode([
            'message' => 'Token valide',
            'user' => $user
        ]);
    } else {
        error_log('Aucun utilisateur trouvé pour le token: ' . $token);
        http_response_code(401);
        echo json_encode(['message' => 'Token invalide']);
    }
} catch (PDOException $e) {
    error_log('Erreur dans check_auth.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['message' => 'Erreur lors de la vérification du token: ' . $e->getMessage()]);
}
?> 