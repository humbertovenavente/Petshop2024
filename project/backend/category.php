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

// Conexión a la base de datos
$host = '172.16.71.178'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  

$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Consulta SQL para obtener categorías
$sql = "SELECT c.id_category, c.name, GROUP_CONCAT(cp.id_parent) AS parentCategories
        FROM Category c 
        LEFT JOIN CategoryParent cp ON c.id_category = cp.id_category
        GROUP BY c.id_category";

$result = $conn->query($sql);

// Verificar si hay resultados
if (!$result) {
    echo json_encode(['error' => 'Error en la consulta SQL: ' . $conn->error]);
    $conn->close();
    exit();
}

$categories = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $categories[] = [
            'id_category' => $row['id_category'],
            'name' => $row['name'],
            'parentCategories' => $row['parentCategories'] ? explode(',', $row['parentCategories']) : []
        ];
    }
}

echo json_encode($categories);
$conn->close();
?>

