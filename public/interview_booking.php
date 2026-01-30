<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$conn = new mysqli("localhost", "root", "", "studentt");

if ($conn->connect_error) {
  echo json_encode(["success" => false, "message" => "DB connection failed"]);
  exit;
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

$candidate_id   = $data['candidate_id'] ?? null;
$type           = $data['type'] ?? null;
$status         = $data['status'] ?? null;
$scheduled_time = $data['scheduled_time'] ?? null;
$meeting_link   = $data['meeting_link'] ?? null;

if (!$candidate_id || !$scheduled_time) {
  echo json_encode(["success" => false, "message" => "Missing required fields"]);
  exit;
}

$stmt = $conn->prepare(
  "INSERT INTO interview_booking 
   (candidate_id, type, status, scheduled_time, meeting_link)
   VALUES (?, ?, ?, ?, ?)"
);

$stmt->bind_param(
  "sssss",
  $candidate_id,
  $type,
  $status,
  $scheduled_time,
  $meeting_link
);

if ($stmt->execute()) {
  echo json_encode([
    "success" => true,
    "booking_id" => $stmt->insert_id
  ]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Insert failed"
  ]);
}

$stmt->close();
$conn->close();
