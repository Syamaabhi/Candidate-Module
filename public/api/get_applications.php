<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// DB connection
$conn = new mysqli("localhost", "root", "", "studentt");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

// Validate candidate_id
if (!isset($_GET['candidate_id'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "candidate_id is required"
    ]);
    exit;
}

$user_id = intval($_GET['candidate_id']);

// Query applications
$sql = "
    SELECT 
        ja.id,
        ja.job_id,
        ja.status,
        ja.ai_score,
        ja.interview_stage,
        ja.applied_at,
        j.title AS job_title,
        j.skills AS job_skills
    FROM job_applications ja
    LEFT JOIN createjob j ON ja.job_id = j.id
    WHERE ja.user_id = ?
    ORDER BY ja.applied_at DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

$applications = [];

while ($row = $result->fetch_assoc()) {
    if (!empty($row['job_skills'])) {
        $row['job_skills'] = explode(',', $row['job_skills']);
    } else {
        $row['job_skills'] = [];
    }


    $applications[] = $row;
}

echo json_encode([
    "success" => true,
    "applications" => $applications
]);

$stmt->close();
$conn->close();
