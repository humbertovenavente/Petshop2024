<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

// Configuración de la base de datos
$host = '192.168.0.16'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  

$conn = new mysqli($host, $user, $pass, $db);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Consultar las categorías seleccionadas y sus descripciones
$sql = "SELECT id_category, name, description, is_selected, section FROM Category";
$result = $conn->query($sql);

$categories = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = [
            'id_category' => $row['id_category'],
            'name' => $row['name'],
            'description' => $row['description'],
            'selected' => (bool)$row['is_selected'],
            'section' => (int)$row['section']  // Agregar el número de secciones
        ];
    }
}

echo json_encode($categories);

$conn->close();
?>
