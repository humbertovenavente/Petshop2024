<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "192.168.0.74";
$username = "humbe";
$password = "tu_contraseña";
$dbname = "project";

// Crear conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Verificar si los datos se enviaron correctamente
$data = json_decode(file_get_contents("php://input"), true);
if (isset($data['id_product']) && isset($data['categories'])) {
    $id_product = $data['id_product'];
    $categories = $data['categories'];

    // Eliminar todas las categorías actuales del producto
    $deleteQuery = "DELETE FROM product_categories WHERE id_product = ?";
    $stmt = $conn->prepare($deleteQuery);
    $stmt->bind_param("i", $id_product);
    $stmt->execute();
    $stmt->close();

    // Insertar las categorías seleccionadas para el producto
    $insertQuery = "INSERT INTO product_categories (id_product, id_category) VALUES (?, ?)";
    $stmt = $conn->prepare($insertQuery);

    foreach ($categories as $id_category) {
        $stmt->bind_param("ii", $id_product, $id_category);
        $stmt->execute();
    }
    $stmt->close();

    echo json_encode(["success" => true, "message" => "Categorías actualizadas correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos."]);
}

$conn->close();
?>
