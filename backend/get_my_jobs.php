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

if (!$user || $user['role'] !== 'recruiter') {
    http_response_code(403);
    echo json_encode(['error' => 'Accès non autorisé']);
    exit;
}

try {
    // Récupérer toutes les annonces du recruteur
    $stmt = $pdo->prepare("
        SELECT j.*, GROUP_CONCAT(s.name) as skills
        FROM jobs j
        LEFT JOIN job_skills js ON j.id = js.jobId
        LEFT JOIN skills s ON js.skillId = s.id
        WHERE j.recruiterId = ?
        GROUP BY j.id
        ORDER BY j.createdAt DESC
    ");
    $stmt->execute([$user['id']]);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formater les compétences
    foreach ($jobs as &$job) {
        $job['skills'] = $job['skills'] ? explode(',', $job['skills']) : [];
        // Convertir le champ requirements de JSON en tableau
        if ($job['requirements']) {
            $job['requirements'] = json_decode($job['requirements'], true);
        }
    }

    // Ne renvoyer que les annonces
    echo json_encode($jobs);
    exit;
} catch (Exception $e) {
    error_log('Erreur dans get_my_jobs.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des annonces: ' . $e->getMessage()]);
    exit;
} 