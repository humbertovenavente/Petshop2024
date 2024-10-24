<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS para permitir las solicitudes desde el frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

$host = '192.168.0.13';
$db = 'project';
$user = 'humbe';
$pass = 'tu_contraseña';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Obtener configuraciones guardadas
$sqlSettings = "SELECT selected_categories, product_limit FROM AdminSettings WHERE id = 1";
$resultSettings = $conn->query($sqlSettings);

if ($resultSettings && $resultSettings->num_rows > 0) {
    $settings = $resultSettings->fetch_assoc();
    $categories = $settings['selected_categories'];
    $limit = (int) $settings['product_limit'];

    // Asegúrate de que las categorías se traten como una lista válida
    $categoriesArray = explode(',', $categories);
    $categoriesList = implode(',', array_map('intval', $categoriesArray)); // Aseguramos que sean enteros

    // Si hay categorías seleccionadas, usarlo para filtrar productos
    if (!empty($categoriesList)) {
        $sql = "
            SELECT * 
            FROM topAllSells
            WHERE id_product IN (
                SELECT id_product 
                FROM ProductCategory 
                WHERE id_category IN ($categoriesList)
            )
            LIMIT $limit
        ";
        
        $result = $conn->query($sql);
        
        if ($result === false) {
            // Mostrar el error de la consulta
            echo json_encode(['error' => 'Error en la consulta SQL: ' . $conn->error]);
        } else {
            $products = [];

            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    // Decodificar la imagen en base64 si es necesario
                    $row['image'] = base64_encode($row['image']);
                    $products[] = $row;
                }
                echo json_encode($products);
            } else {
                echo json_encode([]);
            }
        }
    } else {
        // Si no hay categorías seleccionadas, devolver vacío o un mensaje
        echo json_encode(['error' => 'No se seleccionaron categorías']);
    }
} else {
    echo json_encode(['error' => 'No se encontraron configuraciones']);
}

$conn->close();
