<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

header('Content-Type: application/json');

try {
    // Simuler l'API get_candidates.php avec l'ID du recruteur 2
    $recruiterId = 2;
    
    // Récupérer les candidats qui ont liké les offres du recruteur, organisés par offre
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
                js.created_at as swipe_date,
                GROUP_CONCAT(DISTINCT s.name) as skills
             FROM users u 
             JOIN job_swipes js ON u.id = js.user_id
             JOIN jobs j ON js.job_id = j.id
             LEFT JOIN user_skills us ON u.id = us.userId
             LEFT JOIN skills s ON us.skillId = s.id
             WHERE u.role = 'candidate'
             AND j.recruiterId = ?
             AND js.action = 'like'
             AND u.id NOT IN (
                 SELECT candidate_id FROM candidate_swipes WHERE recruiter_id = ?
             )
             GROUP BY u.id, j.id
             ORDER BY j.id, js.created_at DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$recruiterId, $recruiterId]);
    $candidates = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'recruiter_id' => $recruiterId,
        'candidates_count' => count($candidates),
        'candidates' => $candidates
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => 'Erreur: ' . $e->getMessage()]);
}
?> 