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

// Consulta de todas las órdenes con el nombre y correo del usuario
$sql = "
    SELECT o.id_order, o.order_date, o.status, u.name, u.email 
    FROM `Order` o 
    JOIN `User` u ON o.id_user = u.id_user"; // Asume que `Order` tiene una columna `id_user` que se refiere al usuario

$result = $conn->query($sql);

$orders = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
}

echo json_encode(['success' => true, 'orders' => $orders]);

$conn->close();
?>
