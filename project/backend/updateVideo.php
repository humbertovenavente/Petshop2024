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
$host = '192.168.0.16';  
$db = 'project';
$user = 'humbe';  
$pass = 'tu_contraseña'; 

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer los datos enviados en el cuerpo de la solicitud POST
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['video_link']) && isset($data['name'])) {
    $videoLink = $data['video_link'];
    $name = $data['name'];

    // Actualizar el video basado en su nombre
    $query = "UPDATE Video SET video_link = ? WHERE name = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ss', $videoLink, $name);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => $conn->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'El nombre o el enlace del video no fueron proporcionados.']);
}

$conn->close();
?>
