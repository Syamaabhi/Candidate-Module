<?php
$host = "localhost";      // usually localhost
$user = "root";           // your DB username
$password = "";           // your DB password
$database = "jobportal"; // your DB name

// Create connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Optional: set charset
$conn->set_charset("utf8");
?>
