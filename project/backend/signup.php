<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Obtener el origen de la solicitud
$origin = $_SERVER['HTTP_ORIGIN'];

// Lista de orígenes permitidos
$allowed_origins = [
    'http://192.168.0.12:3000',
    'http://localhost:3000'
];

// Verificar si el origen está en la lista de permitidos
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

// El resto de los encabezados CORS
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");  // Permitir cookies o credenciales
header("Content-Type: application/json");

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


// Configuración de la base de datos
$host = '172.16.72.69';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer los datos enviados en el cuerpo de la solicitud POST
$data = json_decode(file_get_contents("php://input"), true);

// Validar que los campos requeridos existan
if (!isset($data['name'], $data['lastname'], $data['email'], $data['password'], $data['id_rol'])) {
    echo json_encode(['error' => 'Faltan campos obligatorios']);
    exit();
}

// Asignar los valores
$name = $data['name'];
$lastname = $data['lastname'];
$email = $data['email'];
$password = $data['password'];  // Sin encriptación de contraseña
$id_rol = $data['id_rol'];
$verification_token = bin2hex(random_bytes(25));  // Generar un token de verificación

// Verificar si el correo ya existe en la base de datos
$sql = "SELECT * FROM User WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['error' => 'El correo ya está registrado']);
    exit();
}

// Preparar la consulta SQL para insertar el usuario
$sql = "INSERT INTO User (name, lastname, email, password, id_rol, verification_token, status) VALUES (?, ?, ?, ?, ?, ?, 0)";
$stmt = $conn->prepare($sql);

// Comprobar si la preparación de la consulta fue exitosa
if ($stmt === false) {
    echo json_encode(['error' => 'Error en la preparación de la consulta: ' . $conn->error]);
    exit();
}

// Vincular los parámetros a la consulta
$stmt->bind_param("ssssss", $name, $lastname, $email, $password, $id_rol, $verification_token);

// Ejecutar la consulta
if ($stmt->execute()) {
    // Cargar SendGrid
    require 'vendor/autoload.php';
    $email_sendgrid = new \SendGrid\Mail\Mail();
    
    $email_sendgrid->setFrom("humberto107_@hotmail.com", "Jose");
    $email_sendgrid->setSubject("Verifica tu cuenta");
    $email_sendgrid->addTo($email, $name . " " . $lastname);
    $verification_link = "http://172.16.72.67:3000/verify?token=$verification_token";
        $email_sendgrid->addContent(
        "text/html", 
        "Gracias por registrarte. Haz clic en este enlace para verificar tu cuenta: <a href='$verification_link'>Verificar cuenta</a>"
    );

    // Enviar el correo de verificación usando la clave API de SendGrid
  

    try {
        $response = $sendgrid->send($email_sendgrid);
        echo json_encode(['message' => 'Usuario creado con éxito. Revisa tu correo para verificar tu cuenta.']);
    } catch (Exception $e) {
        echo json_encode(['error' => "El correo de verificación no pudo ser enviado. Error: {$e->getMessage()}"]);
    }
} else {
    echo json_encode(['error' => 'Error al insertar los datos: ' . $conn->error]);
}

// Cerrar la consulta y la conexión a la base de datos
$stmt->close();
$conn->close();
?>
