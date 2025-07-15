<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Définir les en-têtes CORS et le type de contenu
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
        // Inclure la configuration de la base de données
        require_once 'config.php';

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
        $data = json_decode($_POST['data'], true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['message' => 'Données JSON invalides: ' . json_last_error_msg()]);
            exit();
        }

        // Vérifier si toutes les données requises sont présentes
        if (!isset($data['bio']) || !isset($data['location']) || !isset($data['position'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Bio, localisation et poste actuel requis']);
            exit();
        }

        // Gérer l'upload de la photo de profil si elle est présente
        $profile_picture = null;
        if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['profile_picture'];
            $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
            
            if (!in_array($file['type'], $allowed_types)) {
                http_response_code(400);
                echo json_encode(['message' => 'Type de fichier non autorisé. Utilisez JPG, PNG ou GIF']);
                exit();
            }

            $max_size = 5 * 1024 * 1024; // 5MB
            if ($file['size'] > $max_size) {
                http_response_code(400);
                echo json_encode(['message' => 'La taille du fichier ne doit pas dépasser 5MB']);
                exit();
            }

            $upload_dir = 'uploads/profile_pictures/';
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            $filename = uniqid() . '_' . basename($file['name']);
            $filepath = $upload_dir . $filename;

            if (move_uploaded_file($file['tmp_name'], $filepath)) {
                $profile_picture = $filepath;
            }
        }

        // Mettre à jour le profil de l'utilisateur
        $stmt = $pdo->prepare("UPDATE users SET 
            bio = ?, 
            location = ?, 
            position = ?,
            profilePicture = COALESCE(?, profilePicture)
            WHERE id = ?");

        $stmt->execute([
            $data['bio'],
            $data['location'],
            $data['position'],
            $profile_picture,
            $user['id']
        ]);

        // Mettre à jour les compétences
        if (isset($data['skills']) && is_array($data['skills'])) {
            // Supprimer les anciennes compétences
            $stmt = $pdo->prepare("DELETE FROM user_skills WHERE userId = ?");
            $stmt->execute([$user['id']]);

            // Ajouter les nouvelles compétences
            $stmt = $pdo->prepare("INSERT INTO user_skills (userId, skillId) VALUES (?, ?)");
            foreach ($data['skills'] as $skill) {
                // Vérifier si la compétence est un objet avec un ID ou directement un ID
                $skillId = is_array($skill) ? $skill['id'] : $skill;
                if (is_numeric($skillId)) {
                    $stmt->execute([$user['id'], $skillId]);
                }
            }
        }

        // Récupérer les informations mises à jour
        $stmt = $pdo->prepare("
            SELECT u.*, 
                   GROUP_CONCAT(DISTINCT s.id) as skill_ids,
                   GROUP_CONCAT(DISTINCT s.name) as skill_names
            FROM users u
            LEFT JOIN user_skills us ON u.id = us.userId
            LEFT JOIN skills s ON us.skillId = s.id
            WHERE u.id = ?
            GROUP BY u.id
        ");
        $stmt->execute([$user['id']]);
        $updated_user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Formater les compétences pour la réponse
        if ($updated_user['skill_ids'] && $updated_user['skill_names']) {
            $skill_ids = explode(',', $updated_user['skill_ids']);
            $skill_names = explode(',', $updated_user['skill_names']);
            $updated_user['skills'] = array_map(function($id, $name) {
                return ['id' => $id, 'name' => $name];
            }, $skill_ids, $skill_names);
        } else {
            $updated_user['skills'] = [];
        }
        unset($updated_user['skill_ids'], $updated_user['skill_names']);

        echo json_encode([
            'message' => 'Profil mis à jour avec succès',
            'user' => $updated_user
        ]);
        exit();
    } catch (PDOException $e) {
        error_log('Erreur PDO dans update_profile.php: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Erreur lors de la mise à jour du profil: ' . $e->getMessage()]);
        exit();
    } catch (Exception $e) {
        error_log('Erreur dans update_profile.php: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Erreur serveur: ' . $e->getMessage()]);
        exit();
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Méthode non autorisée']);
    exit();
}
?> 