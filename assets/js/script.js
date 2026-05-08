document.addEventListener("DOMContentLoaded", () => {
	const reservaSection = document.querySelector(".info");
	const saibaMaisBtn = document.querySelector(".hero-card .btn");

	if (saibaMaisBtn && reservaSection) {
		saibaMaisBtn.addEventListener("click", () => {
			reservaSection.scrollIntoView({ behavior: "smooth", block: "start" });
		});
	}

	const reservaForm = document.querySelector(".reserva-card");
	const submitBtn = reservaForm ? reservaForm.querySelector("button") : null;
	const nomeInput = reservaForm ? reservaForm.querySelector('input[type="text"]') : null;
	const emailInput = reservaForm ? reservaForm.querySelector('input[type="email"]') : null;
	const dataEntradaInput = reservaForm ? reservaForm.querySelectorAll('input[type="date"]')[0] : null;
	const dataSaidaInput = reservaForm ? reservaForm.querySelectorAll('input[type="date"]')[1] : null;
	const observacaoInput = reservaForm ? reservaForm.querySelector("textarea") : null;
	const adultosInput = reservaForm ? reservaForm.querySelectorAll('input[type="number"]')[0] : null;
	const criancasInput = reservaForm ? reservaForm.querySelectorAll('input[type="number"]')[1] : null;

	const feedback = document.createElement("div");
	feedback.className = "form-feedback";

	if (reservaForm) {
		reservaForm.appendChild(feedback);
	}

	const hoje = new Date().toISOString().split("T")[0];
	if (dataEntradaInput) {
		dataEntradaInput.min = hoje;
	}
	if (dataSaidaInput) {
		dataSaidaInput.min = hoje;
	}

	if (dataEntradaInput && dataSaidaInput) {
		dataEntradaInput.addEventListener("change", () => {
			dataSaidaInput.min = dataEntradaInput.value || hoje;
			if (dataSaidaInput.value && dataSaidaInput.value < dataSaidaInput.min) {
				dataSaidaInput.value = "";
			}
		});
	}

	function marcarCampo(campo, valido) {
		if (!campo) {
			return;
		}

		campo.classList.remove("is-valid", "is-invalid");
		campo.classList.add(valido ? "is-valid" : "is-invalid");
	}

	function mostrarFeedback(mensagem, tipo) {
		feedback.textContent = mensagem;
		feedback.classList.remove("error", "success");
		feedback.classList.add(tipo);
	}

	function validarFormulario() {
		if (!nomeInput || !emailInput || !dataEntradaInput || !dataSaidaInput || !adultosInput || !criancasInput) {
			return false;
		}

		const nomeValido = nomeInput.value.trim().length >= 3;
		const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
		const entradaValida = Boolean(dataEntradaInput.value);
		const saidaValida = Boolean(dataSaidaInput.value) && dataSaidaInput.value >= dataEntradaInput.value;
		const adultosValido = Number(adultosInput.value) >= 1;
		const criancasValido = Number(criancasInput.value) >= 0;

		marcarCampo(nomeInput, nomeValido);
		marcarCampo(emailInput, emailValido);
		marcarCampo(dataEntradaInput, entradaValida);
		marcarCampo(dataSaidaInput, saidaValida);
		marcarCampo(adultosInput, adultosValido);
		marcarCampo(criancasInput, criancasValido);

		return nomeValido && emailValido && entradaValida && saidaValida && adultosValido && criancasValido;
	}

	if (reservaForm && submitBtn) {
	reservaForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		const formularioValido = validarFormulario();

		if (!formularioValido) {
			mostrarFeedback("Preencha os campos obrigatórios para concluir sua reserva.", "error");
			return;
		}

		const reserva = {
			nome: nomeInput?.value || "",
			email: emailInput?.value || "",
			entrada: dataEntradaInput?.value || "",
			saida: dataSaidaInput?.value || "",
			observacoes: observacaoInput?.value || "",
			adultos: Number(adultosInput?.value || 0),
			criancas: Number(criancasInput?.value || 0)
		};

		try {
			const resposta = await fetch("http://localhost:3000/reservas", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(reserva)
			});

			const data = await resposta.json();

			if (!resposta.ok) {
				console.log("Erro do servidor:", data);
				throw new Error("Erro ao salvar reserva");
			}

			mostrarFeedback("Reserva enviada com sucesso!", "success");

			setTimeout(() => {
				window.location.href = `confirmacao.html?id=${data.id}`;
			}, 3000);

			reservaForm.reset();

			[nomeInput, emailInput, dataEntradaInput, dataSaidaInput, adultosInput, criancasInput].forEach((campo) => {
				if (campo) {
					campo.classList.remove("is-valid", "is-invalid");
				}
			});

			if (dataSaidaInput) {
				dataSaidaInput.min = hoje;
			}

		} catch (erro) {
			console.log("ERRO REAL:", erro);
			mostrarFeedback("Erro ao enviar reserva.", "error");
		}
	});
}

	const revealItems = document.querySelectorAll(".info-item, .rooms-image, .reserva-card");
	revealItems.forEach((item) => {
		item.classList.add("reveal-item");
	});

	const observer = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					obs.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.2 }
	);

	revealItems.forEach((item) => observer.observe(item));
});
