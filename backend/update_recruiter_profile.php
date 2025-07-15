<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inclure la configuration de la base de données
require_once 'config.php';

// Définir les en-têtes CORS
header('Access-Control-Allow-Origin: http://localhost:3001');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Gérer la requête OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Vérifier si la requête est une requête POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Vérifier le token d'authentification
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

        if (!$token) {
            http_response_code(401);
            echo json_encode(['message' => 'Token d\'authentification manquant']);
            exit();
        }

        // Vérifier si le token est valide
        $stmt = $pdo->prepare("SELECT id FROM users WHERE token = ?");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(401);
            echo json_encode(['message' => 'Token invalide']);
            exit();
        }

        // Vérifier si les données sont présentes
        if (!isset($_POST['data'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Données manquantes']);
            exit();
        }

        // Récupérer les données JSON
        $jsonData = json_decode($_POST['data'], true);

        // Vérifier si toutes les données requises sont présentes
        if (!isset($jsonData['companyName']) || !isset($jsonData['companyDescription']) || !isset($jsonData['companyLocation'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Nom de l\'entreprise, description et localisation requis']);
            exit();
        }

        // Mettre à jour le profil du recruteur
        $stmt = $pdo->prepare("UPDATE users SET 
            companyName = ?, 
            companyDescription = ?, 
            companyLocation = ?,
            companyWebsite = ?,
            companySize = ?,
            industry = ?
            WHERE id = ?");

        $stmt->execute([
            $jsonData['companyName'],
            $jsonData['companyDescription'],
            $jsonData['companyLocation'],
            $jsonData['companyWebsite'] ?? null,
            $jsonData['companySize'] ?? null,
            $jsonData['industry'] ?? null,
            $user['id']
        ]);

        // Mettre à jour les compétences
        if (isset($jsonData['skills']) && is_array($jsonData['skills'])) {
            // Supprimer les anciennes compétences
            $stmt = $pdo->prepare("DELETE FROM user_skills WHERE userId = ?");
            $stmt->execute([$user['id']]);

            // Ajouter les nouvelles compétences
            $stmt = $pdo->prepare("INSERT INTO user_skills (userId, skillId) VALUES (?, ?)");
            foreach ($jsonData['skills'] as $skillId) {
                $stmt->execute([$user['id'], $skillId]);
            }
        }

        // Récupérer les données mises à jour
        $stmt = $pdo->prepare("
            SELECT u.*, GROUP_CONCAT(s.name) as skill_names, GROUP_CONCAT(s.id) as skill_ids
            FROM users u
            LEFT JOIN user_skills us ON u.id = us.userId
            LEFT JOIN skills s ON us.skillId = s.id
            WHERE u.id = ?
            GROUP BY u.id
        ");
        $stmt->execute([$user['id']]);
        $updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);

        // Formater les compétences pour la réponse
        if ($updatedUser['skill_names']) {
            $updatedUser['skills'] = array_map(function($id, $name) {
                return ['id' => $id, 'name' => $name];
            }, explode(',', $updatedUser['skill_ids']), explode(',', $updatedUser['skill_names']));
        } else {
            $updatedUser['skills'] = [];
        }
        unset($updatedUser['skill_names'], $updatedUser['skill_ids']);

        http_response_code(200);
        echo json_encode([
            'message' => 'Profil mis à jour avec succès',
            'user' => $updatedUser
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur lors de la mise à jour du profil: ' . $e->getMessage()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur serveur: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Méthode non autorisée']);
}
?> 