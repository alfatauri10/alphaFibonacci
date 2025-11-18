document.getElementById("inizia-gioco").onclick = () => { // avvia il gioco al click

    const nome1 = document.getElementById("giocatore1").value.trim(); // nome giocatore 1
    const nome2 = document.getElementById("giocatore2").value.trim(); // nome giocatore 2
    const area = document.getElementById("area-gioco"); // contenitore del gioco

    if (!nome1 || !nome2) { // se manca un nome
        alert("Inserisci entrambi i nomi!");
        return;
    }

    // PULISCO AREA DI GIOCO
    area.innerHTML = "";

    // ===== STATO DI GIOCO =====
    let sequenza = [1, 1];                // sequenza iniziale di Fibonacci
    let turno = 1;                        // 1 = nome1, 2 = nome2
    let nextAtteso = 2;                   // primo numero atteso (1+1)
    let gameOver = false;                 // flag fine partita

    // ===== TIMER UNICO =====
    let tempoRimanente = 30;              // secondi per turno
    let intervalId = null;                // id dell'unico setInterval

    // TIMER GRAFICO
    const timerDiv = document.createElement("div"); // contenitore timer
    timerDiv.id = "timer-turno";
    timerDiv.style.position = "absolute";
    timerDiv.style.top = "10px";
    timerDiv.style.right = "15px";
    timerDiv.style.fontSize = "20px";
    timerDiv.style.fontWeight = "bold";
    timerDiv.style.color = "#AC4D6E";
    area.appendChild(timerDiv);

    function aggiornaTimerUI() { // aggiorna testo timer
        timerDiv.textContent = `⏱ ${tempoRimanente}s`;
    }

    function stopTimer() { // ferma il timer se esiste
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function avviaTimerNuovoTurno() { // reset + avvio timer per il turno corrente
        stopTimer();                  // mi assicuro che non ci siano timer vecchi
        tempoRimanente = 30;          // riparto da 30
        aggiornaTimerUI();            // aggiorno la UI

        intervalId = setInterval(() => {   // unico setInterval della partita
            if (gameOver) {                // se il gioco è finito
                stopTimer();               // ferma tutto
                return;
            }

            tempoRimanente--;              // scala un secondo
            aggiornaTimerUI();             // aggiorna grafica

            if (tempoRimanente <= 0) {     // tempo scaduto
                stopTimer();               // blocca il timer
                const nomePerde = turno === 1 ? nome1 : nome2; // chi doveva giocare
                finePartitaTempo(nomePerde);                    // fine partita per tempo
            }
        }, 1000);
    }

    // ===== SCHERMATE DI FINE PARTITA =====
    function finePartitaTempo(nomePerde) { // perdita per tempo
        if (gameOver) return;
        gameOver = true;
        stopTimer();

        const nomeVince = nomePerde === nome1 ? nome2 : nome1;

        area.innerHTML = `
            <h2 style="text-align:center;color:#5C1830;">⏳ Tempo scaduto!</h2>
            <p style="text-align:center;">${nomePerde} non ha risposto entro il tempo.</p>
            <p style="text-align:center;">Il numero corretto era <strong>${nextAtteso}</strong>.</p>
            <h3 style="text-align:center;color:#406241;">Vince ${nomeVince}! 🎉</h3>
            <button id="rigioca" style="
                margin:20px auto;display:block;
                padding:10px 18px;border:none;
                color:white;background:#AC4D6E;
                border-radius:8px;cursor:pointer;">
                Rigioca
            </button>
        `;

        document.getElementById("rigioca").onclick = () => {
            document.getElementById("indovinaSequenza").style.display = "block"; // torna alla schermata iniziale
            document.getElementById("area-gioco").innerHTML = "";               // svuota area
        };
    }

    function finePartitaErrore(nomePerde) { // perdita per numero sbagliato
        if (gameOver) return;
        gameOver = true;
        stopTimer();

        const nomeVince = nomePerde === nome1 ? nome2 : nome1;

        area.innerHTML = `
            <h2 style="text-align:center;color:#5C1830;">❌ ${nomePerde} ha sbagliato!</h2>
            <p style="text-align:center;">Il numero corretto era <strong>${nextAtteso}</strong>.</p>
            <h3 style="text-align:center;color:#406241;">Vince ${nomeVince}! 🎉</h3>
            <button id="rigioca" style="
                margin:20px auto;display:block;
                padding:10px 18px;border:none;
                color:white;background:#AC4D6E;
                border-radius:8px;cursor:pointer;">
                Rigioca
            </button>
        `;

        document.getElementById("rigioca").onclick = () => {
            document.getElementById("indovinaSequenza").style.display = "block";
            document.getElementById("area-gioco").innerHTML = "";
        };
    }

    // ===== UI GIOCO =====
    const titolo = document.createElement("h3");
    titolo.style.color = "#5C1830";
    titolo.style.textAlign = "center";
    titolo.style.marginBottom = "10px";
    titolo.textContent = `${nome1} VS ${nome2}`;
    area.appendChild(titolo);

    const msg = document.createElement("p");
    msg.style.color = "#406241";
    msg.textContent = `${nome1} inizia! Inserisci il prossimo numero:`;
    area.appendChild(msg);

    const container = document.createElement("div");
    container.className = "doppio-input-container";

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

    const sequenzaDiv = document.createElement("div");
    sequenzaDiv.className = "fib-container";
    sequenzaDiv.id = "fib-container";
    area.appendChild(sequenzaDiv);

    function mostraSequenza() { // stampa la sequenza con effetto smooth
        const div = document.getElementById("fib-container");
        div.innerHTML = "";

        sequenza.forEach((num, i) => {
            const span = document.createElement("span");
            span.textContent = num;
            span.classList.add("fib-num");
            div.appendChild(span);

            setTimeout(() => span.classList.add("show"), i * 250);
        });
    }

    mostraSequenza();

    // ===== GESTIONE TURNI =====
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

    function controlla(box, nome) {
        if (gameOver) return;

        const input = box.querySelector("input");
        const numero = parseInt(input.value);

        if (isNaN(numero)) {
            msg.textContent = "Inserisci un numero valido!";
            msg.style.color = "red";
            return;
        }

        if (numero === nextAtteso) { // risposta corretta
            sequenza.push(numero);   // aggiorna sequenza
            mostraSequenza();        // aggiorna UI

            // calcola il nuovo numero atteso
            nextAtteso = sequenza[sequenza.length - 1] + sequenza[sequenza.length - 2];

            // passa il turno
            turno = turno === 1 ? 2 : 1;
            const prossimo = turno === 1 ? nome1 : nome2;

            msg.style.color = "#406241";
            msg.textContent = `${prossimo}, tocca a te!`;

            attivaTurno(turno);       // attiva l'altro box
            avviaTimerNuovoTurno();   // resetta il timer a 30s per il nuovo turno
        } else {
            finePartitaErrore(nome);  // risposta sbagliata → fine
        }

        input.value = "";
        input.focus();
    }

    const input1 = box1.querySelector("input");
    const input2 = box2.querySelector("input");
    const btn1 = box1.querySelector("button");
    const btn2 = box2.querySelector("button");

    btn1.addEventListener("click", () => controlla(box1, nome1));
    btn2.addEventListener("click", () => controlla(box2, nome2));

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

    // AVVIO PRIMO TURNO
    attivaTurno(1);
    avviaTimerNuovoTurno();
};
