<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = '192.168.0.13';   
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
