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

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión']));
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos']);
    exit();
}

// Obtener órdenes del usuario
$sql = "SELECT o.id_order, o.order_date, o.status, 
        SUM(op.price * op.quantity) as total_price, 
        SUM(op.quantity) as total_items 
        FROM `Order` o 
        JOIN OrderProduct op ON o.id_order = op.id_order 
        WHERE o.id_user = (SELECT id_user FROM User WHERE email = ?)
        GROUP BY o.id_order";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $email);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
    echo json_encode(['success' => true, 'orders' => $orders]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al obtener las órdenes']);
}

$conn->close();

?> 
