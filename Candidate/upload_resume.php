<?php

error_reporting(E_ERROR | E_PARSE); // Only fatal errors, no warnings/notices
ini_set('display_errors', 0);       // Do not output errors to browser
header("Content-Type: application/json");


require 'vendor/autoload.php';
use PhpOffice\PhpWord\IOFactory;
use Smalot\PdfParser\Parser;

// DB
$conn = new mysqli("localhost", "root", "", "studentt");
if ($conn->connect_error) {
    echo json_encode(["error" => "DB Connection Failed"]);
    exit;
}

// File & candidate_id check
if (!isset($_FILES['resume'])) {
    echo json_encode(["error" => "No file uploaded"]);
    exit;
}

$file = $_FILES['resume'];
$candidate_id = $_POST['candidate_id'] ?? null;

if (!$candidate_id) {
    echo json_encode(["error" => "Candidate ID missing"]);
    exit;
}

if ($file['error'] !== 0) {
    echo json_encode(["error" => "File upload error", "code" => $file['error']]);
    exit;
}

// Save file
$uploadDir = __DIR__ . "/uploads/";
if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

$destPath = $uploadDir . basename($file['name']);
if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    echo json_encode(["error" => "Failed to move uploaded file"]);
    exit;
}

// Extract text
$text = '';
$ext = strtolower(pathinfo($destPath, PATHINFO_EXTENSION));

try {
    if ($ext === 'pdf') {
        $parser = new Parser();
        $pdf = $parser->parseFile($destPath);
        $text = $pdf->getText();
    } elseif ($ext === 'docx' || $ext === 'doc') {
        $phpWord = IOFactory::load($destPath);
        foreach ($phpWord->getSections() as $section) {
            foreach ($section->getElements() as $el) {
                if (method_exists($el, 'getText')) {
                    $text .= ' ' . $el->getText();
                }
            }
        }
    } else {
        echo json_encode(["error" => "Unsupported file type"]);
        exit;
    }
} catch (Exception $e) {
    echo json_encode(["error" => "Failed to read file", "message" => $e->getMessage()]);
    exit;
}

// Skill dictionary
$skillsList = [
    "PHP" => "Backend",
    "Python" => "Backend",
    "React" => "Frontend",
    "JavaScript" => "Frontend",
    "SQL" => "Database",
    "Docker" => "DevOps",
    ".NET" => "Backend",
    "WordPress" => "CMS"
];

$foundSkills = [];
foreach ($skillsList as $skill => $category) {
    if (stripos($text, $skill) !== false) {
        $confidence = rand(70, 95) / 100;
        $foundSkills[] = [
            "name" => $skill,
            "category" => $category,
            "confidence" => $confidence
        ];

        // Save to DB
        $stmt = $conn->prepare(
            "INSERT INTO resume_skills (candidate_id, skill_name, category, confidence)
             VALUES (?, ?, ?, ?)"
        );
        $stmt->bind_param("issd", $candidate_id, $skill, $category, $confidence);
        $stmt->execute();
    }
}
echo json_encode([
    "success" => true,
    "skills" => $foundSkills,
    "filename" => basename($file['name']),
    "candidate_id" => $candidate_id
]);


?>