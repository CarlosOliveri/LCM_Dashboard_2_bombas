import Bomba from "./Bomba.js";

const bomba1 = new Bomba(1);
const bomba2 = new Bomba(2);

const URL = "http://localhost:1880/get_datos_sistema";
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
const contenedorImagenTanque = document.querySelector("tanque");

const actualizarSistema = () => {
    //Actualizar el Modo de Funcionamiento
    if(datos["Manual_Automatico"] === false){
        modoOperacion.textContent = "Manual";
    }else{
        modoOperacion.textContent = "Automático";
    }

    //Actualizacion de Motror Principal
    if(datos["Alternar_Motor_Manual"] === true){
        bomba1.principal = false;
        bomba2.principal = true;
    }else{
        bomba2.principal = false;
        bomba1.principal = true;
    }

    //Actualizar Imagen de Tanque 
    if(datos["Entrada_Vacuostato"] === false){
        const imagen = contenedorImagenTanque.children[1];
        console.log(imagen);
    }

}
setInterval(actualizarSistema,1000);


const estadoBomba1 = document.querySelector(".bomba1"); 
setInterval(async () => {
    await bomba1.actualizarAtributos();
    bomba1.renderizarEstado(estadoBomba1)
},1000);
/* setInterval(async () => {
    await bomba1.actualizarAtributos();
    const hijo = estadoBomba1.children[0];
    if(bomba1.estado === true){
        hijo.textContent = "Encendido";
        estadoBomba1.classList.add("encendido");
    }else{
        hijo.textContent = "Apagado";
        estadoBomba1.classList.remove("encendido");
    }
},1000); */

const estadoBomba2 = document.querySelector(".bomba2"); 
setInterval(async () => {
    await bomba2.actualizarAtributos();
    bomba2.renderizarEstado(estadoBomba2)
},1000);
/* setInterval(async () => {
    await bomba2.actualizarAtributos();
    const hijo = estadoBomba2.children[0];
    if(bomba2.estado === true){
        hijo.textContent = "Encendido";
        estadoBomba2.classList.add("encendido");
    }else{
        hijo.textContent = "Apagado";
        estadoBomba2.classList.remove("encendido");
    }
},1000); */

const bomba1EsPrincipal = document.querySelector(".ident-principal1");
setInterval(async() => {
    await bomba1.actualizarAtributos();
    bomba1.setPrincipal(bomba1EsPrincipal);
},1000);

const bomba2EsPrincipal = document.querySelector(".ident-principal2");
setInterval(async() => {
    await bomba2.actualizarAtributos();
    bomba2.setPrincipal(bomba2EsPrincipal);
},1000);





