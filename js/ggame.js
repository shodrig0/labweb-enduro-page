const moto = document.getElementById('moto')
const cactus = document.getElementById('cactus')
const rocas = document.getElementById('rocas')
const derrota = document.querySelector('.game-over')
const play = document.getElementById('playbtn')
const puntaje = document.getElementById('puntaje')
const reinicio = document.getElementById('restartbtn')
const home = document.getElementById('homebtn')
const guardarNombre = document.getElementById('guardar-nombre')
const nombreInput = document.getElementById('nombre')
const guardarBtn = document.getElementById('guardar-btn')

let colision
let juegoIniciado = false
let velocidadY = 2 // velocidad en y (vertical)
let gravedad = 1.2 // ajustar
let saltando = false
let enSuelo = true
let tiempoInicio = 0;
let intervaloT

function iniciarJuego() {
    if (juegoIniciado) return // para evitar que el juego se inicie mas de una vez
    juegoIniciado = true
    derrota.style.display = 'none'
    play.style.display = 'none'
    reinicio.style.display = 'none'

    moto.style.top = '215px'
    moto.classList.add('moto-funcionando')
    cactus.style.animation = 'obstaculo 5s infinite linear'
    cactus.style.animation = '0px'
    rocas.style.animation = 'obstaculo 4s infinite linear'
    rocas.style.right = '0px'
    tiempoInicio = Date.now();
    intervaloT = setInterval(actualizarTiempo, 1000);
    actualizarJuego()
}

function actualizarJuego() {

    velocidadY += gravedad

    let motoTop = parseInt(window.getComputedStyle(moto).getPropertyValue('top'))
    let nuevaPosicionY = motoTop + velocidadY

    let contenedorAltura = document.querySelector('.container').offsetHeight
    let motoAltura = moto.offsetHeight

    if (nuevaPosicionY > contenedorAltura - motoAltura) {
        nuevaPosicionY = contenedorAltura - motoAltura
        velocidadY = 0
        enSuelo = true
    } else {
        enSuelo = false
    }

    moto.style.top = nuevaPosicionY + 'px'

    if (motoColision(moto, cactus, 40, 20, 0, 5)) {
        detenerJuego()

    } else if (motoColision(moto, rocas, 20, 30, 0, 5)) {
        detenerJuego()
    } else {
        requestAnimationFrame(actualizarJuego)
    }

}

function reiniciarJuego() {
    location.reload() // recarga la pagina
}

function saltar() {
    if (enSuelo && !saltando) {
        moto.classList.add('salto')
        saltando = true
        enSuelo = false
        velocidadY = -25

        setTimeout(function () {
            moto.classList.remove('salto')
            saltando = false
        }, 300)
    }
}

function detenerAnimaciones() {
    moto.classList.remove('moto-funcionando')
    moto.style.animation = 'none'

    const cactusLeft = window.getComputedStyle(cactus).getPropertyValue('left')
    cactus.style.animation = 'none'
    cactus.style.left = cactusLeft

    const rocasLeft = window.getComputedStyle(rocas).getPropertyValue('left')
    rocas.style.animation = 'none'
    rocas.style.left = rocasLeft
}

function detenerJuego() {
    clearInterval(colision)
    clearInterval(intervaloT)
    detenerAnimaciones()
    derrota.style.display = 'block'
    reinicio.style.display = 'block'
    guardarNombre.style.display = 'block';
    juegoIniciado = false
}

function motoColision(moto, cactus, arriba, derecha, abajo, izquierda) {
    let rectMoto = moto.getBoundingClientRect()
    let rectCactus = cactus.getBoundingClientRect()

    return (
        (rectMoto.top + rectMoto.height - abajo) > rectCactus.top &&
        (rectMoto.top + arriba < rectCactus.top + rectCactus.height) &&
        (rectMoto.left + rectMoto.width - derecha) > rectCactus.left &&
        (rectMoto.left + izquierda < rectCactus.left + rectCactus.width)
    )
}

function actualizarTiempo() {
    let tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 15.45) // cualquiera dividir mas numero
    puntaje.innerHTML = `${tiempoTranscurrido}`
}

play.addEventListener('click', function () {
    if (!juegoIniciado) {
        iniciarJuego()
        juegoIniciado = true
    }
})
reinicio.addEventListener('click', function () {
    reiniciarJuego()
})

guardarBtn.addEventListener('click', function () {
    const nombre = nombreInput.value.trim();
    if (nombre) {
        const resultados = JSON.parse(localStorage.getItem('resultados')) || [];
        resultados.push({ nombre: nombre, tiempo: puntaje.innerHTML });
        localStorage.setItem('resultados', JSON.stringify(resultados));
        alert('Resultado guardado')
    } else {
        alert('Por favor ingrese su nombre!!');
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === ' ' && juegoIniciado) {
        saltar()
    }
})