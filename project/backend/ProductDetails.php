<?php
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

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

$productId = $_GET['productId'];

// Obtener el producto
$sqlProduct = "SELECT id_product, name, description, price, color, size, inventory, stock, image FROM Product WHERE id_product = ?";
$stmtProduct = $conn->prepare($sqlProduct);
$stmtProduct->bind_param("i", $productId);
$stmtProduct->execute();
$resultProduct = $stmtProduct->get_result();
$product = $resultProduct->fetch_assoc();

// Convertir la imagen en Base64
if ($product && !empty($product['image'])) {
    $product['image'] = base64_encode($product['image']);
}

// Obtener las categorías del producto
$sqlCategories = "SELECT c.name FROM Category c
                  INNER JOIN ProductCategory pc ON c.id_category = pc.id_category
                  WHERE pc.id_product = ?";
$stmtCategories = $conn->prepare($sqlCategories);
$stmtCategories->bind_param("i", $productId);
$stmtCategories->execute();
$resultCategories = $stmtCategories->get_result();

$categories = [];
while ($row = $resultCategories->fetch_assoc()) {
    $categories[] = $row['name'];
}

if ($product) {
    echo json_encode(['product' => $product, 'categories' => $categories]);
} else {
    echo json_encode(['error' => 'Producto no encontrado']);
}

$conn->close();
?>
