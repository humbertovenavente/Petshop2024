<?php
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $credit_card_name = $_POST['credit_card_name'];
    $credit_card_number = $_POST['credit_card_number'];
    $credit_card_exp = $_POST['credit_card_exp'];
    $cvv = $_POST['cvv'];

    // Verifica si los datos llegaron correctamente
    error_log("Datos recibidos:");
    error_log(print_r($_POST, true));

    if (empty($email) || empty($credit_card_name) || empty($credit_card_number) || empty($credit_card_exp) || empty($cvv)) {
        echo json_encode(['error' => 'Faltan datos']);
        exit();
    }

    $sql = "UPDATE User SET credit_card_name=?, credit_card_number=?, credit_card_exp=?, cvv=? WHERE email=?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        // Error al preparar la consulta
        error_log('Error al preparar la consulta: ' . $conn->error);
        echo json_encode(['error' => 'Error al preparar la consulta']);
        exit();
    }

    $stmt->bind_param('sssss', $credit_card_name, $credit_card_number, $credit_card_exp, $cvv, $email);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Tarjeta de crédito actualizada correctamente']);
    } else {
        error_log('Error al ejecutar la consulta SQL: ' . $stmt->error);
        echo json_encode(['error' => 'Error al ejecutar la consulta SQL']);
    }

    $stmt->close();
}

$conn->close();
?>
