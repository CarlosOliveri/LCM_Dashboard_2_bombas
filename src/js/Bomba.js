class Bomba{

    

    constructor(id,estado,falla,mantenimientoPrev,mantenimientoCor,horasMarcha,principal){
        this.id = id || 0;
        this.estado = estado || false;
        this.falla = falla || false;
        this.mantenimientPrev = mantenimientoPrev || false;
        this.mantenimientCor = mantenimientoCor || false;
        this.horasMarcha = horasMarcha || "";
        this.principal = principal || false;
    }


    async actualizarAtributos(){
        const datos = await this.getDatos();
        
        this.estado = datos.Confirmacion_Marcha_Motor;
        this.mantenimientPrev = datos.Alarma_Manten_Prev_B;
        this.mantenimientCor = datos.Alarma_Manten_Correct_B;
        this.falla = datos.Entrada_Falla_Motor;
        this.horasMarcha = datos.Horas_de_Marcha_Motor;
    }

    async getDatos(){
        const response = await fetch(`http://localhost:1880/get_datos_b${this.id}`);
        const data = await response.json();
        return data;
    }

    async renderizarEstado(estadoBomba){
        const hijo = estadoBomba.children[0];
        if(this.estado === true){
            hijo.textContent = "Encendido";
            estadoBomba.classList.add("encendido");
        }else{
            hijo.textContent = "Apagado";
            estadoBomba.classList.remove("encendido");
        }
    }

    async setPrincipal(bombaEsPrincipal){
        if(this.principal === true){
            bombaEsPrincipal.classList.add("bomba-principal");
        }else{
            bombaEsPrincipal.classList.remove("bomba-principal");
        }
    }

}

export default Bomba;