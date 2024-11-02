<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Configuración de la base de datos
$host = '192.168.0.14'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer los datos enviados desde el cliente
$data = json_decode(file_get_contents("php://input"), true);

// Obtener todos los datos del perfil
$email = $data['email'];
$name = $data['name'];
$lastname = $data['lastname'];
$telephone = $data['telephone'];
$address = $data['address'];
$city = $data['city'];
$country = $data['country'];
$zipcode = $data['zipcode'];
$credit_card_name = $data['credit_card_name'];
$credit_card_number = $data['credit_card_number'];
$credit_card_exp = $data['credit_card_exp'];
$cvv = $data['cvv'];
$profile_pic = isset($data['profile_pic']) ? $data['profile_pic'] : null; // Base64 sin el prefijo
$file_type = isset($data['file_type']) ? $data['file_type'] : null; // Tipo de archivo (si existe)

// 1. Actualizar los datos básicos del perfil, sin la imagen
$stmt = $conn->prepare("UPDATE User SET name = ?, lastname = ?, telephone = ?, address = ?, city = ?, country = ?, zipcode = ?, credit_card_name = ?, credit_card_number = ?, credit_card_exp = ?, cvv = ? WHERE email = ?");
$stmt->bind_param('ssssssssssss', $name, $lastname, $telephone, $address, $city, $country, $zipcode, $credit_card_name, $credit_card_number, $credit_card_exp, $cvv, $email);

if (!$stmt->execute()) {
    echo json_encode(['error' => 'Error updating profile: ' . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// 2. Si hay una imagen nueva, actualizar solo la imagen y el tipo de archivo
if ($profile_pic) {
    $decoded_image = base64_decode($profile_pic);  // Decodificar la imagen
    $stmt = $conn->prepare("UPDATE User SET profile_pic = ?, file_type = ? WHERE email = ?");
    $stmt->bind_param('bss', $null, $file_type, $email);
    $stmt->send_long_data(0, $decoded_image);

    if (!$stmt->execute()) {
        echo json_encode(['error' => 'Error updating profile picture: ' . $stmt->error]);
        $stmt->close();
        $conn->close();
        exit();
    }
    $stmt->close();
}

echo json_encode(['message' => 'Profile updated successfully.']);
$conn->close();
?>
