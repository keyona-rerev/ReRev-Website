<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  exit("Method not allowed");
}

$name = trim($_POST["name"] ?? "");
$email = filter_var($_POST["email"] ?? "", FILTER_VALIDATE_EMAIL);
$interest = trim($_POST["interest"] ?? "");
$message = trim($_POST["message"] ?? "");

if (!$name || !$email || !$interest) {
  http_response_code(400);
  exit("Missing required fields");
}

$to = "keyona@rerev.io";
$subject = "New Consult Request from ReRev Labs";

$body  = "New contact form submission:\n\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Interest: $interest\n\n";
$body .= "Message:\n$message\n";

$headers  = "From: keyona@rerev.io\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
    // Redirect to thank-you page
    header("Location: /thank-you.html");
    exit;
} else {
    http_response_code(500);
    echo "Message failed to send.";
}
