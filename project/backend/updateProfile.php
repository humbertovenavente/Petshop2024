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
$host = '192.168.0.8';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer los datos enviados
$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'];
$lastname = $data['lastname'];
$email = $data['email'];
$password = $data['password'];
$address = $data['address'];
$country = $data['country'];
$zipcode = $data['zipcode'];
$credit_card_name = $data['credit_card_name'];
$credit_card_number = $data['credit_card_number'];
$cvv = $data['cvv'];

// Actualizar el perfil en la base de datos
$sql = "UPDATE User SET name = ?, lastname = ?, password = ?, address = ?, country = ?, zipcode = ?, credit_card_name = ?, credit_card_number = ?, cvv = ? WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssssss", $name, $lastname, $password, $address, $country, $zipcode, $credit_card_name, $credit_card_number, $cvv, $email);
$stmt->execute();

// Verificar si la actualización fue exitosa
if ($stmt->affected_rows > 0) {
    echo json_encode(['message' => 'Perfil actualizado exitosamente']);
} else {
    echo json_encode(['error' => 'Error al actualizar el perfil']);
}

$stmt->close();
$conn->close();
?>
