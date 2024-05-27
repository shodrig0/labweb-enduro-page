// funcionamiento del juego

/**
 * loop del juego
 */

let tiempo = new Date(); // inicializar el tiempo actual
let acumTiempo = 0; // guardamos el tiempo en segudnos que transcurren entre fotogramas

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState#values
 *
 * comprobar si carga todo el elemento html
 * si cargó, se llama a la función Init() esperando un 1 segundo
 * sino se ejecuta el DOMContentLoaded
 * evento DOM de js que se ejecuta cuando se carga todo el html pero antes de que carguen scripts o imgs
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
 */
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  setTimeout(iniciar, 1);
} else {
  document.addEventListener("DOMContentLoaded", iniciar);
}

/**
 * la funcion utiloizada cuando el html carga
 * se reinicia la variable tiempo
 */
function iniciar() {
  tiempo = new Date();
  start();
  loop();
}

function loop() {
  acumTiempo = (new Date() - tiempo) / 1000;
  tiempo = new Date();
  desplazamiento();
  requestAnimationFrame(loop);
}

/**
 * logica
 */

// declaracion de variables
// stats sacadas del dinosaurio, modificar si generan provblemas con el render de la moto
let terrenoY = 22;
let velocidadY = 0;
let impulso = 900;
let gravedad = 2500;

let motoPosX = 42;
let motoPosY = terrenoY;

let terrenoX = 0;
let velocidadEscenario = 1280 / 3;
let velocidadJuego = 1;
let puntaje = 0;

let parado = false; // juego -- usar en desplazamiento()
let saltando = false; // moto

let tiempoCactusRocas = 2;
let tiempoCactusRocasMin = 0.7;
let tiempoCactusRocasMax = 1.8;
let cactusRocasPosicionY = 16;
let colCactusRocas = [];

/**
 * inicializar juego
 * se usa document.querySelector para seleccionar las classes del css
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 */

let container;
let moto;
let txtDelPuntaje;
let terreno;
let derrota;

function start() {
  derrota = document.querySelector(".game-over");
  terreno = document.querySelector(".piso");
  container = document.querySelector(".container");
  txtDelPuntaje = document.querySelector(".puntaje");
  moto = document.querySelector(".moto");
  document.addEventListener("click", jugabilidad);
}

// funcion para desplazarse, desplaza el fondo
function desplazamiento() {
  if (parado) return;

  moverMoto();
  moverTerreno();
  creacionObstaculo();
  moverObstaculos();
  //detectorDeColision()

  velocidadY = velocidadY - gravedad * acumTiempo;
}

// mecanica juego para saltar hace falta o ejecuto directo?
function jugabilidad() {
  saltar();
}

// cada vez que salte la animación debe parar
function saltar() {
  if (motoPosY == terrenoY) {
    saltando = true;
    velocidadY = impulso;
    moto.classList.remove("moto-funcionando");
  }
}

/**
 * mover la moto en y
 * moto.style.bottom actualiza bottom (abajo) de css
 * + px es lo que mueve a la moto en el display
 */
function moverMoto() {
  motoPosY += velocidadY * acumTiempo;
  if (motoPosY < terrenoY) {
    motoEnTerreno();
  }
  moto.style.bottom = motoPosY + "px";
}

/**
 * cuando la moto esté en tierra se le asigna el valor del terreno asi está en la misma posicion del suelo
 * la velocidad se asigna en 0 para parar el movimiento vertical
 */
function motoEnTerreno() {
  motoPosY = terrenoY;
  velocidadY = 0;

  // si la variable saltando es false, significa que está en tierra y ejecuta la animacion
  if (saltando) {
    moto.classList.add("moto-funcionando");
  }
  saltando = false;
}

/**
 * mover el terreno
 * la primera operacion mueve el piso hacia la izq
 */
function moverTerreno() {
  terrenoX += calcDesplazamientoMoto();
  terreno.style.left = -(terrenoX % container) + "px";
}

/**
 * como calcular el desplazamiento
 * https://www.youtube.com/watch?v=cYNrWCWgieU
 */
function calcDesplazamientoMoto() {
  resultado = velocidadEscenario * acumTiempo * velocidadJuego; // creo que es asi

  return resultado;
}

/**
 * chocar
 * agregar un frame cuando pase esto
 */
function chocar() {
  moto.classList.remove("moto-funcionando");
  parado = true;
}

function tiempoCreacionObstaculo() {
  tiempoCactusRocas -= acumTiempo;
  if (tiempoCactusRocas <= 0) {
    creacionObstaculo();
  }
}

/**
 * https://desarrolloweb.com/articulos/763.php
 * obstaculoC es cactus
 */
function creacionObstaculo() {
  let obstaculo = document.createElement("div");
  container.appendChild(obstaculo); // agrego al container el obstaculo, declarado en la variable obstaculo
  obstaculo.classList.add("cactus");
  if (Math.random() > 0.5) {
    obstaculo.classList.add("rocas");
  }
  obstaculo.motoPosX = container;
  obstaculo.style.left = container.clientWidth + "px";

  // agrego al array
  colCactusRocas.push(obstaculo);
}

// mover rocas o cactus
// itero el array en decrecimiento
// como mostrar y confirmar que ya se pasaron por encima los otros obstaculos
function moverObstaculos() {
  for (let i = colCactusRocas.length - 1; i >= 0; i--) {
    if (colCactusRocas[i].offsetLeft < -colCactusRocas[i].offsetWidth) {
      colCactusRocas[i].parentNode.removeChild(colCactusRocas[i]);
      colCactusRocas.splice(i, 1);
      puntos();
    } else {
      colCactusRocas[i].style.left =
        colCactusRocas[i].offsetLeft - calcDesplazamientoMoto() + "px";
      colCactusRocas[i].style.left = colCactusRocas[i].motoPosX + "px";
    }
  }
}

function puntos() {
  puntaje++;
  txtDelPuntaje.innerText = puntaje;

  if (puntaje == 5) {
    velocidadJuego = 1;
    container.classList.add("dia");
  } else if (puntaje == 15) {
    velocidadJuego = 3;
    container.classList.add("noche");
  }
  terreno.style.animationDuration = 3 / velocidadJuego + "s";
}

function gameOver() {
  chocar();
  derrota.style.display = "block";
}
