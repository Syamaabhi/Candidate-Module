<?php
// Include the DB connection

$host = "localhost";      // usually localhost
$user = "root";           // your DB username
$password = "";           // your DB password
$database = "studentt"; // your DB name

// Create connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Optional: set charset
$conn->set_charset("utf8");



// SQL query to get all jobs
$sql = "SELECT * FROM job_applications"; // replace 'jobs' with your table name
$result = $conn->query($sql);

$jobs = [];

if ($result->num_rows > 0) {
    // Fetch all rows as associative array
    while($row = $result->fetch_assoc()) {
        $jobs[] = $row;
    }
}

// Return data as JSON (for Trickle.so frontend)
header('Content-Type: application/json');
echo json_encode($jobs);

$conn->close();
?>
