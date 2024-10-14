<?php
// Conexión a la base de datos
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener el ID de la categoría y el nuevo nombre
    $id_category = isset($_POST['id_category']) ? $_POST['id_category'] : '';
    $name = isset($_POST['name']) ? $_POST['name'] : '';

    if (!empty($id_category) && !empty($name)) {
        // Preparar la consulta SQL
        $stmt = $conn->prepare("UPDATE Category SET name = ? WHERE id_category = ?");
        $stmt->bind_param("si", $name, $id_category);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Category updated successfully"]);
        } else {
            echo json_encode(["error" => "Error updating category"]);
        }

        // Cerrar la declaración
        $stmt->close();
    } else {
        echo json_encode(["error" => "Category ID and name cannot be empty"]);
    }
}

// Cerrar la conexión
$conn->close();
?>
