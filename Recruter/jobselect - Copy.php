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

$jobId = $_GET['jobIndex'] ?? null;

if ($jobId === null) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "jobId is required"]);
    exit;
}

// Ensure jobId is an integer
$jobId = (int)$jobId;

// Prepare the query safely
$stmt = $conn->prepare("
    SELECT id, applicant_name, applicant_email, applicant_phone, cover_letter, applied_at
    FROM job_applications
    WHERE job_id = ?
    ORDER BY applied_at DESC
");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $jobId);
$stmt->execute();
$result = $stmt->get_result();

$applications = [];

while ($row = $result->fetch_assoc()) {
    $applications[] = [
        "objectId" => $row["id"],
        "objectData" => [
            "applicant_name" => $row["applicant_name"],
            "applicant_email" => $row["applicant_email"],
            "applicant_phone" => $row["applicant_phone"],
            "cover_letter" => $row["cover_letter"],
            "applied_at" => date("c", strtotime($row["applied_at"]))
        ]
    ];
}

echo json_encode($applications);
$conn->close();
?>
