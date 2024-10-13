<?php
// Habilitar la visualización de errores para depuración
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Cargar la biblioteca de SendGrid usando Composer
require 'vendor/autoload.php';  // Asegúrate de que la ruta sea correcta

// Usar la biblioteca de SendGrid
use SendGrid\Mail\Mail;

try {
    // Crear una nueva instancia del correo
    $email = new Mail();
    $email->setFrom("humberto107_@hotmail.com", "Jose");  // Cambiado a tu correo verificado
    $email->setSubject("Probando SendGrid con PHP");
    $email->addTo("humbertovenavente7@gmail.com", "Humberto Venavente");  // Destinatario
    $email->addContent("text/plain", "Este es un correo de prueba usando SendGrid y PHP.");
    $email->addContent("text/html", "<strong>Este es un correo de prueba usando SendGrid y PHP.</strong>");

    // Tu clave API de SendGrid
    $sendgrid = new \SendGrid('');  // Tu clave API de SendGrid

    // Intentar enviar el correo
    $response = $sendgrid->send($email);
    
    // Mostrar detalles de la respuesta
    echo 'Estado: ' . $response->statusCode() . "\n";
    echo 'Cuerpo: ' . $response->body() . "\n";
    echo 'Cabeceras: ' . print_r($response->headers(), true) . "\n";

} catch (Exception $e) {
    echo 'Excepción capturada: ',  $e->getMessage(), "\n";
}

