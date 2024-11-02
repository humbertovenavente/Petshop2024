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
$host = '192.168.0.14'; 
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

// Extraer datos del producto
$name = $data['name'];
$description = $data['description'];
$price = $data['price'];
$inventory = $data['inventory'];
$stock = $data['stock'];
$comment = $data['comment'];
$color = $data['color'];
$size = $data['size'];
$image = $data['image'] ?? null;  
$file_type = $data['file_type'] ?? null;  
$categories = $data['categories'] ?? [];  // Array de IDs de categorías

// Verificar que se recibieron los datos necesarios que son nombre, precio e inventario tiene que escribir
if (empty($name) || empty($price) || empty($inventory)) {
    echo json_encode(['error' => 'Faltan campos obligatorios']);
    exit();
}

// Insertar el nuevo producto en la tabla de productos
$sql = "INSERT INTO Product (name, description, price, inventory, stock, comment, color, size, image, file_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ssdiisssss', $name, $description, $price, $inventory, $stock, $comment, $color, $size, $image, $file_type);

if ($stmt->execute()) {
    $id_product = $stmt->insert_id;  // Obtener el ID del producto insertado

    // Asociar categorías al producto en la tabla intermedia
    if (!empty($categories)) {
        $sql_category = "INSERT INTO ProductCategory (id_product, id_category) VALUES (?, ?)";
        $stmt_category = $conn->prepare($sql_category);
        foreach ($categories as $id_category) {
            $stmt_category->bind_param('ii', $id_product, $id_category);
            $stmt_category->execute();
        }
    }

    echo json_encode(['message' => 'Producto agregado exitosamente']);
} else {
    echo json_encode(['error' => 'Error al agregar el producto', 'details' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
