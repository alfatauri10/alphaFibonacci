/* ============================================
   MINI GIOCO: DISEGNA IL RETTANGOLO AUREO
   ============================================ */

const canvas = document.getElementById("canvas-gioco");
const msg = document.getElementById("msg");

let ordine = 1;          // Q1 → Q2 → Q3 → Q4 → Q5
let orientamento = null; // "antiorario" oppure "orario"
const eps = 40;          // tolleranza per il confronto posizioni

// riferimenti ai quadrati
const Q = {
    1: document.getElementById("q1"),
    2: document.getElementById("q2"),
    3: document.getElementById("q3"),
    4: document.getElementById("q4"),
    5: document.getElementById("q5")
};

// salviamo le posizioni iniziali (da CSS)
const startPos = {};
Object.entries(Q).forEach(([n, el]) => {
    const cs = window.getComputedStyle(el);
    startPos[n] = {
        left: parseFloat(cs.left),
        top:  parseFloat(cs.top)
    };
});

/* ============================================
   FUNZIONI DI SUPPORTO
   ============================================ */

function showMsg(text, type = "") {
    msg.className = type;
    msg.textContent = text;
}

function abilitaQuadrato(n) {
    Object.values(Q).forEach(q => q.classList.add("disabled"));
    Q[n].classList.remove("disabled");
}

function fissaQuadrato(n) {
    Q[n].classList.add("fixed");
}

function resetPosizione(n) {
    const p = startPos[n];
    Q[n].style.left = p.left + "px";
    Q[n].style.top  = p.top  + "px";
}

// vertici relativi al canvas (A,B,C,D)
function getVerticesInCanvas(square) {
    const canvasRect = canvas.getBoundingClientRect();
    const r = square.getBoundingClientRect();

    const xLeft   = r.left   - canvasRect.left;
    const xRight  = r.right  - canvasRect.left;
    const yTop    = r.top    - canvasRect.top;
    const yBottom = r.bottom - canvasRect.top;

    return {
        A: { x: xLeft,  y: yTop },
        B: { x: xRight, y: yTop },
        C: { x: xLeft,  y: yBottom },
        D: { x: xRight, y: yBottom }
    };
}

function approx(p1, p2) {
    return (
        Math.abs(p1.x - p2.x) < eps &&
        Math.abs(p1.y - p2.y) < eps
    );
}

/* ============================================
   CONTROLLI PDF — ANTIORARIO
   ============================================ */

// Q2 in funzione di Q1
// Q2 in funzione di Q1 (posizionato a destra O a sinistra, alla stessa altezza)
function checkQ2(v1, v2) {
    // centri dei quadrati
    const center1 = {
        x: (v1.A.x + v1.B.x) / 2,
        y: (v1.A.y + v1.C.y) / 2
    };
    const center2 = {
        x: (v2.A.x + v2.B.x) / 2,
        y: (v2.A.y + v2.C.y) / 2
    };

    const sameHeight = Math.abs(center1.y - center2.y) < eps;

    // Q2 subito a destra di Q1 → lato sinistro di Q2 vicino al lato destro di Q1
    const touchingRight = Math.abs(v2.A.x - v1.B.x) < eps;

    // Q2 subito a sinistra di Q1 → lato destro di Q2 vicino al lato sinistro di Q1
    const touchingLeft = Math.abs(v2.B.x - v1.A.x) < eps;

    return sameHeight && (touchingRight || touchingLeft);
}

