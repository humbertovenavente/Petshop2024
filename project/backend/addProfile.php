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
$host = '192.168.0.11';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer los datos enviados en el cuerpo de la solicitud POST
$data = json_decode(file_get_contents("php://input"), true);

// Extraer los datos del array recibido
$name = $data['name'] ?? '';
$lastname = $data['lastname'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$telephone = $data['telephone'] ?? '';
$address = $data['address'] ?? '';
$city = $data['city'] ?? '';
$country = $data['country'] ?? '';
$zipcode = $data['zipcode'] ?? '';
$credit_card_name = $data['credit_card_name'] ?? '';
$credit_card_number = $data['credit_card_number'] ?? '';
$credit_card_exp = $data['credit_card_exp'] ?? '';
$cvv = (int)($data['cvv'] ?? 0);
$id_rol = $data['id_rol'] ?? 1; // Valor por defecto 1 si no se recibe
$status = $data['status'] ?? 1; // Valor por defecto 1 (activo)

// Verificar si todos los campos requeridos están presentes
if (empty($name) || empty($lastname) || empty($email) || empty($password)) {
    echo json_encode(['error' => 'Faltan campos obligatorios']);
    exit();
}

// Preparar la consulta SQL para insertar el nuevo usuario
$sql = "INSERT INTO User (name, lastname, email, password, telephone, address, city, country, zipcode, credit_card_name, credit_card_number, credit_card_exp, cvv, id_rol, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

// Verificar si la preparación de la consulta falló
if (!$stmt) {
    echo json_encode(['error' => "Error en la preparación de la consulta: " . $conn->error]);
    $conn->close();
    exit();
}

// Asignar los valores a los parámetros de la consulta
$stmt->bind_param("ssssssssssssiii", 
    $name,                 
    $lastname,             
    $email,                
    $password,             
    $telephone,            
    $address,              
    $city,                 
    $country,              
    $zipcode,              
    $credit_card_name,     
    $credit_card_number,   
    $credit_card_exp,      
    $cvv,                  
    $id_rol,               
    $status                
);

// Ejecutar la consulta y verificar si fue exitosa
if ($stmt->execute()) {
    echo json_encode(['message' => 'Usuario agregado exitosamente']);
} else {
    echo json_encode(['error' => 'Error al agregar el usuario', 'details' => $stmt->error]);
}

// Cerrar la declaración y la conexión
$stmt->close();
$conn->close();


