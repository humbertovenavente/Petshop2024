<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Configuración de la base de datos
$host = '172.16.71.159';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => "Conexión fallida: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$id_comment = $data['id_comment'];

// Verificar si se recibió el id_comment
if (!$id_comment) {
    echo json_encode(['status' => 'error', 'message' => 'Falta el ID del comentario']);
    exit();
}

// Eliminar el comentario
$sql = "DELETE FROM Comments WHERE id_comment = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_comment);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Comentario eliminado exitosamente']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo eliminar el comentario']);
}

$stmt->close();
$conn->close();
?>
