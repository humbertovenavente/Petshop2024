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
$host = '192.168.0.74'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  

$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Obtener el contenido enviado por Axios (JSON)
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validar que los datos existen
$category_id = isset($data['category_id']) ? $data['category_id'] : null;
$min_price = isset($data['min_price']) ? $data['min_price'] : 0;
$max_price = isset($data['max_price']) ? $data['max_price'] : PHP_INT_MAX;
$search_term = isset($data['search_term']) ? $data['search_term'] : '';

// Preparar la llamada al procedimiento almacenado
$stmt = $conn->prepare("CALL searchCategory(?, ?, ?, ?)"); // Ajustar para incluir search_term
$stmt->bind_param('idds', $category_id, $min_price, $max_price, $search_term); // Cambiar a 4 parámetros

// Ejecutar el procedimiento almacenado
$stmt->execute();

// Obtener el resultado
$result = $stmt->get_result();

// Verificar si hay resultados
$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Si la imagen está almacenada como BLOB, conviértela a Base64
        if ($row['image']) {
            $row['image'] = base64_encode($row['image']);
        }
        $products[] = $row;
    }
    echo json_encode($products);
} else {
    echo json_encode([]);
}

// Cerrar la conexión y la declaración
$stmt->close();
$conn->close();
?>
