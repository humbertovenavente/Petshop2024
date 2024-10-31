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
$host = '172.16.69.227';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

// Connect to the database
$conn = new mysqli($host, $user, $pass, $db);

// Check the connection
if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

// Fetch all FAQs
$sql = "SELECT * FROM faq ORDER BY faq_order";
$result = $conn->query($sql);

$faqs = array();
while ($row = $result->fetch_assoc()) {
    $faqs[] = $row;
}

echo json_encode($faqs);
?>
