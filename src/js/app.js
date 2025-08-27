import Bomba from "./Bomba.js";

const bomba1 = new Bomba(1);
const bomba2 = new Bomba(2);
const avisos = [];

let miObjeto = {
    miVariable: 10
};

const SERVER = "localhost";

const URL = `http://${SERVER}:1880/lcm/get_datos_sistema`;
let datos = {};
setInterval(()=>{
    fetch(URL, {
        method: "GET",
        credentials: "include"   // 🔑 Esto hace que se envíen cookies
    })
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
        imagen.src = "/lcm/tanque_vacio.png";
    }else{
        imagen.src = "/lcm/tanque_lleno.png";
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
    const horasMarcha1 = document.querySelector("#horas-marcha1");
    const horasMarcha2 = document.querySelector("#horas-marcha2");
    bomba2.renderizarHorasMarcha(horasMarcha2);
    bomba1.renderizarHorasMarcha(horasMarcha1);

    //alternancia
    const alternancia = document.querySelector(".alternancia").querySelector("p");
    if(datos["Alternar_Motores_Automaticamente"] === true){
        alternancia.textContent = "Alternancia activada";
    }else{
        alternancia.textContent = "Alternancia desactivada";
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
    if(datos["Alarma_refuerzo_mucho_tiempo"] === true){
        conRef.classList.add("alarma-activa");
        conRef.classList.remove("alarma-desactivada");
    }else{
        conRef.classList.remove("alarma-activa");
        conRef.classList.add("alarma-desactivada");
    }

}
setInterval(actualizarSistema,1000);

const botonLogout = document.querySelector(".logout-bt");
botonLogout.addEventListener("click", ()=>{
    fetch(`http://${SERVER}:1880/lcm/logout`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
    }).then(response => { 
        if (response.ok) {
            window.location.href = `http://${SERVER}:1880/lcm/login`;
            //return response.json();
        } else {
            return new Error("Error en logout")
        }
    }).catch((e) => {
        console.log("Error en logout", e);
    })
});

