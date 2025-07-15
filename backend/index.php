<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Définir le type de contenu
header('Content-Type: application/json');

// Gérer les en-têtes CORS
header('Access-Control-Allow-Origin: http://localhost:3001');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

// Gérer la requête OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Rediriger vers la page appropriée en fonction de l'URL
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = trim($path, '/');
$segments = explode('/', $path);

// Si nous sommes à la racine, renvoyer un message
if (empty($segments) || $segments[0] === 'TinderWork' || $segments[0] === 'backend') {
    echo json_encode(['message' => 'API TinderWork Backend']);
    exit();
}

// Sinon, renvoyer une erreur 404
http_response_code(404);
echo json_encode(['message' => 'Endpoint non trouvé']);
?> 