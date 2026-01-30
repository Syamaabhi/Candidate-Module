<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "studentt");
if ($conn->connect_error) {
  echo json_encode(["success" => false]);
  exit;
}

$candidate_id = $_GET['candidate_id'];

$stmt = $conn->prepare("
  SELECT id, candidate_id, type, status, scheduled_time, meeting_link, is_read, created_at
  FROM interview_booking
  WHERE candidate_id = ?
  ORDER BY created_at DESC
");

$stmt->bind_param("i", $candidate_id);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode(["success" => true, "data" => $data]);
