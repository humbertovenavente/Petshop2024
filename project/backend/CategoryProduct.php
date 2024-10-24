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
$host = '192.168.0.13';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Obtener el id de la categoría desde el query parameter
$categoryId = $_GET['categoryId'] ?? null;

// Verificar si el id de categoría está presente
if (!$categoryId) {
    die(json_encode(['error' => "El id de la categoría no se proporcionó correctamente o es null."]));
}

// Consulta SQL para obtener los productos de la categoría seleccionada usando un JOIN
$sql = "
    SELECT p.id_product, p.name, p.price, p.image, p.file_type 
    FROM Product p
    INNER JOIN ProductCategory pc ON p.id_product = pc.id_product
    WHERE pc.id_category = ?
";

// Preparar la consulta SQL
$stmt = $conn->prepare($sql);
if (!$stmt) {
    die(json_encode(['error' => "Error al preparar la consulta SQL: " . $conn->error]));
}

// Vincular el parámetro de la categoría
$stmt->bind_param("i", $categoryId);

// Ejecutar la consulta
if (!$stmt->execute()) {
    die(json_encode(['error' => "Error al ejecutar la consulta: " . $stmt->error]));
}

$result = $stmt->get_result();

// Verificar si la consulta devolvió filas
if ($result->num_rows > 0) {
    $products = [];
    while ($row = $result->fetch_assoc()) {
        // Convertir la imagen blob a base64
        $imageBase64 = base64_encode($row['image']);
        $imageSrc = 'data:' . $row['file_type'] . ';base64,' . $imageBase64;

        $products[] = [
            'id_product' => $row['id_product'],
            'name' => $row['name'],
            'price' => $row['price'],
            'image' => $imageSrc // Imagen en formato Base64
        ];
    }
    // Devolver los productos en formato JSON
    echo json_encode($products);
} else {
    echo json_encode(['message' => "No se encontraron productos para la categoría con id: " . $categoryId]);
}

// Cerrar la conexión y los recursos
$stmt->close();
$conn->close();
?>
