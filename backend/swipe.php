<?php
require_once 'config.php';
require_once 'check_auth.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['swipedId']) || !isset($data['action'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    // Insérer le swipe dans la base de données
    $query = "INSERT INTO swipes (user_id, swiped_user_id, action) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iis", $_SESSION['user_id'], $data['swipedId'], $data['action']);
    $stmt->execute();
    
    // Si c'est un match (les deux utilisateurs se sont likés)
    if ($data['action'] === 'like') {
        $query = "SELECT COUNT(*) as match_count FROM swipes 
                 WHERE user_id = ? AND swiped_user_id = ? AND action = 'like'";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ii", $data['swipedId'], $_SESSION['user_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        if ($row['match_count'] > 0) {
            // C'est un match !
            echo json_encode(['match' => true]);
            exit;
        }
    }
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} 