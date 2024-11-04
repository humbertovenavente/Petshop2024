<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$host = '192.168.0.74';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$id_product = $data['id_product'] ?? null;
$categories = $data['categories'] ?? [];

if ($id_product && is_array($categories)) {
    $sql = "DELETE FROM ProductCategory WHERE id_product = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_product);
    $stmt->execute();
    $stmt->close();

    $sql = "INSERT INTO ProductCategory (id_product, id_category) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);

    foreach ($categories as $id_category) {
        $stmt->bind_param("ii", $id_product, $id_category);
        $stmt->execute();
    }

    echo json_encode(['message' => 'Categorías actualizadas correctamente']);
} else {
    echo json_encode(['error' => 'Datos incompletos']);
}

$stmt->close();
$conn->close();
?>
