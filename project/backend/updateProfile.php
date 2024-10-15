<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Configuración de la base de datos
$host = '192.168.0.131'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer los datos enviados
$data = json_decode(file_get_contents("php://input"), true);

// Verificar si profile_pic y file_type están llegando correctamente
if (isset($data['profile_pic']) && isset($data['file_type'])) {
    // Imprimir los primeros 100 caracteres de profile_pic y file_type
    error_log('Imagen recibida: ' . substr($data['profile_pic'], 0, 100));
    error_log('Tipo de archivo recibido: ' . $data['file_type']);
} else {
    die(json_encode(['error' => 'La imagen o el tipo de archivo no fueron recibidos']));
}

// Obtener campos
$email = $data['email'];
$profile_pic = $data['profile_pic'];  // Imagen en formato base64
$file_type = $data['file_type'];      // Tipo MIME de la imagen

// Decodificar la imagen base64 a formato binario
$profile_pic_blob = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $profile_pic));

// Verificar que la decodificación de la imagen no haya fallado
if ($profile_pic_blob === false) {
    die(json_encode(['error' => 'Error al decodificar la imagen base64']));
}

// Para depuración: Verificar el tamaño del blob
error_log('Tamaño de la imagen en bytes: ' . strlen($profile_pic_blob));

// Actualizar la imagen y el tipo de archivo en la base de datos
$sql = "UPDATE User SET profile_pic=?, file_type=? WHERE email=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('sss', $profile_pic_blob, $file_type, $email);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Imagen guardada correctamente.']);
} else {
    echo json_encode(['error' => 'Error al guardar la imagen en la base de datos.']);
}

$stmt->close();
$conn->close();
?>
