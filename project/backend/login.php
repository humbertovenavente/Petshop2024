<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS para permitir las solicitudes desde el frontend
header("Access-Control-Allow-Origin: *");  // Esto permite que cualquier dominio acceda
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");  

// Configuración de la base de datos
$host = '192.168.0.13';
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
$email = $data['email'];
$password = $data['password'];

// Verificar si el usuario existe
$sql = "SELECT * FROM User WHERE email = ? AND password = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Usuario encontrado
    $row = $result->fetch_assoc();

    if ($row['status'] == 1) {
       // Actualizar el campo last_login al iniciar sesión
       $last_login = date('Y-m-d H:i:s');
       $update_sql = "UPDATE User SET last_login = ? WHERE email = ?";
       $update_stmt = $conn->prepare($update_sql);
       $update_stmt->bind_param("ss", $last_login, $email);
       $update_stmt->execute();

       echo json_encode(['rol' => $row['id_rol'], 'name' => $row['name']]);
    }
} else {
    echo json_encode(['error' => 'Credenciales incorrectas']);
}

$stmt->close();
$conn->close();
?>