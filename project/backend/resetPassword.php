<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS para permitir solicitudes desde el frontend
header("Access-Control-Allow-Origin: *");  // Cambia la URL si es necesario
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conectar a la base de datos
$host = '172.16.72.69';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';  // Cambia por la contraseña real
$conn = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer el cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

// Validar que el campo de token y nueva contraseña existan
if (!isset($data['token'], $data['newPassword'])) {
    echo json_encode(['error' => 'Token o nueva contraseña no proporcionados']);
    exit();
}

// Extraer el token y la nueva contraseña
$token = $data['token'];
$newPassword = $data['newPassword'];

// Actualizar la contraseña en la base de datos para el usuario con el token proporcionado
$sql = "UPDATE User SET password = ? WHERE reset_token = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['error' => 'Error en la preparación de la consulta: ' . $conn->error]);
    exit();
}

$stmt->bind_param("ss", $newPassword, $token);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Contraseña actualizada correctamente']);
} else {
    echo json_encode(['error' => 'Error actualizando la contraseña: ' . $stmt->error]);
}

// Cerrar la conexión
$stmt->close();
$conn->close();
