// ========================================
// CONFIGURAÇÕES DA CALCULADORA KAIZEN
// ========================================

const TAXA_MAQUINA = 0.05;
const TAXA_COMISSAO = 0.20;

const MODALIDADES = {
    parceria: {
        nome: "PARCERIA",
        percentualFac: 0.25,
        percentualParceiro: 0.75,
        permiteComissao: true
    },

    pista: {
        nome: "PISTA",
        percentualFac: 0.30,
        percentualParceiro: 0.70,
        permiteComissao: true
    },

    membro: {
        nome: "MEMBRO",
        percentualFac: 0.15,
        percentualParceiro: 0.85,
        permiteComissao: false
    }
};


// ========================================
// ELEMENTOS HTML
// ========================================

const campoValor = document.getElementById("valor");

const botoesModalidade = document.querySelectorAll(".mode-card");

const campoComissao = document.getElementById("comissao");

const painelComissao = document.getElementById("commissionPanel");

const statusComissao = document.getElementById("commissionStatus");

const avisoComissao = document.getElementById("commissionNotice");

const linhaComissao = document.getElementById("commissionRow");

let modalidadeSelecionada = "parceria";


// ========================================
// FORMATAÇÃO DE MOEDA
// ========================================

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ========================================
// CONVERTER VALOR DIGITADO EM NÚMERO
// Aceita exemplos como:
// 55000
// 55000,75
// 55.000,75
// 55000.75
// ========================================

function converterValor(texto) {
    let valor = texto
        .trim()
        .replace(/\s/g, "")
        .replace(/R\$/gi, "");

    if (!valor) {
        return 0;
    }

    // Se houver vírgula, ela será considerada
    // o separador decimal brasileiro.
    if (valor.includes(",")) {
        valor = valor
            .replace(/\./g, "")
            .replace(",", ".");
    } else {
        // Aceita pontos como separadores de milhar.
        // Exemplo: 55.000 -> 55000
        const formatoMilhar = /^\d{1,3}(\.\d{3})+$/;

        if (formatoMilhar.test(valor)) {
            valor = valor.replace(/\./g, "");
        }
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero) || numero < 0) {
        return 0;
    }

    return numero;
}


// ========================================
// ARREDONDAMENTO MONETÁRIO
// ========================================

function arredondarCentavos(valor) {
    return Math.round((valor + Number.EPSILON) * 100) / 100;
}


// ========================================
// SELEÇÃO DA MODALIDADE
// ========================================

function selecionarModalidade(modalidade) {
    if (!MODALIDADES[modalidade]) {
        return;
    }

    modalidadeSelecionada = modalidade;

    botoesModalidade.forEach((botao) => {
        const selecionado =
            botao.dataset.mode === modalidadeSelecionada;

        botao.classList.toggle("active", selecionado);

        botao.setAttribute(
            "aria-pressed",
            String(selecionado)
        );
    });

    atualizarOpcaoComissao();
    atualizarCalculadora();
}


// ========================================
// ATIVAR OU DESATIVAR A COMISSÃO
// ========================================

function atualizarOpcaoComissao() {
    const modalidade = MODALIDADES[modalidadeSelecionada];

    const permiteComissao = modalidade.permiteComissao;

    campoComissao.disabled = !permiteComissao;

    painelComissao.classList.toggle(
        "disabled",
        !permiteComissao
    );

    avisoComissao.hidden = permiteComissao;

    if (!permiteComissao) {
        // Membro não possui comissão.
        campoComissao.checked = false;
    }

    statusComissao.textContent = campoComissao.checked
        ? "Ativada"
        : "Desativada";
}


// ========================================
// ATUALIZAR CALCULADORA
// ========================================

function atualizarCalculadora() {
    const valorTotal = converterValor(campoValor.value);

    const modalidade = MODALIDADES[modalidadeSelecionada];

    // 1. Parte da facção.
    const parteFac = arredondarCentavos(
        valorTotal * modalidade.percentualFac
    );

    // 2. Parte do parceiro, pista ou membro.
    const parteParceiro = arredondarCentavos(
        valorTotal * modalidade.percentualParceiro
    );

    // 3. Taxa da máquina: sempre 5% do total.
    const taxaMaquina = arredondarCentavos(
        valorTotal * TAXA_MAQUINA
    );

    // 4. Saldo da facção após pagar a máquina.
    const saldoAposMaquina = arredondarCentavos(
        parteFac - taxaMaquina
    );

    // 5. Comissão opcional de 20%.
    // Só é aplicada se a modalidade permitir
    // e a opção estiver ativada.
    let valorComissao = 0;

    if (
        modalidade.permiteComissao &&
        campoComissao.checked
    ) {
        valorComissao = arredondarCentavos(
            saldoAposMaquina * TAXA_COMISSAO
        );
    }

    // 6. Valor final para o caixa da facção.
    const valorLiquido = arredondarCentavos(
        saldoAposMaquina - valorComissao
    );

    // ====================================
    // ATUALIZAR INTERFACE
    // ====================================

    document.getElementById("selectedMode").textContent =
        modalidade.nome;

    document.getElementById("valorTotal").textContent =
        formatarMoeda(valorTotal);

    document.getElementById("percentualFac").textContent =
        `${modalidade.percentualFac * 100}%`;

    document.getElementById("percentualParceiro").textContent =
        `${modalidade.percentualParceiro * 100}%`;

    document.getElementById("parteFac").textContent =
        formatarMoeda(parteFac);

    document.getElementById("parteParceiro").textContent =
        formatarMoeda(parteParceiro);

    document.getElementById("taxaMaquina").textContent =
        `− ${formatarMoeda(taxaMaquina)}`;

    document.getElementById("saldoAposMaquina").textContent =
        formatarMoeda(saldoAposMaquina);

    document.getElementById("valorComissao").textContent =
        `− ${formatarMoeda(valorComissao)}`;

    document.getElementById("valorLiquido").textContent =
        formatarMoeda(valorLiquido);

    document.getElementById("valorFinal").textContent =
        formatarMoeda(valorLiquido);

    // Exibir a linha de comissão somente quando
    // a opção estiver realmente ativa.
    linhaComissao.hidden = !(
        modalidade.permiteComissao &&
        campoComissao.checked
    );

    statusComissao.textContent = campoComissao.checked
        ? "Ativada"
        : "Desativada";

    // Atualizar descrição do resultado principal.
    if (campoComissao.checked && modalidade.permiteComissao) {
        document.getElementById("finalDescription").textContent =
            "Após taxa da máquina e comissão do lavador";
    } else {
        document.getElementById("finalDescription").textContent =
            "Após a taxa da máquina";
    }
}


// ========================================
// EVENTOS
// ========================================

// Selecionar Parceria, Pista ou Membro.
botoesModalidade.forEach((botao) => {
    botao.addEventListener("click", () => {
        selecionarModalidade(botao.dataset.mode);
    });
});

// Atualizar cálculos enquanto o usuário digita.
campoValor.addEventListener("input", atualizarCalculadora);

// Atualizar ao ativar ou desativar a comissão.
campoComissao.addEventListener("change", atualizarCalculadora);


// ========================================
// INICIALIZAÇÃO
// ========================================

atualizarOpcaoComissao();
atualizarCalculadora();
