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
$host = '192.168.0.74';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => "Conexión fallida: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$id_comment = $data['id_comment'];
$comment = $data['comment'];

// Verificar si se recibieron el id_comment y el contenido del comentario
if (!$id_comment || !$comment) {
    echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
    exit();
}

// Actualizar el comentario
$sql = "UPDATE Comments SET comment = ? WHERE id_comment = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $comment, $id_comment);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Comentario actualizado exitosamente']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo actualizar el comentario']);
}

$stmt->close();
$conn->close();
?>
