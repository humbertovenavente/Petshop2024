<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS para permitir las solicitudes desde el frontend
header("Access-Control-Allow-Origin: *");  // Esto permite que cualquier dominio acceda
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");  // Asegúrate de permitir los métodos que necesitas
header("Content-Type: application/json");

// Configuración de la base de datos
$host = '192.168.0.10'; // En la máquina virtual, MySQL y PHP están en la misma máquina
$db = 'project';  // Nombre de la base de datos
$user = 'humbe';  // Usuario de la base de datos
$pass = 'tu_contraseña';  // Contraseña de la base de datos

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer los datos enviados en el cuerpo de la solicitud POST
$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];
$password = $data['password'];

$sql = "SELECT name, lastname, email, password, address, country, city, zipcode, telephone, credit_card_name, credit_card_number, credit_card_exp, cvv, status, last_login, id_rol FROM User WHERE email = ? AND password = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Usuario encontrado
    $row = $result->fetch_assoc();
    echo json_encode($row);
} else {
    echo json_encode(['error' => 'Usuario no encontrado']);
}

$stmt->close();
$conn->close();
?>

