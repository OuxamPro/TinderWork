<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

header('Content-Type: application/json');

try {
    // Créer des conversations de test
    echo "Création de conversations de test...\n";
    
    // Conversation 1: Candidat 1 avec Recruteur 1 pour Job 1
    $stmt = $pdo->prepare("INSERT IGNORE INTO conversations (candidate_id, recruiter_id, job_id) VALUES (1, 2, 1)");
    $stmt->execute();
    
    // Conversation 2: Candidat 2 avec Recruteur 1 pour Job 1
    $stmt = $pdo->prepare("INSERT IGNORE INTO conversations (candidate_id, recruiter_id, job_id) VALUES (2, 2, 1)");
    $stmt->execute();
    
    // Ajouter quelques messages de test
    echo "Ajout de messages de test...\n";
    
    // Messages pour la conversation 1
    $conversationId = 1;
    
    $messages = [
        ['sender_id' => 1, 'content' => 'Bonjour ! Je suis intéressé par votre offre de développeur.'],
        ['sender_id' => 2, 'content' => 'Bonjour ! Merci pour votre intérêt. Pouvez-vous me parler de votre expérience ?'],
        ['sender_id' => 1, 'content' => 'J\'ai 3 ans d\'expérience en React et Node.js.'],
        ['sender_id' => 2, 'content' => 'Parfait ! Quand seriez-vous disponible pour un entretien ?'],
        ['sender_id' => 1, 'content' => 'Je suis disponible dès cette semaine !']
    ];
    
    foreach ($messages as $message) {
        $stmt = $pdo->prepare("INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)");
        $stmt->execute([$conversationId, $message['sender_id'], $message['content']]);
    }
    
    // Messages pour la conversation 2
    $conversationId = 2;
    
    $messages2 = [
        ['sender_id' => 2, 'content' => 'Bonjour ! Votre profil m\'intéresse beaucoup.'],
        ['sender_id' => 2, 'content' => 'Avez-vous de l\'expérience en Python ?'],
        ['sender_id' => 2, 'content' => 'Nous cherchons quelqu\'un pour rejoindre notre équipe rapidement.']
    ];
    
    foreach ($messages2 as $message) {
        $stmt = $pdo->prepare("INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)");
        $stmt->execute([$conversationId, $message['sender_id'], $message['content']]);
    }
    
    echo "Système de chat testé avec succès !\n";
    echo "Conversations créées : 2\n";
    echo "Messages créés : " . (count($messages) + count($messages2)) . "\n";
    
} catch (Exception $e) {
    echo "Erreur lors du test du système de chat : " . $e->getMessage() . "\n";
}
?> 