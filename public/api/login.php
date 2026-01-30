<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "studentt");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed"]);
    exit;
}

// Get JSON POST data
$data = json_decode(file_get_contents("php://input"), true);
// if (!$data || !isset($data['email'], $data['password'])) {
//     http_response_code(400);
//     echo json_encode(["message" => "Email and password required"]);
//     exit;
// }

$email = $data['email'];
$password = $data['password'];

// Prepare statement (select all required columns)
$stmt = $conn->prepare("SELECT id, name, role, github_link, password FROM user WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

// Check if user exists
if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["message" => "Invalid email or password"]);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if ($password !== $user['password']) {
    http_response_code(401);
    echo json_encode(["message" => "Invalid email or password"]);
    exit;
}


// Return user data
echo json_encode([
    "success" => true,
    "user_id" => $user['id'],
    "user_name" => $user['name'],
    "user_role" => $user['role'],
    "user_github_link" => $user['github_link']
]);
