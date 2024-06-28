document.addEventListener("DOMContentLoaded", function () {
    let totalRecaudado = localStorage.getItem('totalRecaudado')
    if (totalRecaudado) {
        document.getElementById('totalRecaudado').innerText = totalRecaudado
    }
})

/**
 * expresiones logicas
 */
const expresiones = {
    // letras, espacios y tildes
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,

    apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,

    // previo @ posterior
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,

    // los 16 numeros de la tarjeta si o si, ni mas ni menos
    numerosTarjeta: /^\d{16}$/,

    // los 3 numeros de codigo de srguridad
    codigoSeguridad: /^\d{3}$/,

    // de 1 a 9
    montoCash: /^[1-9]\d*$/
}

/**
 * Insertamos una div, en el html, junto a una lista con los items a tener en cuenta
 */
function agregarMsjDiv() {
    let divOpcional = document.getElementById('divUsoOpcional')
    let msj = document.createElement('div') // una div nueva para colocar encabezado y lista
    msj.innerHTML = `<h2>Importante:</h2> 
                     <ul>
                        <li>El nombre y el apellido <b>no</b> deben contener caracteres especiales o números.</li>
                        <li>El correo <b>debe</b> poseer <i>@</i> y <i>'.com', '.es', '.org'</i>, etc.</li>
                        <li>Asegúrese de colocar los <b>16</b> números de la tarjeta.</li>
                        <li>El código de seguridad se encuentra <b>detrás</b> de la tarjeta.</li>
                        <li>Coloque una fecha válida.</li>
                     </ul>`

    // appendChild: agregas un nodo (elemento) como hijo en un elemento padre, en este caso a divOpcional (en el html #divUsoOpcional)
    divOpcional.appendChild(msj)
}

/**
 * Validación fecha
 * @param mes Retorna el mes
 * @param anio Retorna el año
 * @return Formato de fecha
 */
function fechaValida(mes, anio) {

    let fechaValida = true

    if (mes < 1 || mes > 12) {
        fechaValida = false
    } else {
        const fecha = new Date(anio, mes - 1)
        fechaValida = fecha.getFullYear() === anio && fecha.getMonth() === mes - 1
    }
    return fechaValida
}

let donador = {
    nombre: document.getElementById('nombre').value,
    apellido: document.getElementById('apellido').value,
    email: document.getElementById('email').value,
    monto: parseInt(document.getElementById('monto').value)
}

/**
 * 
 * @returns bool
 */
function aumentarPlata() {

    let bandera = false
    if (validar()) {
        let montoBase = parseInt(document.getElementById('monto').value)
        let totalRecaudado = localStorage.getItem('totalRecaudado')

        if (totalRecaudado) {
            totalRecaudado = parseInt(totalRecaudado)
        } else {
            totalRecaudado = 0
        }

        totalRecaudado += montoBase

        localStorage.setItem('totalRecaudado', totalRecaudado)
        document.getElementById('totalRecaudado').innerHTML = totalRecaudado
        bandera = true
    }
    return bandera
}

/**
 * @returns void
 */
function msjObjetivo() {
    let totalRecaudado = parseInt(localStorage.getItem('totalRecaudado')) || 0
    let msjMetaFinal = document.getElementById('agradecimientoMetaCompleta')
    let meta = 22000000

    if (totalRecaudado >= meta) {
        msjMetaFinal.style.display = 'block'
    } else {
        msjMetaFinal.style.display = 'none'
    }
}

msjObjetivo()

/**
 * Función que ejecuta la lógica
 * @return void
 */
function validar() {

    let verificacion = true // bandera

    let nombre = document.getElementById('nombre')
    let apellido = document.getElementById('apellido')
    let emailIngresado = document.getElementById('email')
    let billetasVirtuales = document.getElementById('billeterasVirtuales')

    // parseInt == intval
    let mes = parseInt(document.getElementById('mes').value)
    let anio = parseInt(document.getElementById('anio').value)
    let numTarjeta = parseInt(document.getElementById('numTarjeta').value)
    let codSeguridad = parseInt(document.getElementById('codSeguridad').value)
    let montoPesos = parseInt(document.getElementById('monto').value)

    // cuando de error
    function printearInput(id) {
        let inputAColorear = document.getElementById(id)
        inputAColorear.style.borderColor = 'red'
        inputAColorear.style.backgroundColor = '#d9dede'
    }

    // resetear el estilo
    function desPrintearInput(id) {
        let inputSinColor = document.getElementById(id)
        inputSinColor.style.borderColor = ''
        inputSinColor.style.backgroundColor = ''
    }

    if (!expresiones.nombre.test(nombre.value)) {
        printearInput('nombre')
        verificacion = false
    } else {
        desPrintearInput('nombre')
    }

    if (!expresiones.apellido.test(apellido.value)) {
        printearInput('apellido')
        verificacion = false
    } else {
        desPrintearInput('apellido')
    }

    if (!expresiones.email.test(emailIngresado.value)) {
        printearInput('email')
        verificacion = false
    } else {
        desPrintearInput('email')
    }

    if (billetasVirtuales.value === '') {
        printearInput('billeterasVirtuales')
        verificacion = false
    } else {
        desPrintearInput('billeterasVirtuales')
    }

    if (!expresiones.numerosTarjeta.test(numTarjeta)) {
        printearInput('numTarjeta')
        verificacion = false
    } else {
        desPrintearInput('numTarjeta')
    }

    if (!expresiones.codigoSeguridad.test(codSeguridad)) {
        printearInput('codSeguridad')
        verificacion = false
    } else {
        desPrintearInput('codSeguridad')
    }

    if (!fechaValida(mes, anio)) {
        printearInput('mes')
        printearInput('anio')
        verificacion = false

    } else {
        desPrintearInput('mes')
        desPrintearInput('anio')
        let fechaIngresada = new Date(anio, mes - 1)
        let fechaActual = new Date()

        if (fechaIngresada < fechaActual) {
            printearInput('mes')
            printearInput('anio')
            verificacion = false
        }
    }

    if (!expresiones.montoCash.test(montoPesos)) {
        printearInput('monto')
        verificacion = false
    } else {
        desPrintearInput('monto')
    }

    let msjFinal = document.getElementById('agradecimiento')

    if (verificacion) {
        msjFinal.innerHTML = `Gracias por el aporte, ${nombre.value}!`
        msjFinal.style.display = 'block'
    } else {
        msjFinal.style.display = 'none'
    }

    return verificacion
}

document.addEventListener('DOMContentLoaded', agregarMsjDiv, validar, aumentarPlata)

/**
 * esta dispara los errores de los inputs
 * document.addEventListener('DOMContentLoaded', () => {
    agregarMsjDiv()
    validar()
    aumentarPlata()
})
 */