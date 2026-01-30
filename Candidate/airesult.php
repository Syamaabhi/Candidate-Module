<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "studentt");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

$user_id   = intval($data['user_id'] ?? 0);
$decision  = $data['decision'] ?? null;
$ai_score  = intval($data['ai_score'] ?? 0);

if ($user_id === 0 || !$decision) {
    http_response_code(400);
    echo json_encode(["error" => "Missing data"]);
    exit;
}

$sql = "
UPDATE job_applications
SET ai_result = ?, ai_score = ?
WHERE user_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sii", $decision, $ai_score, $user_id);
$stmt->execute();

if ($stmt->affected_rows === 0) {
    echo json_encode(["warning" => "No rows updated"]);
    exit;
}

echo json_encode([
    "success" => true,
    "user_id" => $user_id
]);
