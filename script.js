const campoValor = document.getElementById("valor");

const formatarMoeda = (valor) => {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
};

function atualizarCalculadora() {
    const valor = Number(campoValor.value);

    const valorValido =
        campoValor.value.trim() !== "" &&
        Number.isFinite(valor) &&
        valor > 0;

    const inicial = valorValido ? valor : 0;

    // Parceria: 25% para a facção
    const descontoParceria = inicial * 0.25;
    const restanteParceria = inicial - descontoParceria;

    // Pista: 30% para a facção
    const descontoPista = inicial * 0.30;
    const restantePista = inicial - descontoPista;

    document.getElementById("inicialParceria").textContent =
        formatarMoeda(inicial);

    document.getElementById("descontoParceria").textContent =
        formatarMoeda(descontoParceria);

    document.getElementById("restanteParceria").textContent =
        formatarMoeda(restanteParceria);

    document.getElementById("inicialPista").textContent =
        formatarMoeda(inicial);

    document.getElementById("descontoPista").textContent =
        formatarMoeda(descontoPista);

    document.getElementById("restantePista").textContent =
        formatarMoeda(restantePista);
}

campoValor.addEventListener("input", atualizarCalculadora);

atualizarCalculadora();