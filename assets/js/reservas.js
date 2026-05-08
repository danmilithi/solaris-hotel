async function carregarReservas() {
    try {
        const resposta = await fetch("http://localhost:3000/reservas");

        const reservas = await resposta.json();

        const tabela = document.getElementById("tabelaReservas");

        reservas.forEach((reserva) => {
            tabela.innerHTML += `
                <tr>
                    <td>${reserva.nome}</td>
                    <td>${reserva.email}</td>
                    <td>${reserva.entrada}</td>
                    <td>${reserva.saida}</td>
                    <td>${reserva.adultos}</td>
                    <td>${reserva.criancas}</td>
                    <td>${reserva.observacoes}</td>
                </tr>
            `;
        });
    } catch (erro) {
        console.error("Erro ao carregar reservas:", erro);
    }
}

carregarReservas();