<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer los datos enviados
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];

// Eliminar la imagen de perfil del usuario en la base de datos
$sql = "UPDATE User SET profile_pic = NULL, file_type = NULL WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Profile picture deleted successfully.']);
} else {
    echo json_encode(['error' => 'Error deleting profile picture.']);
}

$stmt->close();
$conn->close();
?>
