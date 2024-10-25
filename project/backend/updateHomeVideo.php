<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

$host = '172.16.71.159';   
$db = 'project';
$user = 'humbe';  
$pass = 'tu_contraseña';  

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['video_link']) && isset($data['name'])) {
    $videoLink = $data['video_link'];
    $name = $data['name'];

    // Actualizar el video basado en el nombre
    $query = "UPDATE Video SET video_link = ? WHERE name = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ss', $videoLink, $name);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => $conn->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'Datos incompletos.']);
}

$conn->close();
?>
