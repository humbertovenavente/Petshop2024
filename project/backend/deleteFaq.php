<?php
// Habilitar reporte de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS para solicitudes del frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Datos de conexión a la base de datos
$host = '172.16.71.159';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

// Conectar a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

// Leer los datos enviados en la solicitud POST
$data = json_decode(file_get_contents("php://input"), true);

// Verificar si el ID de la FAQ está presente
if (!isset($data['id']) || empty($data['id'])) {
    die(json_encode(['error' => 'ID not provided']));
}

$id = $conn->real_escape_string($data['id']);

// Eliminar la FAQ de la base de datos
$sql = "DELETE FROM faq WHERE id = $id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Error deleting FAQ: ' . $conn->error]);
}

// Cerrar la conexión
$conn->close();
?>
