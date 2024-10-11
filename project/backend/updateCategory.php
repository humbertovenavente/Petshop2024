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
$host = '172.16.71.178';
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

$id_category = $data['id_category'] ?? null;
$name = $data['name'] ?? '';
$parentCategories = $data['parentCategories'] ?? [];

// Validar los campos
if (empty($id_category) || empty($name)) {
    echo json_encode(['error' => 'Faltan campos obligatorios']);
    exit();
}

// Actualizar el nombre de la categoría
$sql = "UPDATE Category SET name = ? WHERE id_category = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => "Error preparando la consulta: " . $conn->error]);
    exit();
}

$stmt->bind_param("si", $name, $id_category);

if ($stmt->execute()) {
    // Eliminar relaciones anteriores en la tabla intermedia
    $sqlDelete = "DELETE FROM CategoryParent WHERE id_category = ?";
    $stmtDelete = $conn->prepare($sqlDelete);
    $stmtDelete->bind_param("i", $id_category);
    $stmtDelete->execute();

    // Insertar nuevas relaciones de categorías padre
    foreach ($parentCategories as $id_parent) {
        $sqlParent = "INSERT INTO CategoryParent (id_category, id_parent) VALUES (?, ?)";
        $stmtParent = $conn->prepare($sqlParent);
        $stmtParent->bind_param("ii", $id_category, $id_parent);
        $stmtParent->execute();
    }

    echo json_encode(['message' => 'Categoría actualizada exitosamente']);
} else {
    echo json_encode(['error' => 'Error al actualizar la categoría']);
}

$stmt->close();
$conn->close();
?>
