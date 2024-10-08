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
$host = '172.16.71.178';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';
$conn = new mysqli($host, $user, $pass, $db);

// Check the connection
if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

// Retrieve product inventory and set stock automatically
$sql = "SELECT id_product, name, price, inventory, IF(inventory < 1, '0', '1') AS stock FROM Product";
$result = $conn->query($sql);

// Check if query was successful
if (!$result) {
    echo json_encode(['error' => 'Error in SQL query: ' . $conn->error]);
    $conn->close();
    exit();
}

$inventory = [];
while ($row = $result->fetch_assoc()) {
    $inventory[] = $row;
}

// Return inventory data in JSON format
echo json_encode($inventory);

$conn->close();
?>
