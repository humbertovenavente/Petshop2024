<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS para permitir solicitudes desde el frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Conexión a la base de datos
$host = '192.168.0.131';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña'; // Asegúrate de que la contraseña sea correcta

$conn = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer el cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

// Validar que el campo de token, email y nueva contraseña existan
if (!isset($data['token'], $data['newPassword'], $data['email'])) {
    echo json_encode(['error' => 'Token, email o nueva contraseña no proporcionados']);
    exit();
}

// Extraer el token, el email y la nueva contraseña
$token = $data['token'];
$email = $data['email'];
$newPassword = $data['newPassword'];

// Actualizar la contraseña en la base de datos para el usuario con el token proporcionado
$sql = "UPDATE User SET password = ? WHERE reset_token = ? AND email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $newPassword, $token, $email); // Sin hashing

if ($stmt->execute()) {
    echo json_encode(['success' => 'Contraseña actualizada correctamente']);
} else {
    echo json_encode(['error' => 'Error actualizando la contraseña: ' . $stmt->error]);
}

// Cerrar conexión
$stmt->close();
$conn->close();
?>
