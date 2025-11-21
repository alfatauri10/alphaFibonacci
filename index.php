<!DOCTYPE html>
<html lang="it">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>αFibonacci</title>
        <link rel="icon" type="image-png" href="/src/resources/img/iconaTitle.png">
        <link rel="stylesheet" href="src/css/header.css">
        <link rel="stylesheet" href="src/css/footer.css">
        <link rel="stylesheet" href="src/css/index.css">
    </head>

    <body>

        <?php include(__DIR__ . "/src/pages/header.html"); ?>

        <!-- ===== SEZIONE VITA ===== -->
        <?php include(__DIR__ . "/src/pages/vita.html"); ?>

        <!-- ===== SEZIONE MATEMATICA ===== -->
        <?php include(__DIR__ . "/src/pages/matematica.html"); ?>

        <!-- ===== Sezione MINI-GIOCHI!!! ===== -->
        <?php include(__DIR__ . "/src/pages/giochi.html"); ?>

        <?php include(__DIR__ . "/src/pages/footer.html"); ?>


        <script src="src/js/giocoIndovina.js"></script>
        <script src="src/js/sequenzaFib.js"></script>
        <script src="src/js/showHideGiochi.js"></script>


        <p style="text-align:center; margin:30px 0;">
            <a href="https://youtu.be/dc2Trot4H20?si=Cd7dXm6KmEgXfLrM"
               target="_blank"
               style="font-size:1.2rem; text-decoration:none; color:#59152E; font-weight:600;">
                🎬 Guarda il video su YouTube
            </a>
        </p>

    </body>
</html>
