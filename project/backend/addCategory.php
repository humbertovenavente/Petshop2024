<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
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

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer los datos recibidos
$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$parentCategories = $data['parentCategories'] ?? [];

// Validar los campos
if (empty($name)) {
    echo json_encode(['error' => 'El campo nombre es obligatorio']);
    exit();
}

// Insertar la categoría
$sql = "INSERT INTO Category (name) VALUES (?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => "Error preparando la consulta: " . $conn->error]);
    exit();
}

$stmt->bind_param("s", $name);

if ($stmt->execute()) {
    $id_category = $stmt->insert_id;

    // Insertar las categorías padre en la tabla intermedia
    foreach ($parentCategories as $id_parent) {
        $sqlParent = "INSERT INTO CategoryParent (id_category, id_parent) VALUES (?, ?)";
        $stmtParent = $conn->prepare($sqlParent);
        $stmtParent->bind_param("ii", $id_category, $id_parent);
        $stmtParent->execute();
    }

    echo json_encode(['message' => 'Categoría agregada exitosamente']);
} else {
    echo json_encode(['error' => 'Error al agregar la categoría']);
}

$stmt->close();
$conn->close();
?>

