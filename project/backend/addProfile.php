<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

$host = '192.168.0.131'; 
$db = 'project';  
$user = 'humbe';  
$pass = 'tu_contraseña';  

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['error' => "Conexión fallida: " . $conn->connect_error]));
}

// Verificación de método POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];

    // Verificar si se ha subido un archivo y no hay errores
    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === 0) {
        $fileTmpPath = $_FILES['profile_pic']['tmp_name'];
        $fileSize = $_FILES['profile_pic']['size'];  // Tamaño del archivo
        $fileType = $_FILES['profile_pic']['type'];  // Tipo MIME del archivo

        // Verificar que el archivo existe
        if (file_exists($fileTmpPath)) {
            // Leer el contenido del archivo
            $imgContent = file_get_contents($fileTmpPath);
            
            if ($imgContent !== false) {
                // Convertir la imagen a base64
                $imgBase64 = base64_encode($imgContent);

                // Verificar el tamaño del archivo (opcional, para depuración)
                if ($fileSize > 5000000) { // 5MB como ejemplo
                    echo json_encode(['error' => 'El archivo es demasiado grande.']);
                    exit();
                }

                // Depurar el tipo MIME (opcional)
                if ($fileType !== 'image/jpeg' && $fileType !== 'image/png') {
                    echo json_encode(['error' => 'Solo se permiten archivos JPEG o PNG.']);
                    exit();
                }

                // Preparar la consulta SQL para actualizar la imagen
                $sql = "UPDATE User SET profile_pic = ? WHERE email = ?";
                $stmt = $conn->prepare($sql);

                if ($stmt) {
                    $stmt->bind_param('ss', $imgBase64, $email);

                    if ($stmt->execute()) {
                        echo json_encode(['message' => 'Foto de perfil actualizada correctamente.']);
                    } else {
                        echo json_encode(['error' => 'Error al ejecutar la consulta SQL: ' . $stmt->error]);
                    }

                    $stmt->close();
                } else {
                    echo json_encode(['error' => 'Error al preparar la consulta SQL: ' . $conn->error]);
                }
            } else {
                echo json_encode(['error' => 'Error al leer el contenido de la imagen.']);
            }
        } else {
            echo json_encode(['error' => 'El archivo temporal no existe.']);
        }
    } else {
        echo json_encode(['error' => 'No se subió ninguna imagen o hubo un error en la subida. Código de error: ' . $_FILES['profile_pic']['error']]);
    }
}

$conn->close();
?>
