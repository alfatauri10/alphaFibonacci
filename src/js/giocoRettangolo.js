/* ============================================
   MINI GIOCO: DISEGNA IL RETTANGOLO AUREO
   ============================================ */

const canvas = document.getElementById("canvas-gioco");
const msg = document.getElementById("msg");

let ordine = 1;
let orientamento = null;
const eps = 15;
let inRepositionMode = false;

// riferimenti ai quadrati
const Q = {
    1: document.getElementById("q1"),
    2: document.getElementById("q2"),
    3: document.getElementById("q3"),
    4: document.getElementById("q4"),
    5: document.getElementById("q5")
};

// salva posizioni iniziali
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
    Q[n].style.pointerEvents = "none";
}

function resetPosizione(n) {
    const p = startPos[n];
    Q[n].style.left = p.left + "px";
    Q[n].style.top  = p.top  + "px";
}

// vertici relativi al canvas
function getVerticesInCanvas(square) {
    const canvasRect = canvas.getBoundingClientRect();
    const r = square.getBoundingClientRect();
    return {
        A: { x: r.left  - canvasRect.left, y: r.top    - canvasRect.top },
        B: { x: r.right - canvasRect.left, y: r.top    - canvasRect.top },
        C: { x: r.left  - canvasRect.left, y: r.bottom - canvasRect.top },
        D: { x: r.right - canvasRect.left, y: r.bottom - canvasRect.top }
    };
}

/* ============================================
   CHECK SOVRAPPOSIZIONI (collisioni)
   ============================================ */

function overlaps(vA, vB) {
    const horizontal = vA.A.x < vB.D.x && vA.D.x > vB.A.x;
    const vertical   = vA.A.y < vB.C.y && vA.C.y > vB.A.y;
    return horizontal && vertical;
}

/* ============================================
   CHECK ANTIORARIO (SOLUZIONE A)
   ============================================ */

function checkQ2(v1, v2) {
    const center1 = (v1.A.y + v1.C.y)/2;
    const center2 = (v2.A.y + v2.C.y)/2;
    const sameHeight = Math.abs(center1 - center2) < eps;

    const rightSide = Math.abs(v2.A.x - v1.B.x) < eps;
    const leftSide  = Math.abs(v2.B.x - v1.A.x) < eps;

    return sameHeight && (rightSide || leftSide);
}

function checkQ3_antiorario(v1, v2, v3) {
    const topY = (v1.A.y + v2.A.y)/2;
    const leftMin  = Math.min(v1.A.x, v2.A.x);
    const rightMax = Math.max(v1.B.x, v2.B.x);

    return (
        Math.abs(v3.C.y - topY) < eps &&
        Math.abs(v3.C.x - leftMin) < eps &&
        Math.abs(v3.D.x - rightMax) < eps
    );
}

function checkQ4_antiorario(v1, v3, v4, v2) {
    const leftAlign = Math.abs(v4.D.x - v3.A.x) < eps;
    const topAlign  = Math.abs(v4.B.y - v3.A.y) < eps;

    const bottom1 = Math.abs(v4.C.y - v1.D.y) < eps;
    const bottom2 = Math.abs(v4.C.y - v2.D.y) < eps;

    return leftAlign && topAlign && (bottom1 || bottom2);
}

function checkQ5_antiorario(v4, v3, v5) {
    const bottomY = Math.max(v4.C.y, v3.C.y);
    const leftMin = Math.min(v4.A.x, v3.A.x);
    const rightMax = Math.max(v4.B.x, v3.B.x);
    return (
        Math.abs(v5.A.y - bottomY) < eps &&
        Math.abs(v5.A.x - leftMin) < eps &&
        Math.abs(v5.B.x - rightMax) < eps
    );
}

/* ============================================
   CHECK ORARIO (SOLUZIONE A)
   ============================================ */

function checkQ3_orario(v1, v2, v3) {
    const bottomY = Math.max(v1.C.y, v2.C.y);
    const sameY = Math.abs(v3.A.y - bottomY) < eps;

    const leftMin  = v1.A.x;
    const rightMax = v2.B.x;

    const sameLeft  = Math.abs(v3.A.x - leftMin) < eps;
    const sameRight = Math.abs(v3.B.x - rightMax) < eps;

    return sameY && sameLeft && sameRight;
}

function checkQ4_orario(v1, v3, v4) {
    const rightAlign = Math.abs(v4.B.x - v1.A.x) < eps;
    const topAlign = Math.abs(v4.A.y - v1.A.y) < eps;
    const bottomAlign = Math.abs(v4.C.y - v3.C.y) < eps;

    return rightAlign && topAlign && bottomAlign;
}

