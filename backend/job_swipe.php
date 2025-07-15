<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

header('Content-Type: application/json');

// Log des données reçues
error_log('Méthode de la requête: ' . $_SERVER['REQUEST_METHOD']);
error_log('Données POST reçues: ' . print_r($_POST, true));
error_log('Données brutes reçues: ' . file_get_contents('php://input'));

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
    echo json_encode(['error' => 'Seuls les candidats peuvent swiper sur les annonces']);
    exit;
}

// Récupérer les données du swipe
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    $data = $_POST;
}

$jobId = $data['jobId'] ?? null;
$action = $data['action'] ?? null;

error_log('jobId: ' . print_r($jobId, true));
error_log('action: ' . print_r($action, true));

if (!$jobId || !$action) {
    http_response_code(400);
    echo json_encode(['error' => 'Données de swipe manquantes']);
    exit;
}

// Vérifier que l'action est valide
if (!in_array($action, ['like', 'dislike'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Action invalide. Utilisez "like" ou "dislike"']);
    exit;
}

try {
    // Vérifier si le swipe existe déjà
    $stmt = $pdo->prepare("SELECT * FROM job_swipes WHERE user_id = ? AND job_id = ?");
    $stmt->execute([$user['id'], $jobId]);
    $existingSwipe = $stmt->fetch();

    if ($existingSwipe) {
        http_response_code(400);
        echo json_encode(['error' => 'Vous avez déjà swipé sur cette annonce']);
        exit;
    }

    // Enregistrer le swipe
    $stmt = $pdo->prepare("INSERT INTO job_swipes (user_id, job_id, action, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$user['id'], $jobId, $action]);

    // Si c'est un match (action = 'like'), vérifier si le recruteur a aussi swipé à droite
    if ($action === 'like') {
        // Récupérer l'ID du recruteur
        $stmt = $pdo->prepare("SELECT recruiterId FROM jobs WHERE id = ?");
        $stmt->execute([$jobId]);
        $job = $stmt->fetch();

        if ($job) {
            // Vérifier si le recruteur a swipé à droite sur le candidat
            $stmt = $pdo->prepare("SELECT * FROM job_swipes WHERE user_id = ? AND job_id IN (SELECT id FROM jobs WHERE recruiterId = ?) AND action = 'like'");
            $stmt->execute([$job['recruiterId'], $user['id']]);
            $recruiterSwipe = $stmt->fetch();

            if ($recruiterSwipe) {
                // C'est un match !
                echo json_encode([
                    'success' => true,
                    'match' => true,
                    'message' => 'C\'est un match !'
                ]);
                exit;
            }
        }
    }

    echo json_encode([
        'success' => true,
        'match' => false,
        'message' => 'Swipe enregistré avec succès'
    ]);

} catch (Exception $e) {
    error_log('Erreur dans job_swipe.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de l\'enregistrement du swipe: ' . $e->getMessage()]);
} 