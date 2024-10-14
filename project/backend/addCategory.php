<?php
// Conexión a la base de datos
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener el nombre de la nueva categoría
    $name = isset($_POST['name']) ? $_POST['name'] : '';

    if (!empty($name)) {
        // Preparar la consulta SQL
        $stmt = $conn->prepare("INSERT INTO Category (name) VALUES (?)");
        $stmt->bind_param("s", $name);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Category added successfully"]);
        } else {
            echo json_encode(["error" => "Error adding category"]);
        }

        // Cerrar la declaración
        $stmt->close();
    } else {
        echo json_encode(["error" => "Category name cannot be empty"]);
    }
}

// Cerrar la conexión
$conn->close();
?>
