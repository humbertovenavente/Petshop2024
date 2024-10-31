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
$host = '172.16.69.227'; 
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

// Verificar que los datos obligatorios están presentes
if (!isset($data['id_category']) || !isset($data['name'])) {
    echo json_encode(['error' => 'Faltan datos obligatorios']);
    exit();
}

$id_category = $data['id_category'];
$name = $data['name'];

// Preparar la consulta SQL para actualizar la categoría
$sql = "UPDATE Category SET name = ? WHERE id_category = ?";
$stmt = $conn->prepare($sql);

// Verificar si la preparación de la consulta falló
if (!$stmt) {
    echo json_encode(['error' => "Error en la preparación de la consulta: " . $conn->error]);
    $conn->close();
    exit();
}

// Asignar los valores a la consulta
$stmt->bind_param("si", $name, $id_category);

// Ejecutar la consulta y verificar si fue exitosa
if ($stmt->execute()) {
    echo json_encode(['message' => 'Categoría actualizada exitosamente']);
} else {
    echo json_encode(['error' => 'Error al actualizar la categoría', 'details' => $stmt->error]);
}

// Cerrar la declaración y la conexión
$stmt->close();
$conn->close();
?>