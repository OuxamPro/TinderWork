<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
        echo json_encode(['error' => 'Seuls les recruteurs peuvent poster des annonces']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    // Vérifier les champs requis
    if (!isset($data['title']) || !isset($data['description']) || !isset($data['location'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Titre, description et localisation requis']);
        exit;
    }

    // Valider le type de contrat
    $validContractTypes = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'];
    $contractType = $data['contract_type'] ?? 'CDI';
    if (!in_array($contractType, $validContractTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Type de contrat invalide. Les valeurs autorisées sont : ' . implode(', ', $validContractTypes)]);
        exit;
    }

    try {
        // Insérer l'offre d'emploi
        $query = "INSERT INTO jobs (recruiterId, title, description, company, location, salary, type, requirements) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($query);
        $result = $stmt->execute([
            $user['id'],
            $data['title'],
            $data['description'],
            $user['companyName'],
            $data['location'],
            $data['salary'] ?? null,
            $contractType,
            isset($data['required_skills']) ? json_encode($data['required_skills']) : null
        ]);

        if (!$result) {
            throw new Exception('Erreur lors de l\'insertion dans la base de données');
        }

        $jobId = $pdo->lastInsertId();
        
        // Insérer les compétences requises
        if (isset($data['required_skills']) && is_array($data['required_skills'])) {
            $query = "INSERT INTO job_skills (jobId, skillId, level) VALUES (?, ?, 'expert')";
            $stmt = $pdo->prepare($query);
            foreach ($data['required_skills'] as $skillId) {
                $stmt->execute([$jobId, $skillId]);
            }
        }
        
        // Récupérer l'annonce créée avec les infos du recruteur
        $query = "SELECT j.*, u.companyName as company_name, u.industry 
                 FROM jobs j 
                 JOIN users u ON j.recruiterId = u.id 
                 WHERE j.id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$jobId]);
        $job = $stmt->fetch(PDO::FETCH_ASSOC);

        // Récupérer les compétences requises
        $query = "SELECT s.* FROM skills s 
                 JOIN job_skills js ON s.id = js.skillId 
                 WHERE js.jobId = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$jobId]);
        $job['required_skills'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['message' => 'Annonce créée avec succès', 'job' => $job]);
        exit;
    } catch (Exception $e) {
        error_log('Erreur dans post_job.php: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'error' => 'Erreur lors de la création de l\'annonce',
            'details' => $e->getMessage()
        ]);
        exit;
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
} 