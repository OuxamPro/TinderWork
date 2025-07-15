<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

header('Content-Type: application/json');

// Récupérer le token depuis le header Authorization
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
    echo json_encode(['error' => 'Token manquant']);
    exit;
}

// Vérifier l'utilisateur avec le token
$stmt = $pdo->prepare("SELECT * FROM users WHERE token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Utilisateur non trouvé']);
    exit;
}

try {
    if ($user['role'] === 'candidate') {
        // Pour un candidat : récupérer les conversations avec les recruteurs
        $query = "SELECT 
                    c.id as conversation_id,
                    c.created_at,
                    c.updated_at,
                    j.title as job_title,
                    j.company as job_company,
                    u.firstName as recruiter_firstName,
                    u.lastName as recruiter_lastName,
                    u.company as recruiter_company,
                    u.profilePicture as recruiter_photo,
                    (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) as message_count,
                    (SELECT m.content FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message
                  FROM conversations c
                  JOIN jobs j ON c.job_id = j.id
                  JOIN users u ON c.recruiter_id = u.id
                  WHERE c.candidate_id = ?
                  ORDER BY c.updated_at DESC";
        
        $stmt = $pdo->prepare($query);
        $stmt->execute([$user['id']]);
        
    } else if ($user['role'] === 'recruiter') {
        // Pour un recruteur : récupérer les conversations avec les candidats
        $query = "SELECT 
                    c.id as conversation_id,
                    c.created_at,
                    c.updated_at,
                    j.title as job_title,
                    j.company as job_company,
                    u.firstName as candidate_firstName,
                    u.lastName as candidate_lastName,
                    u.position as candidate_position,
                    u.profilePicture as candidate_photo,
                    (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) as message_count,
                    (SELECT m.content FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message
                  FROM conversations c
                  JOIN jobs j ON c.job_id = j.id
                  JOIN users u ON c.candidate_id = u.id
                  WHERE c.recruiter_id = ?
                  ORDER BY c.updated_at DESC";
        
        $stmt = $pdo->prepare($query);
        $stmt->execute([$user['id']]);
    } else {
        http_response_code(403);
        echo json_encode(['error' => 'Rôle non reconnu']);
        exit;
    }
    
    $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Formater les données
    foreach ($conversations as &$conv) {
        // Ajouter l'URL complète pour les photos de profil
        if ($user['role'] === 'candidate' && $conv['recruiter_photo']) {
            if (strpos($conv['recruiter_photo'], 'uploads/profile_pictures/') === false) {
                $conv['recruiter_photo'] = '/TinderWork/backend/uploads/profile_pictures/' . $conv['recruiter_photo'];
            } else {
                $conv['recruiter_photo'] = '/TinderWork/backend/' . $conv['recruiter_photo'];
            }
        } else if ($user['role'] === 'recruiter' && $conv['candidate_photo']) {
            if (strpos($conv['candidate_photo'], 'uploads/profile_pictures/') === false) {
                $conv['candidate_photo'] = '/TinderWork/backend/uploads/profile_pictures/' . $conv['candidate_photo'];
            } else {
                $conv['candidate_photo'] = '/TinderWork/backend/' . $conv['candidate_photo'];
            }
        }
        
        // Tronquer le dernier message s'il est trop long
        if ($conv['last_message'] && strlen($conv['last_message']) > 50) {
            $conv['last_message'] = substr($conv['last_message'], 0, 50) . '...';
        }
    }
    
    echo json_encode($conversations);
    
} catch (Exception $e) {
    error_log('Erreur dans get_conversations.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des conversations: ' . $e->getMessage()]);
}
?> 