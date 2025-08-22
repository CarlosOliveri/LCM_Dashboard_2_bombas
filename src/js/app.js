import Bomba from "./Bomba.js";

const bomba1 = new Bomba(1);
const bomba2 = new Bomba(2);
const avisos = [];

let miObjeto = {
  miVariable: 10
};

const URL = "http://3.130.224.82:1880/lcm/get_datos_sistema";
let datos = {};
setInterval(()=>{
    fetch(URL)
        .then((response) => response.json())
        .then((data) => {
            datos = data;
            //console.log(datos);
        })
},1000);

const modoOperacion = document.querySelector(".modo-auto-manual h2"); 
const contenedorImagenTanque = document.querySelector(".tanque");

const actualizarSistema = async () => {
    await bomba2.actualizarAtributos();
    await bomba1.actualizarAtributos();

    //Actualizar el Modo de Funcionamiento
    if(datos["Manual_Automatico"] === false){
        modoOperacion.textContent = "Manual";
    }else{
        modoOperacion.textContent = "Automático";
    }

    //Actualizacion de Motror Principal Manualmente
    if(datos["Alternar_Motor_Manual"] === true){
        bomba1.principal = false;
        bomba2.principal = true;
    }else{
        bomba2.principal = false;
        bomba1.principal = true;
    }

    //Actualizar alternancia de motores
    const bomba1EsPrincipal = document.querySelector(".ident-principal1");
    bomba1.setPrincipal(bomba1EsPrincipal);

    const bomba2EsPrincipal = document.querySelector(".ident-principal2");
    bomba2.setPrincipal(bomba2EsPrincipal);

    //Estado de los motores
    const estadoBomba1 = document.querySelector(".bomba1"); 
    bomba1.renderizarEstado(estadoBomba1)

    const estadoBomba2 = document.querySelector(".bomba2");
    bomba2.renderizarEstado(estadoBomba2)

    //Actualizar Imagen de Tanque 
    const imagen = contenedorImagenTanque.children[1];
    if(datos["Entrada_Vacuostato"] === false){
        imagen.src = "../src/img/tanque_vacio.png";
    }else{
        imagen.src = "../src/img/tanque_lleno.png";
    }

    //Parada de Emergencia
    const bgbody = document.querySelector("body");
    const PE_aviso = document.querySelector("#PE");
    if(datos["Parada_de_Emergencia_Pulsada"] === true){
        bgbody.classList.add("parada_emergencia");
        bgbody.classList.remove("body-normal");

        PE_aviso.classList.add("alarma-activa");
        PE_aviso.classList.remove("alarma-desactivada");
    }else{
        bgbody.classList.remove("parada_emergencia");
        bgbody.classList.add("body-normal");

        PE_aviso.classList.remove("alarma-activa");
        PE_aviso.classList.add("alarma-desactivada");
    }

    //Mantenimientos
    const mantenimientos = document.querySelectorAll(".mantenimiento");
    bomba1.mantenimiento(mantenimientos);
    bomba2.mantenimiento(mantenimientos);

    const numMantenimientos = document.querySelectorAll(".num-mant");
    bomba1.mantenimientoRealizada(numMantenimientos[0]);
    bomba2.mantenimientoRealizada(numMantenimientos[1]);

    //horas de funcionamiento
    const horasMarcha = document.querySelectorAll(".horas-marcha");
    bomba2.renderizarHorasMarcha(horasMarcha[1]);
    bomba1.renderizarHorasMarcha(horasMarcha[0]);

    //alternancia
    const alternancia = document.querySelector(".alternancia").querySelector("p");
    if(datos["Alternar_Motores_Automaticamente"] === true){
        alternancia.classList.add("alternancia-activada");
        alternancia.textContent = "Alternancia Activada";
    }else{
        alternancia.classList.remove("alternancia-activada");
        alternancia.textContent = "Alternancia Desactivada";
    }
    //Avisos
    const falla1 = document.querySelector("#falla-1");
    const falla2 = document.querySelector("#falla-2");
    bomba1.fallaBomba(falla1);
    bomba2.fallaBomba(falla2);

    const sinRef = document.querySelector("#sin-refuerzo");
    if(datos["Alarma_Tiempo_Sin_Refuerzo_Excedido"] === true){
        sinRef.classList.add("alarma-activa");
        sinRef.classList.remove("alarma-desactivada");
    }else{
        sinRef.classList.remove("alarma-activa");
        sinRef.classList.add("alarma-desactivada");
    }

    const conRef = document.querySelector("#con-refuerzo");
    if(datos["Alarma_Refuerzo_Mucho_Tiempo"] === true){
        conRef.classList.add("alarma-activa");
        conRef.classList.remove("alarma-desactivada");
    }else{
        conRef.classList.remove("alarma-activa");
        conRef.classList.add("alarma-desactivada");
    }

}
setInterval(actualizarSistema,1000);
