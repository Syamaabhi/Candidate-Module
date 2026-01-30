<?php
// Include the DB connection
include 'db.php';

// SQL query to get all jobs
$sql = "SELECT * FROM job"; // replace 'jobs' with your table name
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
