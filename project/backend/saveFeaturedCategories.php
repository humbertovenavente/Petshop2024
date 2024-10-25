<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Conexión a la base de datos
$host = '172.16.71.159'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Eliminar las categorías actuales destacadas
$sqlDelete = "DELETE FROM FeaturedCategories";
$conn->query($sqlDelete);

// Obtener las categorías seleccionadas del frontend
$data = json_decode(file_get_contents("php://input"), true);
$categories = $data['categories'] ?? [];

if (!empty($categories)) {
    // Insertar las nuevas categorías destacadas
    foreach ($categories as $id_category) {
        $sql = "INSERT INTO FeaturedCategories (id_category) VALUES ($id_category)";
        if (!$conn->query($sql)) {
            die(json_encode(['error' => "Error al insertar la categoría $id_category: " . $conn->error]));
        }
    }
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'No categories selected']);
}

$conn->close();
?>
