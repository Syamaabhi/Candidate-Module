<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "studentt");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed"]);
    exit;
}

// Read JSON POST
$data = json_decode(file_get_contents("php://input"), true);

$name = $data['title'] ?? '';
$email = $data['description'] ?? '';
$skills = $data['skills'] ?? '';
$role = $data['experience_level'] ?? '';
$github = $data['min_ai_score'] ?? '';
$linkedin = $data['recruiter_id'] ?? '';

$skillsString = implode(',', $skills); // "React,JavaScript"

// Validate required fields
// if (!$name || !$email || !$password) {
//     http_response_code(400);
//     echo json_encode(["message" => "Name, email, and password are required"]);
//     exit;
// }

// Hash password
//$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Prepare and execute
$stmt = $conn->prepare("INSERT INTO job (title, description, skills, experience_level, min_ai_score, recruiter_id) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssii", $name, $email, $skillsString, $role, $github, $linkedin);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "user_id" => $stmt->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Registration failed"]);
}
