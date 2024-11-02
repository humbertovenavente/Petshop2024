<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");
// Configuración de la base de datos
$host = '192.168.0.14';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed']));
}

$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? '';

if ($token) {
    // Verificar y reactivar la cuenta usando el token
    $stmt = $conn->prepare("UPDATE User SET status = 1 WHERE verification_token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Account reactivated.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Activating your account']);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Activating your account.']);
}

$conn->close();
?>
