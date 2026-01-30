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


echo $name = $data['title'] ?? '';
echo $email = $data['company'] ?? '';
$password = $data['location'] ?? '';
$role = $data['type'] ?? '';
$github1 = $data['salary_range'] ?? '';
$github2 = $data['description'] ?? '';
$github3 = $data['posted_at'] ?? '';


// Validate required fields
// if (!$name || !$email || !$password) {
//     http_response_code(400);
//     echo json_encode(["message" => "Name, email, and password are required"]);
//     exit;
// }

// Hash password
//$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Prepare and execute
$stmt = $conn->prepare("INSERT INTO createjob (title, company, location, type, salary_range,description,posted_at) VALUES (?, ?, ?, ?, ?,?,?)");
$stmt->bind_param("ssssssi", $name, $email, $password, $role, $github1,$github2,$github3);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "user_id" => $stmt->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Registration failed"]);
}
