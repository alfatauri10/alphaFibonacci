document.getElementById("inizia-gioco").addEventListener("click", function () {
    const nome1 = document.getElementById("giocatore1").value.trim();
    const nome2 = document.getElementById("giocatore2").value.trim();
    const areaGioco = document.getElementById("area-gioco");

    if (!nome1 || !nome2) {
        alert("Inserisci entrambi i nomi dei giocatori per iniziare!");
        return;
    }

    areaGioco.innerHTML = "";

    // Variabili di stato
    let turno = 1;
    let sequenza = [1, 1];
    let punteggio1 = 0;
    let punteggio2 = 0;
    let giocoFinito = false;

    // --- Titolo ---
    const titolo = document.createElement("h3");
    titolo.textContent = `Benvenuti ${nome1} e ${nome2}!`;
    titolo.style.color = "#5C1830";
    titolo.style.textAlign = "center";
    areaGioco.appendChild(titolo);

    // --- Punteggi ---
    const punteggiDiv = document.createElement("div");
    punteggiDiv.style.display = "flex";
    punteggiDiv.style.justifyContent = "flex-end";
    punteggiDiv.style.gap = "20px";
    punteggiDiv.style.marginBottom = "10px";

    const punti1 = document.createElement("span");
    const punti2 = document.createElement("span");
    punti1.textContent = `${nome1}: 0`;
    punti2.textContent = `${nome2}: 0`;
    punteggiDiv.appendChild(punti1);
    punteggiDiv.appendChild(punti2);
    areaGioco.appendChild(punteggiDiv);

    // --- Messaggio e input ---
    const paragrafo = document.createElement("p");
    paragrafo.textContent = `${nome1} inizia! Inserisci il numero successivo nella sequenza di Fibonacci:`;
    paragrafo.style.marginBottom = "20px"; // più spazio sotto il messaggio
    areaGioco.appendChild(paragrafo);

    // Contenitore input + bottone per allineamento
    const inputDiv = document.createElement("div");
    inputDiv.style.display = "flex";
    inputDiv.style.alignItems = "center";
    inputDiv.style.gap = "10px"; // distanza tra input e bottone
    areaGioco.appendChild(inputDiv);

    const inputNumero = document.createElement("input");
    inputNumero.type = "number";
    inputNumero.id = "numeroInserito";
    inputNumero.placeholder = "Prossimo numero...";
    inputNumero.style.height = "40px"; // allinea con il bottone
    inputNumero.style.fontSize = "16px";
    inputNumero.style.padding = "0 10px";
    inputDiv.appendChild(inputNumero);

    const bottoneInvia = document.createElement("button");
    bottoneInvia.textContent = "Conferma";
    bottoneInvia.style.backgroundColor = "#AC4D6E";
    bottoneInvia.style.color = "white";
    bottoneInvia.style.border = "none";
    bottoneInvia.style.padding = "8px 16px";
    bottoneInvia.style.borderRadius = "8px";
    bottoneInvia.style.cursor = "pointer";
    inputDiv.appendChild(bottoneInvia);

    const messaggio = document.createElement("div");
    messaggio.id = "messaggio";
    messaggio.style.marginTop = "10px";
    areaGioco.appendChild(messaggio);

    const sequenzaMostrata = document.createElement("p");
    sequenzaMostrata.id = "sequenza";
    areaGioco.appendChild(sequenzaMostrata);

    // --- Funzione per mostrare la sequenza con effetto smooth ---
    function mostraSequenza() {
        sequenzaMostrata.innerHTML = 'Sequenza attuale: ';
        const container = document.createElement('span');
        container.id = 'fib-container';
        sequenzaMostrata.appendChild(container);

        sequenza.forEach((num, index) => {
            const span = document.createElement('span');
            span.textContent = num;
            span.classList.add('fib-num');
            container.appendChild(span);

            setTimeout(() => {
                span.classList.add('show');
            }, index * 300);
        });
    }

    mostraSequenza();

    // --- Logica del gioco ---
    bottoneInvia.addEventListener("click", function () {
        if (giocoFinito) return;

        const numeroInserito = parseInt(inputNumero.value);
        if (isNaN(numeroInserito)) {
            messaggio.textContent = "Inserisci un numero valido!";
            messaggio.style.color = "red";
            return;
        }

        const prossimo = sequenza[sequenza.length - 1] + sequenza[sequenza.length - 2];
        const giocatore = turno === 1 ? nome1 : nome2;

        if (numeroInserito === prossimo) {
            sequenza.push(numeroInserito);
            mostraSequenza();
            messaggio.textContent = "✅ Corretto!";
            messaggio.style.color = "green";

            // Aggiorna punteggio
            if (turno === 1) {
                punteggio1++;
                punti1.textContent = `${nome1}: ${punteggio1}`;
            } else {
                punteggio2++;
                punti2.textContent = `${nome2}: ${punteggio2}`;
            }

            // Cambia turno
            turno = turno === 1 ? 2 : 1;
            const prossimoGiocatore = turno === 1 ? nome1 : nome2;
            paragrafo.textContent = `${prossimoGiocatore}, tocca a te! Inserisci il prossimo numero:`;

        } else {
            giocoFinito = true;

            // --- Schermata fine partita ---
            areaGioco.innerHTML = `
                <h2 style="color:#5C1830; text-align:center;">🏁 Fine partita!</h2>
                <p style="text-align:center;">❌ ${giocatore} ha sbagliato! Il numero corretto era <strong>${prossimo}</strong>.</p>
                <p style="text-align:center;"><strong>${nome1}</strong>: ${punteggio1} punti<br><strong>${nome2}</strong>: ${punteggio2} punti</p>
            `;

            // Determina vincitore
            const vincitore = turno === 1 ? nome2 : nome1;
            const risultato = document.createElement("h3");
            risultato.textContent = `🎉 Vince ${vincitore}!`;
            risultato.style.color = "#406241";
            risultato.style.textAlign = "center";
            areaGioco.appendChild(risultato);

            // Bottone rigioca
            const bottoneRigioca = document.createElement("button");
            bottoneRigioca.textContent = "Rigioca";
            bottoneRigioca.style.marginTop = "20px";
            bottoneRigioca.style.display = "block";
            bottoneRigioca.style.marginLeft = "auto";
            bottoneRigioca.style.marginRight = "auto";
            bottoneRigioca.style.backgroundColor = "#AC4D6E";
            bottoneRigioca.style.color = "white";
            bottoneRigioca.style.border = "none";
            bottoneRigioca.style.padding = "8px 16px";
            bottoneRigioca.style.borderRadius = "8px";
            bottoneRigioca.style.cursor = "pointer";
            bottoneRigioca.addEventListener("click", () => location.reload());
            areaGioco.appendChild(bottoneRigioca);
        }

        inputNumero.value = "";
        inputNumero.focus();
    });
});
