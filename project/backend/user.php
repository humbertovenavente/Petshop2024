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

// Configuración de la base de datos
$host = '172.16.72.12';  // Cambia esto a tu IP si es diferente
$db = 'project';   
$user = 'humbe';  
$pass = 'tu_contraseña';  

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Consulta SQL para obtener los datos de los usuarios
$sql = "SELECT id_user, name, lastname, email, password, address, country, city, zipcode, telephone, credit_card_name, credit_card_number, credit_card_exp, cvv, status, last_login, id_rol FROM User";
$result = $conn->query($sql);

// Verificar si la consulta fue exitosa
if (!$result) {
    echo json_encode(['error' => 'Error en la consulta SQL: ' . $conn->error]);
    $conn->close();
    exit();
}

// Comprobar si hay resultados
if ($result->num_rows > 0) {
    $user = [];
    while($row = $result->fetch_assoc()) {
        $user[] = $row;
    }
    // Devolver los datos en formato JSON
    echo json_encode($user);
} else {
    echo json_encode(['message' => 'No users found']);
}

$conn->close();
?>
