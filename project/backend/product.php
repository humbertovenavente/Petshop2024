<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS para permitir solicitudes desde el frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Configuración de la base de datos
$host = '172.16.72.69'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Consulta SQL para obtener productos y categorías
$sql = "
    SELECT 
        p.id_product, 
        p.name, 
        p.description, 
        p.price, 
        p.inventory, 
        IF(p.inventory < 1, 'Out of Stock', 'In Stock') AS stock,
        p.comment, 
        p.color, 
        p.size, 
        p.image, 
        p.file_type,
        c.id_category,
        c.name AS category_name
    FROM 
        Product p
    LEFT JOIN 
        ProductCategory pc ON p.id_product = pc.id_product
    LEFT JOIN 
        Category c ON pc.id_category = c.id_category
";

$result = $conn->query($sql);

// Verificar si la consulta fue exitosa
if (!$result) {
    echo json_encode(['error' => 'Error en la consulta SQL: ' . $conn->error]);
    $conn->close();
    exit();
}

// Organizar productos y categorías
$products = [];
while ($row = $result->fetch_assoc()) {
    $productId = $row['id_product'];
    if (!isset($products[$productId])) {
        $products[$productId] = [
            'id_product' => $row['id_product'],
            'name' => $row['name'],
            'description' => $row['description'],
            'price' => $row['price'],
            'inventory' => $row['inventory'],
            'comment' => $row['comment'],
            'color' => $row['color'],
            'size' => $row['size'],
            'image' => base64_encode($row['image']),  // Codificar la imagen en Base64
            'file_type' => $row['file_type'],
            'categories' => []
        ];
    }
    if ($row['id_category']) {
        $products[$productId]['categories'][] = $row['category_name'];
    }
}

// Convertir el array asociativo en un array indexado
$products = array_values($products);

// Devolver los datos en formato JSON
echo json_encode($products);

$conn->close();
?>
