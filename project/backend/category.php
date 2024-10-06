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
$host = '192.168.0.11';  // Cambia esto a tu IP si es diferente
$db = 'project';   
$user = 'humbe';  
$pass = 'tu_contraseña';  

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Consulta SQL para obtener los datos de las categorías
$sql = "SELECT id_category, name FROM Category";
$result = $conn->query($sql);

// Verificar si la consulta fue exitosa
if (!$result) {
    echo json_encode(['error' => 'Error en la consulta SQL: ' . $conn->error]);
    $conn->close();
    exit();
}

// Comprobar si hay resultados
if ($result->num_rows > 0) {
    $categories = [];
    while($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }
    // Devolver los datos en formato JSON
    echo json_encode($categories);
} else {
    echo json_encode(['message' => 'No se encontraron categorías']);
}

$conn->close();
?>
