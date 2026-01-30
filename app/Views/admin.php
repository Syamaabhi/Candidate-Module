<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recruiter Dashboard - AI Recruiter</title>
    <script src="https://resource.trickle.so/vendor_lib/unpkg/react@18/umd/react.production.min.js"></script>
    <script src="https://resource.trickle.so/vendor_lib/unpkg/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://resource.trickle.so/vendor_lib/unpkg/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js"></script>
    <link href="https://resource.trickle.so/vendor_lib/unpkg/lucide-static@0.516.0/font/lucide.css" rel="stylesheet">
    <script>const ChartJS = window.Chart;</script>
    <style type="text/tailwindcss">
    @layer theme {
        :root {
            --primary-color: #2563EB;
            --secondary-color: #F3F4F6;
        }
    }
    </style>
    <script>
  // (function () {
  //   const auth = sessionStorage.getItem("auth_user");

  //   // ❌ No session → block
  //   // if (!auth) {
  //   //   window.location.replace("/login.html");
  //   //   return;
  //   // }

  //   try {
  //     const user = JSON.parse(auth);

  //     // ❌ Wrong role → block
  //   //   if (user.role !== "candidate") {
  //   //     window.location.replace("/unauthorized.html");
  //   //     return;
  //   //   }

  //     // ✅ Authorized
  //     console.log("Authorized recruiter:", user.id);

  //   } catch (e) {
  //     // ❌ Corrupted session
  //     sessionStorage.clear();
  //     window.location.replace("/login.html");
  //   }
  // })();
</script>

<div id="root"></div>
</head>
<body class="bg-gray-50 min-h-screen flex flex-col">
    <div id="root" class="flex-grow"></div>

    <script type="text/babel" src="recruterdashboard/utils/db.js"></script>
    <script type="text/babel" src="recruterdashboard/components/Header.js"></script>
    <script type="text/babel" src="admin-app.js"></script>
</body>
</html>