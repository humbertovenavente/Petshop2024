<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Database connection
$host = '192.168.0.11';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

// Extract product data
$name = $data['name'];
$description = $data['description'];
$price = $data['price'];
$inventory = $data['inventory'];
$stock = $data['stock'];
$comment = $data['comment'];
$color = $data['color'];
$size = $data['size'];
$rate = $data['rate'];
$categories = $data['categories']; // Array of selected category IDs

// Insert product into the Product table
$sql = "INSERT INTO Product (name, description, price, inventory, stock, comment, color, size, rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssdiisssi", $name, $description, $price, $inventory, $stock, $comment, $color, $size, $rate);

if ($stmt->execute()) {
    $id_product = $stmt->insert_id; // Get the inserted product ID

    // Insert the product-category relationships into the ProductCategory table
    foreach ($categories as $id_category) {
        $sql = "INSERT INTO ProductCategory (id_product, id_category) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $id_product, $id_category);
        $stmt->execute();
    }

    echo json_encode(['message' => 'Product added successfully']);
} else {
    echo json_encode(['error' => 'Error adding product']);
}

$stmt->close();
$conn->close();
?>
