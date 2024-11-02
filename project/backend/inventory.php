<?php
// Habilitar la visualización de errores para la depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS para solicitudes del frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Conexión a la base de datos
$host = '192.168.0.14';  // Cambia por la IP de tu servidor
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';
$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(['error' => "Error en la conexión: " . $conn->connect_error]));
}

// Consultar el inventario de productos
$sql = "
    SELECT 
        id_product, 
        name, 
        price, 
        inventory,  -- Solo usamos el campo 'inventory'
        ventas,  -- Mostrar las ventas
        color, 
        size
    FROM Product
";

$result = $conn->query($sql);

// Verificar si la consulta fue exitosa
if (!$result) {
    echo json_encode(['error' => 'Error en la consulta SQL: ' . $conn->error]);
    $conn->close();
    exit();
}

// Organizar los productos en un array
$inventory = [];
while ($row = $result->fetch_assoc()) {
    $inventory[] = $row;
}

// Asegurarse de que la respuesta sea un array (aunque esté vacío)
echo json_encode($inventory ?: []);

$conn->close();
?>
