<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

$host = '192.168.0.14';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer los datos enviados
$data = json_decode(file_get_contents("php://input"), true);

$id_product = $data['id_product'];
$id_user = $data['id_user'];
$comment = $data['comment'];
$id_parent = isset($data['id_parent']) ? $data['id_parent'] : null; // Valor por defecto si no hay id_parent

// Verificar que todos los campos requeridos están presentes
if (!$id_product || !$id_user || !$comment) {
    echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
    exit();
}

// Insertar el comentario en la base de datos
$sql = "INSERT INTO Comments (id_product, id_user, comment, id_parent) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iisi", $id_product, $id_user, $comment, $id_parent);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Comentario agregado exitosamente']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo agregar el comentario']);
}

$stmt->close();
$conn->close();
?>
