document.getElementById("inizia-gioco").addEventListener("click", () => {

    const nome1 = document.getElementById("giocatore1").value.trim();
    const nome2 = document.getElementById("giocatore2").value.trim();
    const area = document.getElementById("area-gioco");

    if (!nome1 || !nome2) {
        alert("Inserisci entrambi i nomi!");
        return;
    }

    // RESET AREA
    area.innerHTML = "";

    // Stato del gioco
    let sequenza = [1, 1];
    let turno = 1;
    let gameOver = false;

    // === TIMER PER TURNO ===
    let timerInterval = null;
    let deadline = null; // timestamp di scadenza del turno

    // Elemento grafico del timer in alto a destra
    const timerDiv = document.createElement("div");
    timerDiv.id = "timer-turno";
    timerDiv.style.position = "absolute";
    timerDiv.style.top = "10px";
    timerDiv.style.right = "15px";
    timerDiv.style.fontSize = "20px";
    timerDiv.style.fontWeight = "bold";
    timerDiv.style.color = "#AC4D6E";
    timerDiv.textContent = "⏱ 30s";
    area.appendChild(timerDiv);

    function aggiornaTimer() {
        if (gameOver || !deadline) return;

        const msLeft = deadline - Date.now();

        if (msLeft <= 0) {
            clearInterval(timerInterval);
            timerDiv.textContent = "⏱ 0s";

            if (gameOver) return;

            // Tempo scaduto: perde il giocatore di turno
            gameOver = true;

            const nomePerde = turno === 1 ? nome1 : nome2;
            const nomeVince = turno === 1 ? nome2 : nome1;
            const next = sequenza[sequenza.length - 1] + sequenza[sequenza.length - 2];

            area.innerHTML = `
                <h2 style="text-align:center;color:#5C1830;">⏳ Tempo scaduto!</h2>
                <p style="text-align:center;">${nomePerde} non ha risposto entro 30 secondi.</p>
                <p style="text-align:center;">Il numero corretto era <strong>${next}</strong>.</p>
                <h3 style="text-align:center;color:#406241;">Vince ${nomeVince}! 🎉</h3>
                <button id="rigioca" style="
                    margin:20px auto;display:block;
                    padding:10px 18px;border:none;
                    color:white;background:#AC4D6E;
                    border-radius:8px;cursor:pointer;">Rigioca</button>
            `;

            document.getElementById("rigioca").onclick = () => location.reload();
            return;
        }

        const secondsLeft = Math.ceil(msLeft / 1000);
        timerDiv.textContent = `⏱ ${secondsLeft}s`;
    }

    function startTimer() {
        clearInterval(timerInterval);
        // 30 secondi da ORA
        deadline = Date.now() + 30000;
        aggiornaTimer();
        timerInterval = setInterval(aggiornaTimer, 250);
    }

    // Titolo centrato
    const titolo = document.createElement("h3");
    titolo.style.color = "#5C1830";
    titolo.style.textAlign = "center";
    titolo.style.marginBottom = "10px";
    titolo.textContent = `${nome1} VS ${nome2}`;
    area.appendChild(titolo);

    // Messaggio
    const msg = document.createElement("p");
    msg.style.color = "#406241";
    msg.textContent = `${nome1} inizia! Inserisci il prossimo numero:`;
    area.appendChild(msg);

    // Doppio input
    const container = document.createElement("div");
    container.className = "doppio-input-container";

    // --- CREAZIONE BOX GIOCATORE ---
    function creaInputBox(nome, id) {
        const box = document.createElement("div");
        box.className = "box-giocatore";
        box.id = id;

        const label = document.createElement("h4");
        label.textContent = nome;
        label.style.color = "#5C1830";
        box.appendChild(label);

        const input = document.createElement("input");
        input.type = "number";
        input.placeholder = "Prossimo numero...";
        input.className = "input-numero";
        box.appendChild(input);

        const btn = document.createElement("button");
        btn.textContent = "Conferma";
        btn.className = "btn-conferma";
        box.appendChild(btn);

        return box;
    }

    const box1 = creaInputBox(nome1, "box1");
    const box2 = creaInputBox(nome2, "box2");

    container.appendChild(box1);
    container.appendChild(box2);
    area.appendChild(container);

    // Contenitore sequenza
    const sequenzaDiv = document.createElement("div");
    sequenzaDiv.className = "fib-container";
    sequenzaDiv.id = "fib-container";
    area.appendChild(sequenzaDiv);

    // Funzione smooth per mostrare la sequenza
    function mostraSequenza() {
        const div = document.getElementById("fib-container");
        div.innerHTML = '';

        sequenza.forEach((num, index) => {
            const span = document.createElement("span");
            span.textContent = num;
            span.classList.add("fib-num");
            div.appendChild(span);

            setTimeout(() => {
                span.classList.add("show");
            }, index * 300);
        });
    }

    mostraSequenza();

    // All'inizio attivo box1 e avvio timer del primo turno
    attivaTurno(1);
    startTimer();

    // Funzione turnazione (come prima, con focus)
    function attivaTurno(n) {
        if (n === 1) {
            box1.classList.add("turno-attivo");
            box2.classList.remove("turno-attivo");
            box1.querySelector("input").disabled = false;
            box1.querySelector("button").disabled = false;
            box2.querySelector("input").disabled = true;
            box2.querySelector("button").disabled = true;

            box1.querySelector("input").focus();

        } else {
            box2.classList.add("turno-attivo");
            box1.classList.remove("turno-attivo");
            box2.querySelector("input").disabled = false;
            box2.querySelector("button").disabled = false;
            box1.querySelector("input").disabled = true;
            box1.querySelector("button").disabled = true;

            box2.querySelector("input").focus();
        }
    }

    // Logica dei controlli (identica, con aggiunta gestione timer)
    function controlla(box, nome) {

        if (gameOver) return;

        const input = box.querySelector("input");
        const numero = parseInt(input.value);

        if (isNaN(numero)) {
            msg.textContent = "Inserisci un numero valido!";
            msg.style.color = "red";
            return;
        }

        const next = sequenza[sequenza.length - 1] + sequenza[sequenza.length - 2];

        if (numero === next) {
            sequenza.push(numero);
            mostraSequenza();

            // Cambio turno
            turno = turno === 1 ? 2 : 1;
            msg.style.color = "#406241";

            const prossimoNome = turno === 1 ? nome1 : nome2;
            msg.textContent = `${prossimoNome}, tocca a te!`;

            attivaTurno(turno);
            startTimer(); // 🔁 ad ogni risposta corretta il timer riparte da 30s

        } else {
            gameOver = true;
            clearInterval(timerInterval);

            area.innerHTML = `
            <h2 style="text-align:center;color:#5C1830;">❌ ${nome} ha sbagliato!</h2>
            <p style="text-align:center;">Il numero corretto era <strong>${next}</strong></p>
            <h3 style="text-align:center;color:#406241;">Vince ${
                nome === nome1 ? nome2 : nome1
            } 🎉</h3>
            <button id="rigioca" style="
                margin:20px auto;display:block;
                padding:10px 18px;border:none;
                color:white;background:#AC4D6E;
                border-radius:8px;cursor:pointer;">Rigioca</button>
            `;

            document.getElementById("rigioca").onclick = () => location.reload();
        }

        input.value = "";
        input.focus();
    }

    // Eventi dei due bottoni (come prima)
    const input1 = box1.querySelector("input");
    const input2 = box2.querySelector("input");
    const btn1 = box1.querySelector("button");
    const btn2 = box2.querySelector("button");

    btn1.addEventListener("click", () => controlla(box1, nome1));
    btn2.addEventListener("click", () => controlla(box2, nome2));

    // ENTER = click sul proprio bottone (senza logiche extra)
    input1.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            btn1.click();
        }
    });

    input2.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            btn2.click();
        }
    });

});
