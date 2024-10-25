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
$host = '172.16.71.159';  
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

// Asignar los valores solo si existen
$id_user = $data['id_user'] ?? null;
$name = $data['name'] ?? null;
$lastname = $data['lastname'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null; 
$telephone = $data['telephone'] ?? null;
$address = $data['address'] ?? null;
$city = $data['city'] ?? null;
$country = $data['country'] ?? null;
$zipcode = $data['zipcode'] ?? null;
$credit_card_name = $data['credit_card_name'] ?? null;
$credit_card_number = $data['credit_card_number'] ?? null;
$credit_card_exp = $data['credit_card_exp'] ?? null;
$cvv = isset($data['cvv']) ? (int) $data['cvv'] : null;
$id_rol = isset($data['id_rol']) ? (int) $data['id_rol'] : null;
$status = isset($data['status']) ? (int) $data['status'] : null;
$last_login = $data['last_login'] ?? null; 

// Verificar si se proporcionó id_user
if (!$id_user) {
    echo json_encode(['error' => 'El campo id_user es obligatorio']);
    exit();
}

// Iniciar la consulta de actualización
$sql = "UPDATE User SET ";

// Variables para almacenar los campos que se van a actualizar y los tipos de datos
$updates = [];
$types = "";
$params = [];

// Solo agregar los campos que se proporcionaron
if ($name) {
    $updates[] = "name = ?";
    $types .= "s";
    $params[] = $name;
}
if ($lastname) {
    $updates[] = "lastname = ?";
    $types .= "s";
    $params[] = $lastname;
}
if ($email) {
    $updates[] = "email = ?";
    $types .= "s";
    $params[] = $email;
}
if ($password) {
    $updates[] = "password = ?";
    $types .= "s";
    $params[] = $password;
}
if ($telephone) {
    $updates[] = "telephone = ?";
    $types .= "s";
    $params[] = $telephone;
}
if ($address) {
    $updates[] = "address = ?";
    $types .= "s";
    $params[] = $address;
}
if ($city) {
    $updates[] = "city = ?";
    $types .= "s";
    $params[] = $city;
}
if ($country) {
    $updates[] = "country = ?";
    $types .= "s";
    $params[] = $country;
}
if ($zipcode) {
    $updates[] = "zipcode = ?";
    $types .= "s";
    $params[] = $zipcode;
}
if ($credit_card_name) {
    $updates[] = "credit_card_name = ?";
    $types .= "s";
    $params[] = $credit_card_name;
}
if ($credit_card_number) {
    $updates[] = "credit_card_number = ?";
    $types .= "s";
    $params[] = $credit_card_number;
}
if ($credit_card_exp) {
    $updates[] = "credit_card_exp = ?";
    $types .= "s";
    $params[] = $credit_card_exp;
}
if ($cvv !== null) {
    $updates[] = "cvv = ?";
    $types .= "i";
    $params[] = $cvv;
}
if ($id_rol !== null) {
    $updates[] = "id_rol = ?";
    $types .= "i";
    $params[] = $id_rol;
}
if ($status !== null) {
    $updates[] = "status = ?";
    $types .= "i";
    $params[] = $status;
}
if ($last_login) {
    $updates[] = "last_login = ?";
    $types .= "s";
    $params[] = $last_login;
}

// Añadir el campo id_user al final de los parámetros
$types .= "i";
$params[] = $id_user;

// Unir los campos para crear la sentencia SQL final
$sql .= implode(", ", $updates) . " WHERE id_user = ?";

// Preparar la consulta SQL
$stmt = $conn->prepare($sql);

// Verificar si la preparación de la consulta falló
if (!$stmt) {
    echo json_encode(['error' => "Error en la preparación de la consulta: " . $conn->error]);
    $conn->close();
    exit();
}

// Ejecutar la consulta
$stmt->bind_param($types, ...$params);
if ($stmt->execute()) {
    echo json_encode(['message' => 'Usuario actualizado exitosamente']);
} else {
    echo json_encode(['error' => 'Error al actualizar el usuario', 'details' => $stmt->error]);
}

// Cerrar la declaración y la conexión
$stmt->close();
$conn->close();
?>

