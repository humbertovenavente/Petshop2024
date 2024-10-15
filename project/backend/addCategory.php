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
$host = '192.168.0.131'; 
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

// Verificar si todos los campos requeridos están presentes
if (empty($name)) {
    echo json_encode(['error' => 'Falta el campo obligatorio nombre']);
    exit();
}

// Preparar la consulta SQL para insertar la nueva categoría
$sql = "INSERT INTO Category (name) VALUES (?)";

$stmt = $conn->prepare($sql);

// Verificar si la preparación de la consulta falló
if (!$stmt) {
    echo json_encode(['error' => "Error en la preparación de la consulta: " . $conn->error]);
    $conn->close();
    exit();
}

// Asignar el valor al parámetro de la consulta
$stmt->bind_param("s", $name);

// Ejecutar la consulta y verificar si fue exitosa
if ($stmt->execute()) {
    echo json_encode(['message' => 'Categoría agregada exitosamente']);
} else {
    echo json_encode(['error' => 'Error al agregar la categoría', 'details' => $stmt->error]);
}

// Cerrar la declaración y la conexión
$stmt->close();
$conn->close();
?>
