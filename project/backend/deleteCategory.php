<?php
// Conexión a la base de datos
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener el ID de la categoría a eliminar
    $id_category = isset($_POST['id_category']) ? $_POST['id_category'] : '';

    if (!empty($id_category)) {
        // Preparar la consulta SQL
        $stmt = $conn->prepare("DELETE FROM Category WHERE id_category = ?");
        $stmt->bind_param("i", $id_category);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Category deleted successfully"]);
        } else {
            echo json_encode(["error" => "Error deleting category"]);
        }

        // Cerrar la declaración
        $stmt->close();
    } else {
        echo json_encode(["error" => "Category ID cannot be empty"]);
    }
}

// Cerrar la conexión
$conn->close();
?>
