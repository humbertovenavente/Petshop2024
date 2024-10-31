<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$host = '172.16.69.227'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

// Verificar que el método sea POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    // Verificar que los campos requeridos estén presentes
    if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
        echo json_encode(['error' => 'Missing required fields']);
        exit();
    }

    // Extraer los datos del usuario
    $name = $data['name'];
    $lastname = $data['lastname'];
    $email = $data['email'];
    $password = $data['password'];  // Asegúrate de que estás recibiendo la contraseña
    $telephone = $data['telephone'];
    $address = $data['address'];
    $city = $data['city'];
    $country = $data['country'];
    $zipcode = $data['zipcode'];
    $id_rol = $data['id_rol'];
    $status = $data['status'];

    // Inserción del usuario
    $sql = "INSERT INTO User (name, lastname, email, password, telephone, address, city, country, zipcode, id_rol, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssssss", $name, $lastname, $email, $password, $telephone, $address, $city, $country, $zipcode, $id_rol, $status);

    if ($stmt->execute()) {
        echo json_encode(['success' => 'User added successfully']);
    } else {
        echo json_encode(['error' => 'Failed to add user: ' . $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>
