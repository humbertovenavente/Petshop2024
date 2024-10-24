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
$host = '192.168.0.13'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  

$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Consulta SQL para obtener categorías y relaciones de productos
$sql = "SELECT DISTINCT c1.id_category as main_category_id, 
                c1.name as main_category_name, 
                c2.id_category as related_category_id, 
                c2.name as related_category_name
        FROM ProductCategory pc1
        JOIN Category c1 ON pc1.id_category = c1.id_category
        JOIN ProductCategory pc2 ON pc1.id_product = pc2.id_product
        JOIN Category c2 ON pc2.id_category = c2.id_category
        WHERE c1.id_category != c2.id_category;";

$result = $conn->query($sql);

$categories = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Asegurarnos de que los campos main_category_id y related_category_id estén presentes
        $categories[$row['main_category_id']]['id_category'] = $row['main_category_id'];
        $categories[$row['main_category_id']]['name'] = $row['main_category_name'];
        $categories[$row['main_category_id']]['related_categories'][] = [
            'id' => $row['related_category_id'],
            'name' => $row['related_category_name']
        ];
    }
}

echo json_encode(array_values($categories));

$conn->close();
?>