function checkQ5_orario(v1, v2, v4, v5) {
    const topBlock = Math.min(v4.A.y, v1.A.y);

    const verticalAlign = Math.abs(v5.C.y - topBlock) < eps;

    const leftMin  = v4.A.x;
    const rightMax = v2.B.x;

    const leftAlign  = Math.abs(v5.A.x - leftMin) < eps;
    const rightAlign = Math.abs(v5.B.x - rightMax) < eps;

    return verticalAlign && leftAlign && rightAlign;
}

/* ============================================
   VALIDAZIONE POSIZIONAMENTO
   ============================================ */

function validaQuadrato(n) {
    const v1 = getVerticesInCanvas(Q[1]);
    const v2 = getVerticesInCanvas(Q[2]);
    const v3 = getVerticesInCanvas(Q[3]);
    const v4 = getVerticesInCanvas(Q[4]);
    const v5 = getVerticesInCanvas(Q[5]);

    const v = getVerticesInCanvas(Q[n]);
    let ok = false;

    /* ---- EVITA SOVRAPPOSIZIONI ---- */

    const fixedSquares = Object.values(Q).filter(q => q.classList.contains("fixed"));

    for (let sq of fixedSquares) {
        if (sq === Q[n]) continue;

        const vFixed = getVerticesInCanvas(sq);
        if (overlaps(v, vFixed)) {
            showMsg("❌ I quadrati non possono sovrapporsi!", "error");
            resetPosizione(n);
            return;
        }
    }

    /* ---- LOGICA DI COSTRUZIONE ---- */

    if (n === 1) ok = true;

    else if (n === 2) ok = checkQ2(v1, v);

    else if (n === 3) {
        if (!orientamento) {
            showMsg("Scegli orientamento!", "error");
            resetPosizione(n);
            return;
        }
        ok = orientamento === "antiorario"
            ? checkQ3_antiorario(v1, v2, v)
            : checkQ3_orario(v1, v2, v);
    }

    else if (n === 4) {
        ok = orientamento === "antiorario"
            ? checkQ4_antiorario(v1, v3, v, v2)
            : checkQ4_orario(v1, v3, v);
    }

    else if (n === 5) {
        ok = orientamento === "antiorario"
            ? checkQ5_antiorario(v4, v3, v)
            : checkQ5_orario(v1, v2, v4, v);
    }

    if (!ok) {
        showMsg("❌ Posizione errata!", "error");
        resetPosizione(n);
        return;
    }

    /* ---- SUCCESSO ---- */

    fissaQuadrato(n);
    showMsg("✔ Quadrato " + n + " posizionato!", "success");
    ordine++;

    if (ordine === 2) {
        abilitaQuadrato(2);
    } else if (ordine === 3) {
        document.getElementById("orientamento").style.display = "block";
    } else if (ordine === 4 || ordine === 5) {
        abilitaQuadrato(ordine);
    } else if (ordine === 6) {
        showMsg("🎉 Hai completato il rettangolo aureo!", "success");
        setTimeout(autoSnapFinale, 800); // animazione smooth + centratura
    }

}

/* ============================================
   DRAG BLOCCO
   ============================================ */

function startGroupDrag(e) {
    const fixedSquares = Array.from(document.querySelectorAll(".square.fixed"));
    if (fixedSquares.length === 0) return;

    const canvasRect = canvas.getBoundingClientRect();

    const initial = fixedSquares.map(el => {
        const cs = window.getComputedStyle(el);
        return {
            el,
            left: parseFloat(cs.left),
            top:  parseFloat(cs.top),
            w: el.getBoundingClientRect().width,
            h: el.getBoundingClientRect().height
        };
    });

    const startX = e.clientX;
    const startY = e.clientY;

    function onMove(ev) {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        initial.forEach(item => {
            let L = item.left + dx;
            let T = item.top  + dy;

            const maxLeft = canvasRect.width - item.w;
            const maxTop  = canvasRect.height - item.h;

            if (L < 0) L = 0;
            if (T < 0) T = 0;
            if (L > maxLeft) L = maxLeft;
            if (T > maxTop) T = maxTop;

            item.el.style.left = L + "px";
            item.el.style.top  = T + "px";
        });
    }

    function onUp() {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
}

/* ============================================
   DRAG QUADRATI SINGOLI
   ============================================ */

function setupDrag(n) {
    const el = Q[n];

    el.addEventListener("pointerdown", (e) => {

        if (inRepositionMode) {
            if (el.classList.contains("fixed")) {
                e.preventDefault();
                startGroupDrag(e);
            }
            return;
        }

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

            let L = startLeft + dx;
            let T = startTop  + dy;

            const rect = el.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            const maxLeft = canvasRect.width - w;
            const maxTop  = canvasRect.height - h;

            if (L < 0) L = 0;
            if (T < 0) T = 0;
            if (L > maxLeft) L = maxLeft;
            if (T > maxTop) T = maxTop;

            el.style.left = L + "px";
            el.style.top  = T + "px";
        }

        function onUp() {
            el.releasePointerCapture(e.pointerId);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            validaQuadrato(n);
        }

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    });
}

