<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Configuración de la base de datos
$host = '192.168.0.74'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  

$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer los datos enviados en el cuerpo de la solicitud POST
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['selectedCategories']) || !isset($data['section'])) {
    echo json_encode(['error' => 'Faltan datos obligatorios']);
    exit();
}

$selectedCategories = $data['selectedCategories'];
$section = (int)$data['section'];

// Establecer todas las categorías como no seleccionadas
$conn->query("UPDATE Category SET is_selected = 0, section = 1");

// Marcar las categorías seleccionadas y actualizar `section`
$stmt = $conn->prepare("UPDATE Category SET is_selected = 1, section = ? WHERE id_category = ?");
foreach ($selectedCategories as $id_category) {
    $stmt->bind_param("ii", $section, $id_category);
    $stmt->execute();
}

echo json_encode(['message' => 'Selección guardada exitosamente']);

$stmt->close();
$conn->close();
?>
