<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Verificar si el script se está ejecutando en CLI y definir REQUEST_METHOD
if (php_sapi_name() === 'cli') {
    $_SERVER['REQUEST_METHOD'] = 'CLI';
}

// Configuración de CORS para solicitudes HTTP (solo se aplica si no es CLI)
if ($_SERVER['REQUEST_METHOD'] !== 'CLI') {
    // Obtener el origen de la solicitud
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    $allowed_origins = ['http://192.168.0.12:3000', 'http://localhost:3000'];

    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Configuración de la base de datos
$host = '192.168.0.16';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Ejecutar el procedimiento almacenado
$sql = "CALL disableUser()";
$result = $conn->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $email = $row['email'];
        $name = $row['name'];
        $lastname = $row['lastname'];

        // Generar un nuevo token de verificación
        $verification_token = bin2hex(random_bytes(25));

        // Consumir todos los resultados del procedimiento almacenado
        while ($conn->more_results()) {
            $conn->next_result();
        }

        // Actualizar el token en la base de datos para el usuario desactivado
        $updateTokenSQL = "UPDATE User SET verification_token = ? WHERE email = ?";
        $updateStmt = $conn->prepare($updateTokenSQL);
        $updateStmt->bind_param("ss", $verification_token, $email);

        if ($updateStmt->execute()) {
            // Configuración del envío de correo
            require 'vendor/autoload.php';
            $email_sendgrid = new \SendGrid\Mail\Mail();
            
            $email_sendgrid->setFrom("humberto107_@hotmail.com", "Michigan");
            $email_sendgrid->setSubject("Account Deactivation Due to Inactivity");
            $email_sendgrid->addTo($email, "$name $lastname");
            $reactivation_link = "http://192.168.0.12:3000/reactivate?token=$verification_token";
            
            $email_sendgrid->addContent(
                "text/html",
                "Due to inactivity, your account has been disabled. Please click <a href='$reactivation_link'>here</a> to reactivate your account."
            );
            
            //aqui
            
            try {
                $response = $sendgrid->send($email_sendgrid);
                echo "Correo enviado a $email\n";
            } catch (Exception $e) {
                echo "Error al enviar correo a $email: " . $e->getMessage() . "\n";
            }
        } else {
            echo "Error al actualizar el token para $email: " . $updateStmt->error . "\n";
        }

        $updateStmt->close();
    }
} else {
    echo "Error al ejecutar el procedimiento: " . $conn->error . "\n";
}

// Cerrar la conexión
$conn->close();
?>
