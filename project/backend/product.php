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

// SQL query to fetch products and their associated categories
$sql = "
    SELECT 
        p.id_product, 
        p.name, 
        p.description, 
        p.price, 
        p.inventory, 
        IF(p.inventory < 1, '0', p.stock) AS stock,  /* Automatically set stock to '0' (Out of Stock) if inventory is less than 1 */
        p.comment, 
        p.color, 
        p.size, 
        p.rate, 
        c.id_category,
        c.name AS category_name
    FROM 
        Product p
    LEFT JOIN 
        ProductCategory pc ON p.id_product = pc.id_product
    LEFT JOIN 
        Category c ON pc.id_category = c.id_category
";

$result = $conn->query($sql);

// Check if the query was successful
if (!$result) {
    echo json_encode(['error' => 'Error in SQL query: ' . $conn->error]);
    $conn->close();
    exit();
}

// Organize products and their categories
$products = [];
while ($row = $result->fetch_assoc()) {
    $productId = $row['id_product'];
    if (!isset($products[$productId])) {
        $products[$productId] = [
            'id_product' => $row['id_product'],
            'name' => $row['name'],
            'description' => $row['description'],
            'price' => $row['price'],
            'inventory' => $row['inventory'],
            'stock' => $row['stock'],
            'comment' => $row['comment'],
            'color' => $row['color'],
            'size' => $row['size'],
            'rate' => $row['rate'],
            'categories' => []
        ];
    }
    if ($row['id_category']) {
        $products[$productId]['categories'][] = $row['category_name'];
    }
}

// Convert associative array to indexed array
$products = array_values($products);

// Return the data in JSON format
echo json_encode($products);

$conn->close();
?>
