const SERVER = "localhost";
class Bomba {

	constructor(id, estado, falla, mantenimientoPrev, mantenimientoCor, horasMarcha, principal, mantenimientos) {
		this.id = id || 0;
		this.estado = estado || false;
		this.falla = falla || false;
		this.mantenimientoPrev = mantenimientoPrev || false;
		this.mantenimientoCor = mantenimientoCor || false;
		this.horasMarcha = horasMarcha || "";
		this.principal = principal || false;
		this.contadorMantenimientos = mantenimientos || 0;
	}


	async actualizarAtributos() {
		const datos = await this.getDatos();
		console.log(datos);

		this.estado = datos.Confirmacion_Marcha_Motor;
		this.mantenimientoPrev = datos.Alarma_Manten_Prev_B;
		this.mantenimientoCor = datos.Alarma_Manten_Correct_B;
		this.falla = datos.Entrada_Falla_Motor;
		this.horasMarcha = datos.Horas_de_Marcha_Motor;
		this.contadorMantenimientos = datos.Contador_de_Mantenimientos_B;
	}

	async getDatos() {
		const response = await fetch(`http://${SERVER}:1880/lcm/get_datos_b${this.id}`);
		const data = await response.json();
		return data;
	}

	renderizarEstado(estadoBomba) {
		const hijo = estadoBomba.children[0];
		if (this.estado === true) {
		hijo.textContent = "Encendido";
		estadoBomba.classList.add("encendido");
		} else {
		hijo.textContent = "Apagado";
		estadoBomba.classList.remove("encendido");
		}
	}

	setPrincipal(bombaEsPrincipal) {
		if (this.principal === true) {
		bombaEsPrincipal.classList.add("bomba-principal");
		} else {
		bombaEsPrincipal.classList.remove("bomba-principal");
		}
	}

	mantenimiento(mantenimientos) {
		const texto = mantenimientos[this.id - 1].querySelector("p");
		if (this.mantenimientoPrev === true) {
		texto.textContent = "Preventivo";
		mantenimientos[this.id - 1].classList.add("preventivo");
		} else if (this.mantenimientoCor === true) {
		texto.textContent = "Correctivo";
		mantenimientos[this.id - 1].classList.add("correctivo");
		} else {
		texto.textContent = "";
		mantenimientos[this.id - 1].classList.remove("correctivo");
		mantenimientos[this.id - 1].classList.remove("preventivo");
		}
	}

	renderizarHorasMarcha(horasMarcha) {
		horasMarcha.textContent = this.horasMarcha;
	}

	fallaBomba(falla) {
		if (this.falla === false) {
		falla.classList.add("alarma-activa");
		falla.classList.remove("alarma-desactivada");
		} else {
		falla.classList.remove("alarma-activa");
		falla.classList.add("alarma-desactivada");
		}
	}

	mantenimientoRealizada(mantenimiento) {
		mantenimiento.textContent = this.contadorMantenimientos;
	}

}

export default Bomba;