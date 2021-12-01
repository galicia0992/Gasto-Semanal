//variables y selectores
const formulario = document.querySelector("#agregar-gasto")
const gastoListado = document.querySelector("#gastos ul")

//eventos
eventListeners()
function eventListeners(){
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto)
    formulario.addEventListener("submit", agregarGasto)
}

//clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante()
        console.log(this.gastos)
    }
    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado
        console.log(gastado)
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)
        this.calcularRestante()
    }
}

class UI{
    insertarPresupuesto(cantidad){
        //extraemos el valor
        const {presupuesto, resntante} = cantidad

        //agregamos al html
        document.querySelector("#total").textContent = presupuesto
        document.querySelector("#restante").textContent = presupuesto
    }

    imprimirAlerta(mensaje, tipo){
        //crear el div
        const divAlerta = document.createElement("div")
        divAlerta.classList.add("text-center", "alert")

        if(tipo === "error"){
            divAlerta.classList.add("alert-danger")
        }else{
            divAlerta.classList.add("alert-success")
        }

        //mensaje de error
        divAlerta.textContent = mensaje

        //insertar en html
        document.querySelector(".primario").insertBefore(divAlerta, formulario)

        //quitarlo el html
        setTimeout(() => {
            divAlerta.remove()
        }, 3000);
    }
    mostrarGastos(gastos){

        //elimina el html previo
        this.limpiarHTML()
        //iterar sobre los gastos
        gastos.forEach(element => {
            const {cantidad, nombre, id} = element
            //crear un LI
            const nuevoGasto = document.createElement("li")
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center"
            nuevoGasto.dataset.id = id

            //agregar el html
            nuevoGasto.innerHTML = `${nombre}<span class="badge badge-primary badge-pill">$ ${cantidad}</span>`

            //boton
            const btnBorrar = document.createElement("button")
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto")
            btnBorrar.textContent = "borrar"
            btnBorrar.onclick= () =>{
                eliminarGasto(id)
                console.log(id)
            }
            nuevoGasto.appendChild(btnBorrar)

            //agregar al html
            gastoListado.appendChild(nuevoGasto)
        });

    }
    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }
    actualizarRestante(restante){
        document.querySelector("#restante").textContent = restante
    }
    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj
        const restanteDiv = document.querySelector(".restante")

        //comprobar 25%
        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove("alert-success", "alert-warning")
            restanteDiv.classList.add("alert-danger")
        }else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove("alert-sucess")
            restanteDiv.classList.add("alert-warning")
        }else{
            restanteDiv.classList.remove("alert-danger", "alert-warning")
            restanteDiv.classList.add("alert-success")
        }

        //el presupuesto se agota
        if(presupuesto == 0){
            ui.imprimirAlerta("el presupuesto se ha agotado")
            formulario.querySelector('button[type="submit"]').disabled = true
        }
    }
}

//instanciar
const ui = new UI()
let presupuestos

//funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("cual es tu presupuesto")
    if(presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        alert("presupuesto invalido")
         document.location.reload()
    }

    presupuesto = new Presupuesto(presupuestoUsuario)
    console.log(presupuesto)
    ui.insertarPresupuesto(presupuesto)
}


//añade gasto
function agregarGasto(e){
    e.preventDefault()

    //leer datos del formulario
    const nombre = document.querySelector("#gasto").value 
    const cantidad = Number(document.querySelector("#cantidad").value)
    

    if(nombre === "" || cantidad ===""){
        ui.imprimirAlerta("ambos campos son obligarorios", "error")
        return
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta("cantidad no valida", "error")
        return
    }

    //generar objeto gasto
    const gasto = {nombre, cantidad, id:Date.now()}

    //añade nuevo gasto
    presupuesto.nuevoGasto(gasto)

    //mensaje correcto
    ui.imprimirAlerta("gasto agregado correctamente")

    //imprimir los gastos  
    const {gastos, restante} = presupuesto 
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)
    //reinicia el formulario
    formulario.reset()

}

function eliminarGasto(id){
    //elimina los gastos del objeto
    presupuesto.eliminarGasto(id)

    //elimina los gastos del html
    const {gastos, restante}= presupuesto
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)
}