// Q3 antiorario (in base a Q1 e Q2)
// D3==A1+eps && C3==B2+eps
// Q3 antiorario: quadrato 3 (lato 2) appoggiato SOPRA Q1 e Q2,
// coprendo esattamente la loro larghezza complessiva, a prescindere
// da chi è a sinistra (Q1 o Q2).
function checkQ3_antiorario(v1, v2, v3) {
    // bordo superiore comune di Q1 e Q2 (dovrebbero avere lo stesso y)
    const topY = (v1.A.y + v2.A.y) / 2;

    // estremi orizzontali dei due quadrati piccoli
    const leftMin  = Math.min(v1.A.x, v2.A.x); // sinistra del gruppo (Q1 o Q2)
    const rightMax = Math.max(v1.B.x, v2.B.x); // destra del gruppo (Q1 o Q2)

    // bordo inferiore di Q3
    const bottomY = v3.C.y; // C3 e D3 hanno lo stesso y

    // estremi orizzontali di Q3
    const left3  = v3.C.x;  // sinistra di Q3
    const right3 = v3.D.x;  // destra di Q3

    // deve stare SOPRA: il suo bordo inferiore vicino al bordo superiore dei due
    const sameVertical = Math.abs(bottomY - topY) < eps;

    // deve coprire esattamente la larghezza dei due quadrati da 1
    const sameLeft  = Math.abs(left3  - leftMin)  < eps;
    const sameRight = Math.abs(right3 - rightMax) < eps;

    return sameVertical && sameLeft && sameRight;
}



// Q4 antiorario
// Combinazioni valide:
// 1) B4 ≈ A3  AND C4 ≈ D1
// 2) B4 ≈ A3  AND C4 ≈ D2
//
// Q4 si appoggia a SINISTRA di Q3, incastrandosi tra Q3 (sopra)
// e Q1/Q2 (sotto).
function checkQ4_antiorario(v1, v3, v4, v2) {

    // Determinare quale quadrato è a sinistra e quale a destra (tra Q1 e Q2)
    const leftSquare  = (v1.A.x < v2.A.x) ? v1 : v2;
    const rightSquare = (v1.A.x < v2.A.x) ? v2 : v1;

    // Estremi a cui può combinarsi Q4
    const D_left  = leftSquare.D;   // vertice basso-destro del quadrato più a sinistra
    const D_right = rightSquare.D;  // vertice basso-destro del quadrato più a destra

    // B4 deve attaccarsi a A3
    const touchTop = approx(v4.B, v3.A);

    // C4 può attaccarsi a D_left OPPURE a D_right
    const touchBottomLeft  = approx(v4.C, D_left);
    const touchBottomRight = approx(v4.C, D_right);

    return touchTop && (touchBottomLeft || touchBottomRight);
}


// Q5 antiorario (in base a Q4 e Q2)
// A5==D4+eps && B5==C2+eps
function checkQ5_antiorario(v4, v2, v5) {
    return (
        approx(v5.A, v4.D) &&
        approx(v5.B, v2.C)
    );
}

/* ============================================
   CONTROLLI PDF — ORARIO (speculare)
   ============================================ */

// versione speculare "oraria" (puoi affinarla se vuoi un layout preciso)
function checkQ3_orario(v1, v2, v3) {
    // quadrato da 2 "sotto" in senso orario: A3 vicino a D1, B3 vicino a C2
    return (
        approx(v3.A, v1.D) &&
        approx(v3.B, v2.C)
    );
}

function checkQ4_orario(v1, v3, v4) {
    // B4 vicino a D3, A4 vicino a C1 (esempio speculare)
    return (
        approx(v4.B, v3.D) &&
        approx(v4.A, v1.C)
    );
}

function checkQ5_orario(v4, v2, v5) {
    // D5 vicino a A4, C5 vicino a B2
    return (
        approx(v5.D, v4.A) &&
        approx(v5.C, v2.B)
    );
}

/* ============================================
   VALIDAZIONE POSIZIONAMENTO
   ============================================ */

