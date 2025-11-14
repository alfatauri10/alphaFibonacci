document.addEventListener("DOMContentLoaded", () => {

    const giocoIndovina = document.getElementById("indovinaSequenza");
    const giocoRettangolo = document.getElementById("gioco-rettangolo");

    const btnIndovina = document.getElementById("start-game-indovina");
    const btnRettangolo = document.getElementById("start-game-rettangolo");

    function nascondiTutti() {
        if (giocoIndovina) giocoIndovina.style.display = "none";
        if (giocoRettangolo) giocoRettangolo.style.display = "none";
    }

    // --- Mostra GIOCO INDOVINA ---
    if (btnIndovina) {
        btnIndovina.addEventListener("click", () => {
            nascondiTutti();
            giocoIndovina.style.display = "block";
            window.scrollTo({ top: giocoIndovina.offsetTop - 80, behavior: "smooth" });
        });
    }

    // --- Mostra GIOCO RETTANGOLO ---
    if (btnRettangolo) {
        btnRettangolo.addEventListener("click", () => {
            nascondiTutti();
            giocoRettangolo.style.display = "block";
            window.scrollTo({ top: giocoRettangolo.offsetTop - 80, behavior: "smooth" });
        });
    }

});