/* ============================================
   SCELTA ORIENTAMENTO
   ============================================ */

document.querySelectorAll(".btn-orientamento").forEach(btn => {
    btn.addEventListener("click", () => {
        orientamento = btn.dataset.dir;
        showMsg("Orientamento scelto: " + orientamento, "success");
        document.getElementById("orientamento").style.display = "none";
        abilitaQuadrato(3);
    });
});

/* ============================================
   MODALITÀ SPOSTA BLOCCO
   ============================================ */

const btnRiposiziona = document.getElementById("btn-riposiziona");
if (btnRiposiziona) {
    btnRiposiziona.addEventListener("click", () => {
        inRepositionMode = !inRepositionMode;

        const fixed = document.querySelectorAll(".square.fixed");

        if (inRepositionMode) {
            showMsg("Modalità blocco attiva.", "success");
            fixed.forEach(q => {
                q.style.pointerEvents = "auto";
                q.style.cursor = "grab";
            });
        } else {
            showMsg("Modalità blocco disattivata.", "success");
            fixed.forEach(q => q.style.pointerEvents = "none");
            abilitaQuadrato(ordine);
        }
    });
}

/* ============================================
   AVVIO
   ============================================ */

abilitaQuadrato(1);
setupDrag(1);
setupDrag(2);
setupDrag(3);
setupDrag(4);
setupDrag(5);

/* ============================================
   AUTO-SNAP E CENTRATURA
   ============================================ */

// funzione per auto-allineare i quadrati dopo la costruzione
function autoSnapFinale() {
    const animDuration = 600; // ms

    // posizioni perfette rispetto a Q1
    const pos = calcolaPosizioniPerfette();

    // calcola bounding box del rettangolo aureo finale
    const canvasRect = canvas.getBoundingClientRect();
    const sizes = { 1: 50, 2: 50, 3: 100, 4: 150, 5: 250 };

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    Object.entries(pos).forEach(([n, p]) => {
        const w = sizes[n];
        const h = sizes[n];
        if (p.left < minX) minX = p.left;
        if (p.top < minY) minY = p.top;
        if (p.left + w > maxX) maxX = p.left + w;
        if (p.top + h > maxY) maxY = p.top + h;
    });

    const rectW = maxX - minX;
    const rectH = maxY - minY;

    // target per centratura nel canvas
    const centerLeft = (canvasRect.width - rectW) / 2;
    const centerTop  = (canvasRect.height - rectH) / 2;

    const dx = centerLeft - minX;
    const dy = centerTop - minY;

    // applica animazione verso posizioni perfette + centratura
    Object.entries(Q).forEach(([n, el]) => {
        const target = pos[n];
        if (!target) return;

        el.style.transition = `left ${animDuration}ms ease, top ${animDuration}ms ease`;
        el.style.left = (target.left + dx) + "px";
        el.style.top  = (target.top  + dy) + "px";
    });

    setTimeout(() => {
        Object.values(Q).forEach(el => el.style.transition = "");

        // avvia spirale
        setTimeout(() => {
            disegnaSpiraleAurea();
        }, 300);

    }, animDuration + 50);
}

