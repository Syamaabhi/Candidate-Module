<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "studentt");

if ($conn->connect_error) {
  echo json_encode(["success" => false, "message" => "DB connection failed"]);
  exit;
}

 $candidate_id = $_GET['candidate_id'] ?? null;


if (!$candidate_id) {
  echo json_encode(["success" => false, "message" => "Candidate ID required"]);
  exit;
}

$stmt = $conn->prepare(
  "SELECT id, candidate_id, type, status, scheduled_time, meeting_link
   FROM interview_booking
   WHERE candidate_id = ?
   ORDER BY scheduled_time DESC"
);

$stmt->bind_param("s", $candidate_id);
$stmt->execute();

$result = $stmt->get_result();
$bookings = [];

while ($row = $result->fetch_assoc()) {
  $bookings[] = $row;
}

echo json_encode([
  "success" => true,
  "data" => $bookings
]);

$stmt->close();
$conn->close();
