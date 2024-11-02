<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Conexión a la base de datos
$host = '192.168.0.14';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión']));
}

$data = json_decode(file_get_contents("php://input"), true);

$id_order = $data['id_order'] ?? null;
$new_status = $data['new_status'] ?? null;

if (!$id_order || !$new_status) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos']);
    exit();
}

// Actualizar el estado de la orden
$sql = "UPDATE `Order` SET status = ? WHERE id_order = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('si', $new_status, $id_order);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Order updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar la orden']);
}

$conn->close();
?>
