<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "studentt");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

/* =========================
   1. Resume Validation
   ========================= */
if (!isset($_FILES['resume'])) {
    echo json_encode(["success" => false, "message" => "Resume required"]);
    exit;
}

$resume = $_FILES['resume'];

$allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

if (!in_array($resume['type'], $allowedTypes)) {
    echo json_encode(["success" => false, "message" => "Invalid resume format"]);
    exit;
}

if ($resume['size'] > 2 * 1024 * 1024) {
    echo json_encode(["success" => false, "message" => "Resume too large"]);
    exit;
}

/* =========================
   2. Upload Resume
   ========================= */
$uploadDir = "uploads/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$fileName = time() . "_" . basename($resume["name"]);
$filePath = $uploadDir . $fileName;

if (!move_uploaded_file($resume["tmp_name"], $filePath)) {
    echo json_encode(["success" => false, "message" => "Resume upload failed"]);
    exit;
}

/* =========================
   3. Read Form Data
   ========================= */
   
$name  = $_POST['applicant_name'] ?? '';
$email = $_POST['applicant_email'] ?? '';
$phone = $_POST['applicant_phone'] ?? '';
$cover = $_POST['cover_letter'] ?? '';
$job_id = $_POST['job_id'] ?? null;
$applied_at = date("Y-m-d H:i:s");

if (!$name || !$email || !$phone || !$job_id) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

/* =========================
   4. Insert DB
   ========================= */
$stmt = $conn->prepare(
    "INSERT INTO job_applications 
    (job_id, applicant_name, applicant_email, applicant_phone, cover_letter, applied_at, resume_upload)
    VALUES (?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "issssss",
    $job_id,
    $name,
    $email,
    $phone,
    $cover,
    $applied_at,
    $filePath
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "application_id" => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}
