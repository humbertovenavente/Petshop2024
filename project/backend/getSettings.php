<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = '192.168.0.14';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Obtener la configuración desde AdminSettings
$sql = "SELECT selected_categories, product_limit FROM AdminSettings WHERE id = 1";
$result = $conn->query($sql);

$categories = [];
$limit = 10;  // Valor por defecto

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $categories = explode(',', $row['selected_categories']);
    $limit = $row['product_limit'];
}

echo json_encode([
    'categories' => $categories,
    'limit' => $limit
]);

$conn->close();
?>
