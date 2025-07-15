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

// Récupérer l'ID de la conversation depuis les paramètres GET
$conversationId = $_GET['conversation_id'] ?? null;

if (!$conversationId) {
    http_response_code(400);
    echo json_encode(['error' => 'ID de conversation manquant']);
    exit;
}

try {
    // Vérifier que l'utilisateur a accès à cette conversation
    $stmt = $pdo->prepare("SELECT * FROM conversations WHERE id = ? AND (candidate_id = ? OR recruiter_id = ?)");
    $stmt->execute([$conversationId, $user['id'], $user['id']]);
    $conversation = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$conversation) {
        http_response_code(403);
        echo json_encode(['error' => 'Accès non autorisé à cette conversation']);
        exit;
    }
    
    // Récupérer les messages de la conversation
    $query = "SELECT 
                m.id,
                m.content,
                m.created_at,
                m.sender_id,
                u.firstName,
                u.lastName,
                u.role
              FROM messages m
              JOIN users u ON m.sender_id = u.id
              WHERE m.conversation_id = ?
              ORDER BY m.created_at ASC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$conversationId]);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Formater les messages
    foreach ($messages as &$message) {
        $message['is_own_message'] = ($message['sender_id'] == $user['id']);
        $message['formatted_time'] = date('H:i', strtotime($message['created_at']));
    }
    
    echo json_encode([
        'conversation' => $conversation,
        'messages' => $messages
    ]);
    
} catch (Exception $e) {
    error_log('Erreur dans get_messages.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des messages: ' . $e->getMessage()]);
}
?> 