// calcola le coordinate perfette per formare il rettangolo aureo
function calcolaPosizioniPerfette() {
    // Ottieni la posizione del Q1 come base (relativa al canvas)
    const v1 = getVerticesInCanvas(Q[1]);
    const baseLeft = v1.A.x;
    const baseTop  = v1.A.y;

    // Misure (coerenti con il CSS)
    const s1 = 50;
    const s2 = 50;
    const s3 = 100;
    const s4 = 150;
    const s5 = 250;

    if (orientamento === "antiorario") {
        // Configurazione:
        // Q1 e Q2 in basso, Q3 sopra, Q4 a sinistra in alto, Q5 sotto tutto
        return {
            1: { left: baseLeft,          top: baseTop         },
            2: { left: baseLeft + s1,     top: baseTop         },
            3: { left: baseLeft,          top: baseTop - s3    },
            4: { left: baseLeft - s4,     top: baseTop - s3    },
            5: { left: baseLeft - s4,     top: baseTop + s1    } // lato superiore allineato a Q4+Q1+Q2
        };
    } else {
        // ORIENTAMENTO ORARIO: configurazione speculare
        // Q1 e Q2 in basso, Q3 sotto, Q4 a sinistra, Q5 sopra tutto
        return {
            1: { left: baseLeft,          top: baseTop         },
            2: { left: baseLeft + s1,     top: baseTop         },
            3: { left: baseLeft,          top: baseTop + s1    },
            4: { left: baseLeft - s4,     top: baseTop         },
            5: { left: baseLeft - s4,     top: baseTop - s5    }
        };
    }
}

/* ============================================
   DISEGNO SPIRALE AUREA DOPO AUTOSNAP
   ============================================ */

function disegnaSpiraleAurea() {

    const svg = document.getElementById("spirale-svg");
    if (!svg) return;

    svg.innerHTML = ""; // pulizia precedente

    // recupero vertici perfettamente allineati
    const v1 = getVerticesInCanvas(Q[1]);
    const v2 = getVerticesInCanvas(Q[2]);
    const v3 = getVerticesInCanvas(Q[3]);
    const v4 = getVerticesInCanvas(Q[4]);
    const v5 = getVerticesInCanvas(Q[5]);

    // helper: disegna arco SVG
    function creaArco(start, end, r, sweep) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

        const d = `
            M ${start.x} ${start.y}
            A ${r} ${r} 0 0 ${sweep} ${end.x} ${end.y}
        `;

        path.setAttribute("d", d.trim());
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#B8864B");
        path.setAttribute("stroke-width", "6");
        path.setAttribute("stroke-linecap", "round");
        path.style.opacity = "0";

        svg.appendChild(path);
        return path;
    }

    // definizione archi per orientamento ORARIO / ANTIORARIO
    let archi = [];

    if (orientamento === "antiorario") {

        archi = [
            { r: 50,  start: v1.A, end: v1.C }, // Q1
            { r: 50,  start: v2.D, end: v2.B }, // Q2
            { r: 100, start: v3.C, end: v3.A }, // Q3
            { r: 150, start: v4.B, end: v4.D }, // Q4
            { r: 250, start: v5.A, end: v5.C }  // Q5
        ];

    } else {

        archi = [
            { r: 50,  start: v1.D, end: v1.B }, // Q1
            { r: 50,  start: v2.A, end: v2.C }, // Q2
            { r: 100, start: v3.B, end: v3.D }, // Q3
            { r: 150, start: v4.C, end: v4.A }, // Q4
            { r: 250, start: v5.D, end: v5.B }  // Q5
        ];
    }

    // disegno archi in sequenza
    let delay = 0;

    archi.forEach((a) => {
        const sweep = (orientamento === "antiorario") ? 1 : 0; // direzione

        const path = creaArco(a.start, a.end, a.r, sweep);

        const len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;

        setTimeout(() => {
            path.style.transition = "stroke-dashoffset 900ms ease, opacity 300ms ease";
            path.style.opacity = "1";
            path.style.strokeDashoffset = "0";
        }, delay);

        delay += 900;
    });
}

/* ============================================
   RESET COMPLETO GIOCO
   ============================================ */

function resetGioco() {

    // reset ordine e orientamento
    ordine = 1;
    orientamento = null;

    // nascondi scelta orientamento
    document.getElementById("orientamento").style.display = "none";

    // reset messaggio
    showMsg("Gioco resettato. Posiziona il quadrato 1.", "");

    // pulisci spirale
    const svg = document.getElementById("spirale-svg");
    if (svg) svg.innerHTML = "";

    // reset quadrati
    Object.entries(Q).forEach(([n, el]) => {
        el.classList.remove("fixed");
        el.classList.remove("disabled");
        el.style.pointerEvents = "auto";

        const p = startPos[n];
        el.style.left = p.left + "px";
        el.style.top  = p.top  + "px";
    });

    // abilita solo Q1
    abilitaQuadrato(1);
}

document.getElementById("btn-reset-gioco").addEventListener("click", resetGioco);
