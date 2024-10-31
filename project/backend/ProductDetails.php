<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

$host = '172.16.69.227';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

$productId = $_GET['productId'];

// Obtener el producto
$sqlProduct = "SELECT id_product, name, description, price, color, size, inventory, stock, image, file_type FROM Product WHERE id_product = ?";
$stmtProduct = $conn->prepare($sqlProduct);
$stmtProduct->bind_param("i", $productId);
$stmtProduct->execute();
$resultProduct = $stmtProduct->get_result();
$product = $resultProduct->fetch_assoc();

// Convertir la imagen en Base64 si existe
if ($product && !empty($product['image'])) {
    $product['image'] = base64_encode($product['image']);
}

// Obtener los comentarios y los nombres de los usuarios asociados
$sqlComments = "SELECT c.id_comment, c.comment, c.id_user, c.id_parent, u.name 
                FROM Comments c
                JOIN User u ON c.id_user = u.id_user
                WHERE c.id_product = ?";
$stmtComments = $conn->prepare($sqlComments);
$stmtComments->bind_param("i", $productId);
$stmtComments->execute();
$resultComments = $stmtComments->get_result();

$comments = [];
while ($row = $resultComments->fetch_assoc()) {
    $comments[] = $row;
}

if ($product) {
    echo json_encode([
        'product' => $product,
        'comments' => $comments
    ]);
} else {
    echo json_encode(['error' => 'Producto no encontrado']);
}

$conn->close();
?>
