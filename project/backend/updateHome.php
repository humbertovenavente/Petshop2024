<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

$host = '172.16.69.227'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña'; 

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$field = $data['field'] ?? null;
$text = $data['text'] ?? null;
$slider = isset($data['slider']) ? base64_decode($data['slider']) : null;

if ($field && ($text !== null || $slider !== null)) {
    if ($slider) {
        $stmt = $conn->prepare("UPDATE Home SET $field = ? WHERE id_home = 1");
        $stmt->bind_param('b', $slider);
        $stmt->send_long_data(0, $slider);
    } else {
        $stmt = $conn->prepare("UPDATE Home SET $field = ? WHERE id_home = 1");
        $stmt->bind_param('s', $text);
    }

    if ($stmt->execute()) {
        echo json_encode(["message" => "$field actualizado correctamente"]);
    } else {
        echo json_encode(["error" => "Error al actualizar $field"]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Datos inválidos o campo no especificado"]);
}

$conn->close();
?>
