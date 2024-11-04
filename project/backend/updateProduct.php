<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Leer los datos enviados
$data = json_decode(file_get_contents("php://input"), true);

// Extraer los datos del producto y la imagen
$id_product = $data['id_product'] ?? null;
$image = $data['image'] ?? null;
$file_type = $data['file_type'] ?? null;
$name = $data['name'] ?? null;
$description = $data['description'] ?? null;
$price = $data['price'] ?? null;
$inventory = $data['inventory'] ?? null;
$comment = $data['comment'] ?? null;
$color = $data['color'] ?? null;
$size = $data['size'] ?? null;
$categories = $data['categories'] ?? [];

// Verificar que se enviaron los datos necesarios
if (!$id_product || !$name || !$description || !$price || !$inventory || empty($categories)) {
    echo json_encode(['error' => 'Faltan campos obligatorios']);
    exit();
}

// Actualizar los detalles del producto en la base de datos
$sql = "UPDATE Product SET name = ?, description = ?, price = ?, inventory = ?, comment = ?, color = ?, size = ? WHERE id_product = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssdisssi", $name, $description, $price, $inventory, $comment, $color, $size, $id_product);

if ($stmt->execute()) {
    // Actualizar las categorías
    $sql = "DELETE FROM ProductCategory WHERE id_product = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_product);
    $stmt->execute();

    $sql = "INSERT INTO ProductCategory (id_product, id_category) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);

    foreach ($categories as $id_category) {
        $stmt->bind_param("ii", $id_product, $id_category);
        $stmt->execute();
    }

    // Si hay una imagen, también actualizar la imagen y el tipo de archivo
    if ($image && $file_type) {
        $image_blob = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));

        if ($image_blob !== false) {
            $sql = "UPDATE Product SET image = ?, file_type = ? WHERE id_product = ?";
            $stmt = $conn->prepare($sql);
            $stmt->send_long_data(0, $image_blob);
            $stmt->bind_param("ssi", $image_blob, $file_type, $id_product);
            $stmt->execute();
        } else {
            echo json_encode(['error' => 'Error al decodificar la imagen']);
        }
    }

    echo json_encode(['message' => 'Producto actualizado correctamente']);
} else {
    echo json_encode(['error' => 'Error al actualizar el producto']);
}

$stmt->close();
$conn->close();
?>
