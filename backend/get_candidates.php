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

// Vérifier le rôle de l'utilisateur avec le token
$stmt = $pdo->prepare("SELECT * FROM users WHERE token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Log pour déboguer
error_log('Token reçu: ' . $token);
error_log('User trouvé: ' . print_r($user, true));

if (!$user || $user['role'] !== 'recruiter') {
    http_response_code(403);
    echo json_encode(['error' => 'Seuls les recruteurs peuvent voir les candidats']);
    exit;
}

try {
    // Récupérer tous les candidats disponibles (version simplifiée)
    $query = "SELECT 
                u.id,
                u.firstName,
                u.lastName,
                u.bio,
                u.location,
                u.company,
                u.position,
                u.profilePicture,
                u.email,
                u.createdAt
             FROM users u 
             WHERE u.role = 'candidate'
             AND u.id NOT IN (
                 SELECT candidate_id FROM candidate_swipes WHERE recruiter_id = ?
             )
             ORDER BY u.createdAt DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$user['id']]);
    $candidates = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formater les données des candidats
    $result = [];
    foreach ($candidates as $candidate) {
        // Récupérer les compétences du candidat
        $skillsQuery = "SELECT s.name FROM skills s 
                       JOIN user_skills us ON s.id = us.skillId 
                       WHERE us.userId = ?";
        $skillsStmt = $pdo->prepare($skillsQuery);
        $skillsStmt->execute([$candidate['id']]);
        $skills = $skillsStmt->fetchAll(PDO::FETCH_COLUMN);
        
        $candidateData = [
            'id' => $candidate['id'],
            'firstName' => $candidate['firstName'],
            'lastName' => $candidate['lastName'],
            'bio' => $candidate['bio'],
            'location' => $candidate['location'],
            'company' => $candidate['company'],
            'position' => $candidate['position'],
            'profilePicture' => $candidate['profilePicture'],
            'email' => $candidate['email'],
            'skills' => implode(', ', $skills),
            'education' => 'Formation non précisée',
            'experience' => '0',
            'availability' => 'Immédiatement'
        ];
        
        // Ajouter l'URL complète pour la photo de profil
        if ($candidateData['profilePicture']) {
            if (strpos($candidateData['profilePicture'], 'uploads/profile_pictures/') === false) {
                $candidateData['profilePicture'] = 'uploads/profile_pictures/' . $candidateData['profilePicture'];
            }
        }
        
        $result[] = $candidateData;
    }

    echo json_encode($result);
} catch (Exception $e) {
    error_log('Erreur dans get_candidates.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des candidats: ' . $e->getMessage()]);
}