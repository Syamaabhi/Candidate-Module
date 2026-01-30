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

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$role = $data['role'] ?? '';
$github = $data['github_link'] ?? '';
$linkedin = $data['linkedin_link'] ?? '';
$resume = $data['resume_url'] ?? '';

// Validate required fields
if (!$name || !$email || !$password) {
    http_response_code(400);
    echo json_encode(["message" => "Name, email, and password are required"]);
    exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Prepare and execute
$stmt = $conn->prepare("INSERT INTO user (name, email, password, role, github_link, linkedin_link, resume_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $name, $email, $hashedPassword, $role, $github, $linkedin, $resume);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "user_id" => $stmt->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Registration failed"]);
}
