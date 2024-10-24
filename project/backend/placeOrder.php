<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Conexión a la base de datos
$host = '192.168.0.13';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión']));
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];
$cartItems = $data['items'];  // Los items del carrito
$total = $data['total'];  // El total de la orden, incluido el envío

if (!$email || !$cartItems || !$total) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos']);
    exit();
}

// Estado inicial de la orden
$status = 'Accepted';

// Insertar la orden con el total_amount
$sql = "INSERT INTO `Order` (id_user, order_date, status, total_amount) 
        VALUES ((SELECT id_user FROM User WHERE email = ?), NOW(), ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ssd', $email, $status, $total);  // d: double para total_amount

if ($stmt->execute()) {
    $orderId = $stmt->insert_id;

    // Insertar los productos de la orden en la tabla `OrderProduct`
    foreach ($cartItems as $item) {
        $sqlOrderProduct = "INSERT INTO OrderProduct (id_order, id_product, price, quantity) 
                            VALUES (?, ?, ?, ?)";
        $stmtProduct = $conn->prepare($sqlOrderProduct);
        $stmtProduct->bind_param('iidi', $orderId, $item['id_product'], $item['price'], $item['quantity']);
        $stmtProduct->execute();
    }

    echo json_encode(['success' => true, 'id_order' => $orderId]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al crear la orden']);
}

$conn->close();
?>
