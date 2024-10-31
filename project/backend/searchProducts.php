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
$host = '172.16.69.227';
$user = 'humbe';
$pass = 'tu_contraseña';
$db = 'project';

$connection = new mysqli($host, $user, $pass, $db);

// Verificar la conexión
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

// Obtener el término de búsqueda y dividirlo en palabras clave
$searchTerm = isset($_GET['term']) ? $connection->real_escape_string($_GET['term']) : '';
$searchTerms = explode(' ', $searchTerm);

// Crear condiciones dinámicas para que todas las palabras clave deban coincidir en el conjunto de categorías
$conditions = [];
foreach ($searchTerms as $term) {
    $conditions[] = "(GROUP_CONCAT(c.name SEPARATOR ' ') LIKE '%$term%' OR p.name LIKE '%$term%')";
}

// Unir condiciones con "AND" para que coincida con todas las palabras clave
$whereClause = implode(' AND ', $conditions);

// Consulta SQL para buscar productos que coincidan con todas las palabras clave en sus categorías
$sql = "
    SELECT DISTINCT p.id_product, p.name, p.price, p.image, p.file_type 
    FROM Product AS p
    JOIN ProductCategory AS pc ON p.id_product = pc.id_product
    JOIN Category AS c ON pc.id_category = c.id_category
    GROUP BY p.id_product
    HAVING $whereClause
";

$result = $connection->query($sql);

$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = [
            'id_product' => $row['id_product'],
            'name' => $row['name'],
            'price' => $row['price'],
            'image' => base64_encode($row['image']),
            'file_type' => $row['file_type']
        ];
    }
}

// Devolver resultados como JSON
echo json_encode($products);

$connection->close();
?>
