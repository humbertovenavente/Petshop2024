<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

$host = '192.168.0.131'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña'; 

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

$query = "SELECT * FROM Home WHERE id_home = 1";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // Convertir imágenes a base64
    if (!empty($row['slider1'])) {
        $row['slider1'] = base64_encode($row['slider1']);
    }
    if (!empty($row['slider2'])) {
        $row['slider2'] = base64_encode($row['slider2']);
    }
    if (!empty($row['slider3'])) {
        $row['slider3'] = base64_encode($row['slider3']);
    }
    
    echo json_encode($row);
} else {
    echo json_encode(["error" => "No se encontraron datos"]);
}

$conn->close();
?>