function validaQuadrato(n) {
    // controllo ordine
    if (ordine !== n) {
        showMsg("Devi muovere prima il quadrato " + ordine, "error");
        resetPosizione(n);
        return;
    }

    const v1 = getVerticesInCanvas(Q[1]);
    const v2 = getVerticesInCanvas(Q[2]);
    const v3 = getVerticesInCanvas(Q[3]);
    const v4 = getVerticesInCanvas(Q[4]);
    const v5 = getVerticesInCanvas(Q[5]);

    const v = getVerticesInCanvas(Q[n]);
    let ok = false;

    if (n === 1) {
        // Q1: basta che stia nel canvas
        ok = true;
    } else if (n === 2) {
        ok = checkQ2(v1, v);
    } else if (n === 3) {
        if (!orientamento) {
            // se non hai ancora scelto orientamento, per sicurezza falliamo
            showMsg("Scegli prima l'orientamento dopo il quadrato 2.", "error");
            resetPosizione(n);
            return;
        }
        ok = orientamento === "antiorario"
            ? checkQ3_antiorario(v1, v2, v)
            : checkQ3_orario(v1, v2, v);
    } else if (n === 4) {
        ok = orientamento === "antiorario"
            ? checkQ4_antiorario(v1, v3, v, v2)
            : checkQ4_orario(v1, v3, v);
    } else if (n === 5) {
        ok = orientamento === "antiorario"
            ? checkQ5_antiorario(v4, v2, v)
            : checkQ5_orario(v4, v2, v);
    }

    if (!ok) {
        showMsg("❌ Posizione errata per il quadrato " + n, "error");
        resetPosizione(n);
        return;
    }

    // posizionamento corretto
    fissaQuadrato(n);
    showMsg("✔ Quadrato " + n + " posizionato correttamente!", "success");

    ordine++;

    if (ordine === 2) {
        abilitaQuadrato(2);
    } else if (ordine === 3) {
        // dopo Q2: mostra scelta orientamento, ma NON abilito ancora Q3
        document.getElementById("orientamento").style.display = "block";
    } else if (ordine === 4 || ordine === 5) {
        abilitaQuadrato(ordine);
    } else if (ordine === 6) {
        showMsg("🎉 Hai completato il rettangolo aureo!", "success");
    }
}

/* ============================================
   GESTIONE DRAG (pointer events)
   ============================================ */

function setupDrag(n) {
    const el = Q[n];

    el.addEventListener("pointerdown", (e) => {
        // solo se non è disabilitato / fissato
        if (el.classList.contains("disabled") || el.classList.contains("fixed")) return;

        e.preventDefault();
        el.setPointerCapture(e.pointerId);

        const canvasRect = canvas.getBoundingClientRect();
        const cs = window.getComputedStyle(el);

        let startLeft = parseFloat(cs.left);
        let startTop  = parseFloat(cs.top);
        const startX = e.clientX;
        const startY = e.clientY;

        function onMove(ev) {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;

            let newLeft = startLeft + dx;
            let newTop  = startTop  + dy;

            // limiti entro il canvas
            const rect = el.getBoundingClientRect();
            const width  = rect.width;
            const height = rect.height;

            const maxLeft = canvasRect.width  - width;
            const maxTop  = canvasRect.height - height;

            if (newLeft < 0) newLeft = 0;
            if (newTop  < 0) newTop  = 0;
            if (newLeft > maxLeft) newLeft = maxLeft;
            if (newTop  > maxTop)  newTop  = maxTop;

            el.style.left = newLeft + "px";
            el.style.top  = newTop  + "px";
        }

        function onUp(ev) {
            el.releasePointerCapture(e.pointerId);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);

            // alla fine del drag, validiamo la posizione
            validaQuadrato(n);
        }

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    });
}

/* ============================================
   SCELTA ORIENTAMENTO (bottoni)
   ============================================ */

document.querySelectorAll(".btn-orientamento").forEach(btn => {
    btn.addEventListener("click", () => {
        orientamento = btn.dataset.dir; // "antiorario" o "orario"
        showMsg("Orientamento scelto: " + orientamento, "success");
        document.getElementById("orientamento").style.display = "none";

        // ora posso abilitare Q3
        abilitaQuadrato(3);
    });
});

/* ============================================
   AVVIO GIOCO
   ============================================ */

// inizialmente abilito solo Q1
abilitaQuadrato(1);

// attivo drag per tutti
setupDrag(1);
setupDrag(2);
setupDrag(3);
setupDrag(4);
setupDrag(5);
