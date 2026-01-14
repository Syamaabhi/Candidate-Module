<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Job Portal - Smart Hiring Platform</title>
    <meta name="description" content="AI-driven job portal connecting talent with opportunities through smart matching and automated interviews.">
    <script src="https://resource.trickle.so/vendor_lib/unpkg/react@18/umd/react.production.min.js"></script>
    <script src="https://resource.trickle.so/vendor_lib/unpkg/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://resource.trickle.so/vendor_lib/unpkg/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://resource.trickle.so/vendor_lib/unpkg/lucide-static@0.516.0/font/lucide.css" rel="stylesheet">
    
    <style type="text/tailwindcss">
    @layer theme {
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #64748b;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --background: #f8fafc;
            --surface: #ffffff;
        }
    }
    
    body {
        background-color: var(--background);
        font-family: 'Inter', sans-serif;
    }
    </style>
</head>
<body>
    <div id="root"></div>
    
    <!-- Utilities -->
    <script type="text/babel" src="utils/api.js"></script>
    <script type="text/babel" src="utils/auth.js"></script>
    
    <!-- Components -->
    <script type="text/babel" src="components/Layout.js"></script>
    <script type="text/babel" src="components/Alert.js"></script>
    <script type="text/babel" src="components/Button.js"></script>
    <script type="text/babel" src="components/Input.js"></script>
    <script type="text/babel" src="components/JobCard.js"></script>
    <script type="text/babel" src="components/InterviewSession.js"></script>
    
    <!-- Pages -->
    <script type="text/babel" src="pages/Home.js"></script>
    <script type="text/babel" src="pages/Login.js"></script>
    <script type="text/babel" src="pages/Register.js"></script>
    <script type="text/babel" src="pages/Dashboard.js"></script>
    <script type="text/babel" src="pages/JobBoard.js"></script>
    <script type="text/babel" src="pages/Profile.js"></script>
    <script type="text/babel" src="pages/RecruiterDashboard.js"></script>

    <!-- Main Entry -->
    <script type="text/babel" src="app.js"></script>
</body>
</html>