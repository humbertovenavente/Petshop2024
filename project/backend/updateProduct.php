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

// Handle OPTIONS requests (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$host = '192.168.0.131';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';
$conn = new mysqli($host, $user, $pass, $db);

// Check the connection
if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

// Read the incoming JSON data from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Extract product data from the incoming request
$id_product = $data['id_product'] ?? null;
$name = $data['name'] ?? null;
$description = $data['description'] ?? null;
$price = $data['price'] ?? null;
$inventory = $data['inventory'] ?? null;
$comment = $data['comment'] ?? null;
$color = $data['color'] ?? null;
$size = $data['size'] ?? null;
$rate = $data['rate'] ?? null;
$categories = $data['categories'] ?? []; // Array of selected category IDs

// Validate that essential fields are not empty
if (empty($id_product) || empty($name) || empty($categories)) {
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

// Determine the stock status based on inventory
$stock = $inventory == 0 ? 0 : 1; // 0 for Out of Stock, 1 for In Stock

// Update the product in the Product table
$sql = "UPDATE Product SET name = ?, description = ?, price = ?, inventory = ?, stock = ?, comment = ?, color = ?, size = ?, rate = ? WHERE id_product = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'Error preparing SQL statement: ' . $conn->error]);
    $conn->close();
    exit();
}

$stmt->bind_param("ssdiisssii", $name, $description, $price, $inventory, $stock, $comment, $color, $size, $rate, $id_product);

if ($stmt->execute()) {
    // First, delete any existing product-category relationships
    $sql = "DELETE FROM ProductCategory WHERE id_product = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['error' => 'Error preparing delete statement: ' . $conn->error]);
        $conn->close();
        exit();
    }
    $stmt->bind_param("i", $id_product);
    $stmt->execute();

    // Insert the new product-category relationships
    $sql = "INSERT INTO ProductCategory (id_product, id_category) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['error' => 'Error preparing insert statement: ' . $conn->error]);
        $conn->close();
        exit();
    }

    foreach ($categories as $id_category) {
        $stmt->bind_param("ii", $id_product, $id_category);
        $stmt->execute();
    }

    echo json_encode(['message' => 'Product updated successfully']);
} else {
    echo json_encode(['error' => 'Error updating product', 'details' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
