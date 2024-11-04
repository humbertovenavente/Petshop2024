<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

// Conexión a la base de datos
$host = '192.168.0.74'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Verificar si se recibió el ID de la categoría
if (!isset($_GET['id_category'])) {
    echo json_encode(['error' => 'ID de categoría no proporcionado']);
    exit();
}

$id_category = $_GET['id_category'];

// Consultar la descripción de la categoría
$sql = "SELECT description FROM Category WHERE id_category = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_category);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $category = $result->fetch_assoc();
    echo json_encode($category);
} else {
    echo json_encode(['description' => '']);
}

$stmt->close();
$conn->close();
?>
