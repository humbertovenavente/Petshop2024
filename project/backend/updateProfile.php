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
$host = '172.16.72.69'; 
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

// Verificar que todos los campos existen en el JSON
if (isset($data['email'])) {
    // Extraer los datos del perfil
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

    // Actualizar los datos del perfil en la base de datos
    $sql = "UPDATE User SET name=?, lastname=?, telephone=?, address=?, city=?, country=?, zipcode=?, credit_card_name=?, credit_card_number=?, credit_card_exp=?, cvv=? WHERE email=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssssssss', $name, $lastname, $telephone, $address, $city, $country, $zipcode, $credit_card_name, $credit_card_number, $credit_card_exp, $cvv, $email);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Perfil actualizado correctamente.']);
    } else {
        echo json_encode(['error' => 'Error al actualizar el perfil en la base de datos.']);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'Datos incompletos']);
}

$conn->close();
?>
