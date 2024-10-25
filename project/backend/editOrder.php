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
$host = '172.16.71.159'; // Cambia esto a tu IP o hostname si es necesario
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Conexión fallida: ' . $conn->connect_error]);
    exit();
}

// Obtener el ID de la orden desde el parámetro de la URL
$id_order = isset($_GET['id_order']) ? intval($_GET['id_order']) : null;

// Validar si se proporcionó el id_order
if (!$id_order) {
    echo json_encode(['success' => false, 'message' => 'ID de orden no proporcionado']);
    exit();
}

// Obtener la información básica de la orden
$sqlOrder = "SELECT o.id_order, o.status, o.comment, u.email, u.name 
             FROM `Order` o
             INNER JOIN `User` u ON o.id_user = u.id_user
             WHERE o.id_order = ?";
$stmtOrder = $conn->prepare($sqlOrder);
$stmtOrder->bind_param("i", $id_order);
$stmtOrder->execute();
$resultOrder = $stmtOrder->get_result();
$order = $resultOrder->fetch_assoc();

// Validar si la orden existe
if (!$order) {
    echo json_encode(['success' => false, 'message' => 'Orden no encontrada']);
    exit();
}

// Obtener los productos asociados a la orden
$sqlProducts = "SELECT p.id_product, p.name, p.price, p.image, op.quantity
                FROM `Product` p
                INNER JOIN `OrderProduct` op ON p.id_product = op.id_product
                WHERE op.id_order = ?";
$stmtProducts = $conn->prepare($sqlProducts);
$stmtProducts->bind_param("i", $id_order);
$stmtProducts->execute();
$resultProducts = $stmtProducts->get_result();

$products = [];
while ($row = $resultProducts->fetch_assoc()) {
    // Convertir la imagen en Base64
    if (!empty($row['image'])) {
        $row['image'] = base64_encode($row['image']);
    }
    $products[] = $row;
}

// Devolver los datos de la orden y productos como respuesta JSON
echo json_encode([
    'success' => true,
    'order' => $order,
    'products' => $products
]);

// Cerrar la conexión
$stmtOrder->close();
$stmtProducts->close();
$conn->close();
?>
