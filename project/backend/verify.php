<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuración de la base de datos
$host = '192.168.0.16';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión failed: " . $conn->connect_error]));
}

// Leer los datos enviados
$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? '';

// Verificar si el token es válido
if (!$token) {
    echo json_encode(['error' => 'Token was not provided']);
    exit();
}

// Agregar log para verificar el token
error_log("Token: " . $token);

$sql = "SELECT * FROM User WHERE verification_token = ? AND status = 0";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Si el token es válido, activar la cuenta
    $sql = "UPDATE User SET status = 1, verification_token = NULL WHERE verification_token = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $token);
    $stmt->execute();

    echo json_encode(['message' => 'The account was verified successfully.']);
} else {
    echo json_encode(['error' => 'Token no longer valid or account already verified.']);
}

// Agregar log para confirmar si la actualización se realizó correctamente
error_log("Verification ended.");

$stmt->close();
$conn->close();

?>
