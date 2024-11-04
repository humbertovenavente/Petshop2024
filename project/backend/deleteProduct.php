<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Enable CORS for frontend requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Database connection
$host = '192.168.0.74';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

// Connect to the database
$conn = new mysqli($host, $user, $pass, $db);

// Check the connection
if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

// Read the incoming data
$data = json_decode(file_get_contents("php://input"), true);

// Check if the product ID is present
if (!isset($data['id_product'])) {
    echo json_encode(['error' => 'Missing product ID']);
    exit();
}

$id_product = $data['id_product'];

// SQL query to delete the product
$sql = "DELETE FROM Product WHERE id_product = ?";
$stmt = $conn->prepare($sql);

// Check if the preparation failed
if (!$stmt) {
    echo json_encode(['error' => "Error preparing query: " . $conn->error]);
    $conn->close();
    exit();
}

// Bind the parameter and execute the query
$stmt->bind_param("i", $id_product);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Product deleted successfully']);
} else {
    echo json_encode(['error' => 'Error deleting product', 'details' => $stmt->error]); // Muestra detalles del error
}

$stmt->close();
$conn->close();
?>
