<?php
// Habilitar CORS y devolver los datos como JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Conexión a la base de datos
$host = '192.168.0.131'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  

$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Obtener las categorías de los parámetros de la URL
$mainCategoryId = $_GET['mainCategoryId'];
$relatedCategoryId = $_GET['relatedCategoryId'];

// Verificar los valores de las categorías
error_log("mainCategoryId: $mainCategoryId, relatedCategoryId: $relatedCategoryId");

// Consulta SQL para obtener los productos que tienen ambas categorías
$sql = "SELECT p.id_product, p.name, p.price, p.image, p.file_type 
        FROM Product p
        JOIN ProductCategory pc1 ON p.id_product = pc1.product_id
        JOIN ProductCategory pc2 ON p.id_product = pc2.product_id
        WHERE pc1.category_id = ? AND pc2.category_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $mainCategoryId, $relatedCategoryId);

// Ejecutar la consulta y verificar errores
if (!$stmt->execute()) {
    echo json_encode(['error' => $stmt->error]);
    exit;
}

$result = $stmt->get_result();

$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Convertir el blob de la imagen a base64 para mostrar en el frontend
        $imageData = base64_encode($row['image']);
        $products[] = [
            'id' => $row['id_product'],
            'name' => $row['name'],
            'price' => $row['price'],
            'image' => $imageData,
            'file_type' => $row['file_type'] // Asegúrate de enviar el tipo de archivo para mostrar correctamente
        ];
    }
} else {
    error_log("No products found for categories: $mainCategoryId, $relatedCategoryId");
}

echo json_encode($products);

$conn->close();
?>
