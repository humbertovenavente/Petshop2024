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
$host = '172.16.69.227';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

$conn = new mysqli($host, $user, $pass, $db);

// Check the connection
if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

// Read incoming data
$data = json_decode(file_get_contents("php://input"), true);

// Validate received data
if (!isset($data['question']) || !isset($data['answer'])) {
    die(json_encode(['error' => 'Invalid data received']));
}

$question = $conn->real_escape_string($data['question']);
$answer = $conn->real_escape_string($data['answer']);
$id = isset($data['id']) ? intval($data['id']) : null;

if ($id) {
    // Update existing FAQ
    $sql = "UPDATE faq SET question = '$question', answer = '$answer' WHERE id = $id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => "Error updating FAQ: " . $conn->error]);
    }
} else {
    // Insert new FAQ
    $sql = "INSERT INTO faq (question, answer) VALUES ('$question', '$answer')";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => "Error inserting FAQ: " . $conn->error]);
    }
}

$conn->close();
?>
