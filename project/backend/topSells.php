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
$host = '192.168.0.74'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);

// Verificar si hay errores en la conexión
if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

// Consulta SQL que invoca la vista 'topSells'
$sql = "SELECT id_product, name, price, inventory, image, total_sales FROM topSells";

// Ejecutar la consulta y obtener el resultado
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $topProducts = [];
    while ($row = $result->fetch_assoc()) {
        // Si el campo 'image' no es nulo, convertirlo a Base64
        if (!is_null($row['image'])) {
            $row['image'] = base64_encode($row['image']);
        }
        $topProducts[] = $row;
    }
    // Enviar los resultados como JSON
    echo json_encode($topProducts);
} else {
    // Si no hay resultados, enviar un mensaje
    echo json_encode(["message" => "No se encontraron productos"]);
}

// Cerrar la conexión
$conn->close();
?>
