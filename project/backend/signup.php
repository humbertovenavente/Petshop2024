<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS para permitir las solicitudes desde el frontend
header("Access-Control-Allow-Origin: *");  // Esto permite que cualquier dominio acceda
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GEAT, OPTIONS");  
header("Content-Type: application/json");

// Configuración de la base de datos
$host = '172.16.71.178'; // En la máquina virtual, MySQL y PHP están en la misma máquina
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

// Validar que los campos requeridos existan
if (!isset($data['name'], $data['lastname'], $data['email'], $data['password'],  $data['id_rol'])) {
    echo json_encode(['error' => 'Faltan campos obligatorios']);
    exit();
}

// Asignar los valores
$name = $data['name'];
$lastname = $data['lastname'];
$email = $data['email'];
$password = $data['password'];
$id_rol = $data['id_rol'];

// Preparar la consulta SQL para insertar el usuario
$sql = "INSERT INTO User (name, lastname, email, password, id_rol) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

// Comprobar si la preparación de la consulta fue exitosa
if ($stmt === false) {
    echo json_encode(['error' => 'Error en la preparación de la consulta: ' . $conn->error]);
    exit();
}

// Vincular los parámetros a la consulta
$stmt->bind_param("ssssi", $name, $lastname, $email, $password, $id_rol);

// Ejecutar la consulta y devolver una respuesta en JSON
if ($stmt->execute()) {
    echo json_encode(['message' => 'Usuario creado con éxito']);
} else {
    echo json_encode(['error' => 'Error al insertar los datos: ' . $conn->error]);
}

// Cerrar la consulta y la conexión a la base de datos
$stmt->close();
$conn->close();
?>
