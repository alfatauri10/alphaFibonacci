
document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-game-rettangolo");
    if (startButton) {
        startButton.addEventListener("click", () => {
            const game = document.getElementById("gioco-rettangolo");
            if (game) {
                game.style.display = "block";
                window.scrollTo({ top: game.offsetTop - 80, behavior: "smooth" });
            }
        });
    }
});
