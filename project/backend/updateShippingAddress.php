<?php
// Habilitar la visualización de errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

$host = '172.16.72.69'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Verificar si es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verifica que todos los datos se estén recibiendo
    if (isset($_POST['email']) && isset($_POST['address']) && isset($_POST['city']) && isset($_POST['country']) && isset($_POST['zipcode'])) {
        $email = $_POST['email'];  
        $address = $_POST['address'];
        $city = $_POST['city'];
        $country = $_POST['country'];
        $zipcode = $_POST['zipcode'];

        // Actualizar la dirección de envío
        $sql = "UPDATE User SET address=?, city=?, country=?, zipcode=? WHERE email=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sssss', $address, $city, $country, $zipcode, $email);

        if ($stmt->execute()) {
            // Verificar si se recibieron datos de la tarjeta de crédito y actualizarlos también
            if (isset($_POST['credit_card_name']) && isset($_POST['credit_card_number']) && isset($_POST['credit_card_exp']) && isset($_POST['cvv'])) {
                $credit_card_name = $_POST['credit_card_name'];
                $credit_card_number = $_POST['credit_card_number'];
                $credit_card_exp = $_POST['credit_card_exp'];
                $cvv = $_POST['cvv'];

                $sql_card = "UPDATE User SET credit_card_name=?, credit_card_number=?, credit_card_exp=?, cvv=? WHERE email=?";
                $stmt_card = $conn->prepare($sql_card);
                $stmt_card->bind_param('sssss', $credit_card_name, $credit_card_number, $credit_card_exp, $cvv, $email);

                if ($stmt_card->execute()) {
                    echo json_encode(['message' => 'Profile updated successfully']);
                } else {
                    echo json_encode(['error' => 'Failed to update credit card information']);
                }

                $stmt_card->close();
            } else {
                echo json_encode(['message' => 'Address updated successfully']);
            }
        } else {
            echo json_encode(['error' => 'Failed to update address']);
        }

        $stmt->close();
    } else {
        echo json_encode(['error' => 'Faltan datos']);
    }
}

$conn->close();
?>
