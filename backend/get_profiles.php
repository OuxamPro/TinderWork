<?php
require_once 'config.php';
require_once 'check_auth.php';

header('Content-Type: application/json');

try {
    // Récupérer tous les profils (à filtrer selon le rôle de l'utilisateur)
    $query = "SELECT u.*, 
                     GROUP_CONCAT(s.name) as skills
              FROM users u 
              LEFT JOIN user_skills us ON u.id = us.user_id 
              LEFT JOIN skills s ON us.skill_id = s.id 
              WHERE u.id != ? 
              GROUP BY u.id";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $profiles = [];
    while ($row = $result->fetch_assoc()) {
        // Convertir les compétences en tableau
        $row['skills'] = $row['skills'] ? explode(',', $row['skills']) : [];
        
        // Ajouter l'URL complète pour la photo
        if ($row['photo']) {
            $row['photo'] = '/TinderWork/backend/uploads/' . $row['photo'];
        }
        
        $profiles[] = $row;
    }
    
    echo json_encode($profiles);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} 