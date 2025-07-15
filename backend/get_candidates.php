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
    // Récupérer les candidats qui ont liké les offres du recruteur (version simplifiée)
    $query = "SELECT 
                u.id as candidate_id,
                u.firstName,
                u.lastName,
                u.bio,
                u.location,
                u.company,
                u.position,
                u.profilePicture,
                j.id as job_id,
                j.title as job_title,
                j.company as job_company,
                js.created_at as swipe_date
             FROM users u 
             JOIN job_swipes js ON u.id = js.user_id
             JOIN jobs j ON js.job_id = j.id
             WHERE u.role = 'candidate'
             AND j.recruiterId = ?
             AND js.action = 'like'
             AND u.id NOT IN (
                 SELECT candidate_id FROM candidate_swipes WHERE recruiter_id = ?
             )
             ORDER BY j.id, js.created_at DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$user['id'], $user['id']]);
    $candidates = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Organiser les candidats par offre
    $candidatesByJob = [];
    foreach ($candidates as $candidate) {
        $jobId = $candidate['job_id'];
        if (!isset($candidatesByJob[$jobId])) {
            $candidatesByJob[$jobId] = [
                'job_id' => $jobId,
                'job_title' => $candidate['job_title'],
                'job_company' => $candidate['job_company'],
                'candidates' => []
            ];
        }
        
        // Formater les données du candidat
        $candidateData = [
            'id' => $candidate['candidate_id'],
            'firstName' => $candidate['firstName'],
            'lastName' => $candidate['lastName'],
            'bio' => $candidate['bio'],
            'location' => $candidate['location'],
            'company' => $candidate['company'],
            'position' => $candidate['position'],
            'profilePicture' => $candidate['profilePicture'],
            'swipe_date' => $candidate['swipe_date'],
            'skills' => [] // Pas de compétences pour l'instant
        ];
        
        // Ajouter l'URL complète pour la photo de profil
        if ($candidateData['profilePicture']) {
            if (strpos($candidateData['profilePicture'], 'uploads/profile_pictures/') === false) {
                $candidateData['profilePicture'] = '/TinderWork/backend/uploads/profile_pictures/' . $candidateData['profilePicture'];
            } else {
                $candidateData['profilePicture'] = '/TinderWork/backend/' . $candidateData['profilePicture'];
            }
        }
        
        $candidatesByJob[$jobId]['candidates'][] = $candidateData;
    }

    // Convertir en tableau simple pour le frontend
    $result = [];
    foreach ($candidatesByJob as $jobData) {
        foreach ($jobData['candidates'] as $candidate) {
            $candidate['job_title'] = $jobData['job_title'];
            $candidate['job_company'] = $jobData['job_company'];
            $candidate['job_id'] = $jobData['job_id'];
            $result[] = $candidate;
        }
    }

    echo json_encode($result);
} catch (Exception $e) {
    error_log('Erreur dans get_candidates.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des candidats: ' . $e->getMessage()]);
}