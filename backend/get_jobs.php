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

if (!$user || $user['role'] !== 'candidate') {
    http_response_code(403);
    echo json_encode(['error' => 'Seuls les candidats peuvent voir les annonces']);
    exit;
}

try {
    // Récupérer les annonces avec les infos des recruteurs
    $query = "SELECT j.*, u.company as company_name, u.profilePicture as recruiter_photo
             FROM jobs j 
             JOIN users u ON j.recruiterId = u.id 
             WHERE j.id NOT IN (
                 SELECT job_id FROM job_swipes WHERE user_id = ?
             )
             AND j.status = 'active'
             ORDER BY j.createdAt DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$user['id']]);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formater les données pour chaque annonce
    foreach ($jobs as &$job) {
        // Les compétences requises sont dans le champ requirements
        if ($job['requirements']) {
            $job['required_skills'] = [$job['requirements']];
        } else {
            $job['required_skills'] = [];
        }
        
        // Pas de compétences pour l'instant
        $job['skills'] = [];

        // Ajouter l'URL complète pour la photo du recruteur
        if ($job['recruiter_photo']) {
            // Vérifier si le chemin contient déjà 'uploads/profile_pictures'
            if (strpos($job['recruiter_photo'], 'uploads/profile_pictures/') === false) {
                $job['recruiter_photo'] = '/TinderWork/backend/uploads/profile_pictures/' . $job['recruiter_photo'];
            } else {
                $job['recruiter_photo'] = '/TinderWork/backend/' . $job['recruiter_photo'];
            }
        }

        // Pas de secteur pour l'instant
        $job['industry'] = 'Général';
    }

    echo json_encode($jobs);
} catch (Exception $e) {
    error_log('Erreur dans get_jobs.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des annonces: ' . $e->getMessage()]);
} 