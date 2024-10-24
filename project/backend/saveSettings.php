<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS para permitir las solicitudes desde el frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Configuración de la base de datos
$host = '192.168.0.13';  
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña'; 

// Verificar si la solicitud es una "preflight" OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer los datos enviados en el cuerpo de la solicitud POST
$data = json_decode(file_get_contents("php://input"), true);
$limit = isset($data['limit']) ? (int)$data['limit'] : 10;
$categories = isset($data['categories']) ? implode(',', $data['categories']) : '';

// Verificar si la configuración ya existe
$sqlCheck = "SELECT * FROM AdminSettings WHERE id = 1";
$resultCheck = $conn->query($sqlCheck);

if ($resultCheck->num_rows > 0) {
    // Actualizar la configuración
    $sqlUpdate = "UPDATE AdminSettings SET selected_categories = '$categories', product_limit = $limit WHERE id = 1";
    $conn->query($sqlUpdate);
} else {
    // Insertar la configuración
    $sqlInsert = "INSERT INTO AdminSettings (selected_categories, product_limit) VALUES ('$categories', $limit)";
    $conn->query($sqlInsert);
}

echo json_encode(['success' => true]);

$conn->close();
?>
