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
$host = '192.168.0.74';  
$db = 'project';
$user = 'humbe';  
$pass = 'tu_contraseña';

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => "Conexión fallida: " . $conn->connect_error]);
    exit();
}

// Leer los datos enviados en el cuerpo de la solicitud POST
$data = json_decode(file_get_contents("php://input"), true);

// Verificar que el id_user está presente
if (!isset($data['id_user'])) {
    echo json_encode(['success' => false, 'message' => 'Falta el id_user']);
    exit();
}

$id_user = $data['id_user'];

// Preparar la consulta SQL para eliminar el usuario
$sql = "DELETE FROM User WHERE id_user = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => "Error en la preparación de la consulta: " . $conn->error]);
    exit();
}

// Asignar el valor a la consulta
$stmt->bind_param("i", $id_user);

// Ejecutar la consulta y verificar si fue exitosa
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Usuario eliminado exitosamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al eliminar el usuario']);
}

// Cerrar la declaración y la conexión
$stmt->close();
$conn->close();
