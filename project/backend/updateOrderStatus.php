<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Conexión a la base de datos
$host = '192.168.0.74';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Obtener los datos enviados desde el frontend
$data = json_decode(file_get_contents('php://input'), true);
$id_order = $data['id_order'];
$new_status = $data['status'];
$comment = isset($data['comment']) ? $data['comment'] : null; // Obtener comentario si está presente

// Validar los datos
if (!$id_order || !$new_status) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
    exit();
}

// Actualizar el estado y comentario de la orden
$query = "UPDATE `Order` SET status = ?, comment = ? WHERE id_order = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('ssi', $new_status, $comment, $id_order);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar el estado o comentario de la orden']);
}

$stmt->close();
$conn->close();
?>
