<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "studentt");
if ($conn->connect_error) {
  echo json_encode(["success" => false]);
  exit;
}

$id = $_POST['id'] ?? null;

if (!$id) {
  echo json_encode(["success" => false]);
  exit;
}

$stmt = $conn->prepare("UPDATE interview_booking SET is_read = 1 WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["success" => true]);
