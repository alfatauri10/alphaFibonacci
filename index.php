<!DOCTYPE html>
<html lang="it">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>αFibonacci</title>
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
        <script src="src/js/showHideGiocoRettangolo.js"></script>


    </body>
</html>
