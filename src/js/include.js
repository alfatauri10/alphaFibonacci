// /src/js/includeLayout.js
document.addEventListener("DOMContentLoaded", () => {
    // Funzione generica per includere un file HTML in un placeholder
    function includeHTML(placeholderId, filePath) {
        const container = document.getElementById(placeholderId);
        if (!container) return; // Se il placeholder non esiste, salta
        fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error(`Errore nel caricamento di ${filePath}`);
                return response.text();
            })
            .then(data => {
                container.innerHTML = data;
            })
            .catch(error => console.error("Errore:", error));
    }

    // Includi header e footer
    includeHTML("header-placeholder", "/src/pages/header.html");
    includeHTML("footer-placeholder", "/src/pages/footer.html");
});
