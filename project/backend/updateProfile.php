<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$profile_pic = $data['profile_pic'];  // Base64 sin el prefijo
$file_type = $data['file_type'];

if ($profile_pic) {
    $decoded_image = base64_decode($profile_pic);  // Decodificar la imagen
    $stmt = $conn->prepare("UPDATE User SET profile_pic = ?, file_type = ? WHERE email = ?");
    $stmt->bind_param('bss', $null, $file_type, $email);
    $stmt->send_long_data(0, $decoded_image);
} else {
    $stmt = $conn->prepare("UPDATE User SET file_type = ? WHERE email = ?");
    $stmt->bind_param('ss', $file_type, $email);
}

if ($stmt->execute()) {
    echo json_encode(['message' => 'Profile updated successfully.']);
} else {
    echo json_encode(['error' => 'Error updating profile.']);
}

$stmt->close();
$conn->close();
?>
