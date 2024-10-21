<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Conexión a la base de datos
$host = '192.168.0.131';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión']));
}

$data = json_decode(file_get_contents("php://input"), true);

$id_order = $data['id_order'] ?? null;

if (!$id_order) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos']);
    exit();
}

// Consulta de los detalles de la orden, incluyendo el comentario
$sql = "SELECT o.id_order, o.status, o.comment, op.id_product, p.name, p.price, op.quantity, p.image 
        FROM `Order` o 
        JOIN OrderProduct op ON o.id_order = op.id_order
        JOIN Product p ON op.id_product = p.id_product
        WHERE o.id_order = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id_order);
$stmt->execute();
$result = $stmt->get_result();

$orderDetails = [];
$products = [];
$total_items = 0;
$total_price = 0;
$status = '';
$comment = '';

while ($row = $result->fetch_assoc()) {
    $status = $row['status']; // Obtener el estado de la orden
    $comment = $row['comment']; // Obtener el comentario de la orden
    $imageData = base64_encode($row['image']); // Convertir la imagen a Base64
    $products[] = [
        'name' => $row['name'],
        'price' => $row['price'],
        'quantity' => $row['quantity'],
        'image' => $imageData,
    ];
    $total_items += $row['quantity'];
    $total_price += $row['price'] * $row['quantity'];
}

// Si no se encontraron productos
if (count($products) === 0) {
    echo json_encode(['success' => false, 'message' => 'No se encontraron productos para esta orden']);
    exit();
}

$orderDetails = [
    'status' => $status, 
    'comment' => $comment, // Agregar el comentario a los detalles de la orden
    'products' => $products,
    'total_items' => $total_items,
    'total_price' => $total_price,
];

echo json_encode(['success' => true, 'orderDetails' => $orderDetails]);

$conn->close();
