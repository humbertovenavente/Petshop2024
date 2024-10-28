<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

$host = '192.168.0.16';   
$db = 'project';
$user = 'humbe';  
$pass = 'tu_contraseña';  

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Ahora seleccionamos desde la tabla 'Video'
$query = "SELECT name, video_link FROM Video"; 
$result = $conn->query($query);

$videos = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $videos[] = $row;  // Añadimos el nombre y el enlace del video al array
    }
    echo json_encode($videos);
} else {
    echo json_encode(['videos' => []]);
}

$conn->close();
?>
