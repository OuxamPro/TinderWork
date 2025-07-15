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

// Récupérer les données du message
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!isset($data['conversation_id']) || !isset($data['content']) || empty(trim($data['content']))) {
    http_response_code(400);
    echo json_encode(['error' => 'Données de message manquantes']);
    exit;
}

try {
    // Vérifier que l'utilisateur a accès à cette conversation
    $stmt = $pdo->prepare("SELECT * FROM conversations WHERE id = ? AND (candidate_id = ? OR recruiter_id = ?)");
    $stmt->execute([$data['conversation_id'], $user['id'], $user['id']]);
    $conversation = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$conversation) {
        http_response_code(403);
        echo json_encode(['error' => 'Accès non autorisé à cette conversation']);
        exit;
    }
    
    // Insérer le message
    $stmt = $pdo->prepare("INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)");
    $stmt->execute([$data['conversation_id'], $user['id'], trim($data['content'])]);
    
    // Mettre à jour la date de modification de la conversation
    $stmt = $pdo->prepare("UPDATE conversations SET updated_at = NOW() WHERE id = ?");
    $stmt->execute([$data['conversation_id']]);
    
    // Récupérer le message créé
    $messageId = $pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT 
                            m.id,
                            m.content,
                            m.created_at,
                            m.sender_id,
                            u.firstName,
                            u.lastName,
                            u.role
                          FROM messages m
                          JOIN users u ON m.sender_id = u.id
                          WHERE m.id = ?");
    $stmt->execute([$messageId]);
    $message = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($message) {
        // Formater le message
        $message['is_own_message'] = true;
        $message['formatted_time'] = date('H:i', strtotime($message['created_at']));
    } else {
        // Fallback si le message n'a pas pu être récupéré
        $message = [
            'id' => $messageId,
            'content' => trim($data['content']),
            'created_at' => date('Y-m-d H:i:s'),
            'sender_id' => $user['id'],
            'firstName' => $user['firstName'],
            'lastName' => $user['lastName'],
            'role' => $user['role'],
            'is_own_message' => true,
            'formatted_time' => date('H:i')
        ];
    }
    
    echo json_encode([
        'success' => true,
        'message' => $message
    ]);
    
} catch (Exception $e) {
    error_log('Erreur dans send_message.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de l\'envoi du message: ' . $e->getMessage()]);
}
?> 