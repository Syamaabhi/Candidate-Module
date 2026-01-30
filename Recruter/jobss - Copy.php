<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Disable HTML error output
ini_set('display_errors', 0);
error_reporting(E_ALL);

$conn = new mysqli("localhost", "root", "", "studentt");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Prepare query to fetch all applications
$stmt = $conn->prepare("
    SELECT id, title, company, location, type, salary_range,description,posted_at
    FROM createjob
    ORDER BY posted_at DESC
");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

// No parameters to bind
$stmt->execute();
$result = $stmt->get_result();

$applications = [];

while ($row = $result->fetch_assoc()) {
    $applications[] = [
        "objectId" => $row["id"],
        "objectData" => [
            "title" => $row["title"],
            "company" => $row["company"],
            "location" => $row["location"],
            "salary_range" => $row["salary_range"],
            "posted_at" => date("c", strtotime($row["posted_at"]))
        ]
    ];
}

echo json_encode($applications);
$conn->close();
?>
