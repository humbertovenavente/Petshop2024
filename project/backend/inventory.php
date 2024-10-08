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

// SQL query to fetch product inventory and related details
$sql = "
    SELECT 
        id_product, 
        name, 
        price, 
        inventory, 
        IF(inventory < 1, 'Out of Stock', 'In Stock') AS stock,  
        color, 
        size, 
        rate  
    FROM Product
";

$result = $conn->query($sql);

// Check if the query was successful
if (!$result) {
    echo json_encode(['error' => 'Error in SQL query: ' . $conn->error]);
    $conn->close();
    exit();
}

// Organize products into an array
$inventory = [];
while ($row = $result->fetch_assoc()) {
    $inventory[] = $row;
}

// Ensure the response is an array (even if empty)
echo json_encode($inventory ?: []);

$conn->close();
?>
