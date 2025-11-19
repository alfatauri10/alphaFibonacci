document.getElementById('fib-calc').addEventListener('click', () => {
        const n = parseInt(document.getElementById('fib-num').value);
        const container = document.getElementById('fib-risultati');

        container.innerHTML = ''; // pulisce i risultati

        if (isNaN(n) || n <= 0) {
            alert('Inserisci un numero valido maggiore di 0');
            return;
        }

        if (isNaN(n) || n > 100) {
                    alert('Inserisci un numero valido minore di 0');
                    return;
                }


        // Genera sequenza di Fibonacci
        let fibSeq = [];
        for (let i = 0; i < n; i++) {
            if (i === 0) fibSeq.push(0);
            else if (i === 1) fibSeq.push(1);
            else fibSeq.push(fibSeq[i - 1] + fibSeq[i - 2]);
        }

        // Mostra i numeri uno alla volta con effetto smooth
        fibSeq.forEach((num, index) => {
            const span = document.createElement('span');
            span.textContent = num;
            span.classList.add('fib-num');
            container.appendChild(span);
            setTimeout(() => {
                span.classList.add('show');
            }, index * 300); // 300ms tra un numero e l'altro
        });
    });

document.getElementById('fib-num').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('fib-calc').click();
    }
});