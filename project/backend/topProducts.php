<?php
// Mostrar errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Conexión a la base de datos
$host = '192.168.0.74'; // Cambia si es necesario
$user = 'humbe';        // Tu usuario
$pass = 'tu_contraseña'; // Tu contraseña
$db = 'project';         // Nombre de la base de datos

// Crear la conexión
$connection = new mysqli($host, $user, $pass, $db);

// Verificar la conexión
if ($connection->connect_error) {
    die(json_encode(['error' => "Error en la conexión: " . $connection->connect_error]));
}

// Consulta a la vista `inventoryProducts`
$query = "SELECT id_product, name, price, inventory, image FROM inventoryProducts";
$result = $connection->query($query);

// Verificar si hay resultados
if ($result->num_rows > 0) {
    $products = [];

    while($row = $result->fetch_assoc()) {
        // Verificar si hay una imagen en el campo BLOB
        if (!empty($row['image'])) {
            // Detección del tipo de imagen a partir de su contenido
            $imageInfo = getimagesizefromstring($row['image']);
            if ($imageInfo) {
                // Obtener el tipo MIME de la imagen (image/jpeg, image/png, etc.)
                $mimeType = $imageInfo['mime'];

                // Convertir los datos binarios (BLOB) a base64
                $row['image'] = 'data:' . $mimeType . ';base64,' . base64_encode($row['image']);
            } else {
                // Si no se puede detectar el tipo de imagen, devolver null
                $row['image'] = null;
            }
        } else {
            // Si no hay imagen, devolver null
            $row['image'] = null;
        }

        // Agregar el producto al array
        $products[] = $row;
    }

    // Devolver los productos en formato JSON
    echo json_encode($products);
} else {
    echo json_encode([]); // Devolver un array vacío si no hay productos
}

// Cerrar la conexión
$connection->close();
?>
