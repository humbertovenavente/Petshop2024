<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");


$host = '172.16.69.227';
$user = 'humbe';
$pass = 'tu_contraseña';
$db = 'project';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$id1 = $_GET['id1'];
$id2 = $_GET['id2'];

$sql = "SELECT p.* 
        FROM Product p
        JOIN ProductCategory pc1 ON p.id_product = pc1.id_product
        JOIN ProductCategory pc2 ON p.id_product = pc2.id_product
        WHERE pc1.id_category = ? AND pc2.id_category = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $id1, $id2);
$stmt->execute();
$result = $stmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode($products);
$stmt->close();
$conn->close();
?>
