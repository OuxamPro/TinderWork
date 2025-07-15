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
    echo json_encode(['error' => 'Seuls les recruteurs peuvent swiper sur les candidats']);
    exit;
}

// Récupérer les données du swipe
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!isset($data['candidateId']) || !isset($data['action'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Données de swipe manquantes']);
    exit;
}

try {
    // Vérifier si le candidat existe
    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ? AND role = 'candidate'");
    $stmt->execute([$data['candidateId']]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'Candidat non trouvé']);
        exit;
    }

    // Vérifier si le swipe existe déjà
    $stmt = $pdo->prepare("SELECT id FROM candidate_swipes WHERE recruiter_id = ? AND candidate_id = ?");
    $stmt->execute([$user['id'], $data['candidateId']]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['error' => 'Vous avez déjà swipé sur ce candidat']);
        exit;
    }

    // Enregistrer le swipe
    $stmt = $pdo->prepare("INSERT INTO candidate_swipes (recruiter_id, candidate_id, action) VALUES (?, ?, ?)");
    $stmt->execute([$user['id'], $data['candidateId'], $data['action']]);

    // Si c'est un like, vérifier si c'est un match
    if ($data['action'] === 'like') {
        // Vérifier si le candidat a déjà liké une offre du recruteur
        $stmt = $pdo->prepare("
            SELECT js.id, js.job_id
            FROM job_swipes js 
            JOIN jobs j ON js.job_id = j.id 
            WHERE js.user_id = ? AND j.recruiterId = ? AND js.action = 'like'
        ");
        $stmt->execute([$data['candidateId'], $user['id']]);
        $matchData = $stmt->fetch();
        
        if ($matchData) {
            // C'est un match ! Créer une conversation
            try {
                // Vérifier si la conversation existe déjà
                $stmt = $pdo->prepare("SELECT id FROM conversations WHERE candidate_id = ? AND recruiter_id = ? AND job_id = ?");
                $stmt->execute([$data['candidateId'], $user['id'], $matchData['job_id']]);
                
                if (!$stmt->fetch()) {
                    // Créer la conversation
                    $stmt = $pdo->prepare("INSERT INTO conversations (candidate_id, recruiter_id, job_id) VALUES (?, ?, ?)");
                    $stmt->execute([$data['candidateId'], $user['id'], $matchData['job_id']]);
                }
                
                echo json_encode([
                    'message' => 'Match ! Vous pouvez maintenant discuter.',
                    'match' => true
                ]);
                exit;
            } catch (Exception $e) {
                error_log('Erreur lors de la création de la conversation: ' . $e->getMessage());
                echo json_encode([
                    'message' => 'Match !',
                    'match' => true
                ]);
                exit;
            }
        }
    }

    echo json_encode([
        'message' => 'Swipe enregistré',
        'match' => false
    ]);
} catch (Exception $e) {
    error_log('Erreur dans candidate_swipe.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de l\'enregistrement du swipe: ' . $e->getMessage()]);
} 