POST http://localhost/TinderWork/backend/post_job.php 401 (Unauthorized)
(anonymous) @ xhr.js:195
xhr @ xhr.js:15
Xn @ dispatchRequest.js:51
_request @ Axios.js:187
request @ Axios.js:40
(anonymous) @ Axios.js:226
(anonymous) @ bind.js:5
onSubmit @ JobPostForm.js:81
De @ react-dom.production.min.js:54
Be @ react-dom.production.min.js:54
(anonymous) @ react-dom.production.min.js:55
Ur @ react-dom.production.min.js:105
Ar @ react-dom.production.min.js:106
(anonymous) @ react-dom.production.min.js:117
uu @ react-dom.production.min.js:273
Te @ react-dom.production.min.js:52
Vr @ react-dom.production.min.js:109
Qt @ react-dom.production.min.js:74
$t @ react-dom.production.min.js:73Understand this error
JobPostForm.js:96 Erreur lors de la création de l'annonce: bt{message: 'Request failed with status code 401', name:
'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest,…}<?php
require_once 'config.php';
require_once 'check_auth.php';

header('Content-Type: application/json');

// Vérifier que l'utilisateur est un recruteur
if ($user['role'] !== 'recruiter') {
    http_response_code(403);
    echo json_encode(['error' => 'Accès non autorisé']);
    exit;
}

// Vérifier que l'ID de l'annonce est fourni
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['jobId'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ID de l\'annonce manquant']);
    exit;
}

try {
    // Vérifier que l'annonce appartient bien au recruteur
    $stmt = $pdo->prepare("SELECT id FROM job_posts WHERE id = ? AND recruiter_id = ?");
    $stmt->execute([$data['jobId'], $user['id']]);
    if (!$stmt->fetch()) {
        http_response_code(403);
        echo json_encode(['error' => 'Annonce non trouvée ou accès non autorisé']);
        exit;
    }

    // Supprimer les compétences associées
    $stmt = $pdo->prepare("DELETE FROM job_skills WHERE job_id = ?");
    $stmt->execute([$data['jobId']]);

    // Supprimer les swipes associés
    $stmt = $pdo->prepare("DELETE FROM job_swipes WHERE job_id = ?");
    $stmt->execute([$data['jobId']]);

    // Supprimer l'annonce
    $stmt = $pdo->prepare("DELETE FROM job_posts WHERE id = ?");
    $stmt->execute([$data['jobId']]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la suppression de l\'annonce']);
} 