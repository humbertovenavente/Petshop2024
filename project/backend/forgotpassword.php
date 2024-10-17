<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS para permitir las solicitudes desde el frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Conexión a la base de datos
$host = '192.168.0.131';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

$conn = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

// Leer los datos enviados en el cuerpo de la solicitud POST
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || empty($data['email'])) {
    echo json_encode(['error' => 'Email field is required']);
    exit();
}

$email = $data['email'];

// Verificar si el email existe en la base de datos
$sql = "SELECT * FROM User WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['error' => 'Email address is not registered']);
    exit();
}

$user = $result->fetch_assoc();

// Verificar si el usuario está activo
if ($user['status'] != 1) {  // Asumiendo que '1' es el valor para usuarios activos
    echo json_encode(['error' => 'This account is not active.']);
    exit();
}

// Generar token de restablecimiento de contraseña
$reset_token = bin2hex(random_bytes(25));

// Guardar el token en la base de datos
$sql = "UPDATE User SET reset_token = ? WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $reset_token, $email);

if ($stmt->execute()) {
    // Enviar el correo de restablecimiento de contraseña
    require 'vendor/autoload.php';
    $email_sendgrid = new \SendGrid\Mail\Mail();
    
    $email_sendgrid->setFrom("humberto107_@hotmail.com", "Jose");
    $email_sendgrid->setSubject("Reset Your Password");
    $email_sendgrid->addTo($email, $user['name'] . " " . $user['lastname']);
    $reset_link = "http://172.16.72.67:3000/resetpassword?token=$reset_token";
    
    $email_sendgrid->addContent(
        "text/html", 
        "You requested a password reset. Click the following link to reset your password: <a href='$reset_link'>Reset Password</a>"
    );

    // Enviar el correo
    

    try {
        $response = $sendgrid->send($email_sendgrid);
        echo json_encode(['success' => 'Reset password email was sent']);
    } catch (Exception $e) {
        echo json_encode(['error' => "Failed to send email. Error: {$e->getMessage()}"]);
    }
} else {
    echo json_encode(['error' => 'Failed to store reset token']);
}


$stmt->close();
$conn->close();
?>
