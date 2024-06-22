/**
 * https://developer.mozilla.org/es/docs/Web/API/HTMLCanvasElement/getContext
 * usar canvas -> pantalla
 */

const motoFigura = document.getElementById("moto");
const contexto = motoFigura.getContext("2d"); // crea el obj
const sonidoCorte = document.getElementById("corte");

// variables
let puntaje;
let txtPuntaje;
let mayorPuntaje;
let txtMayorPuntaje;
let moto;
let gravedad;
let colCactusRocas = [];
let velocidad;
let controles = {};

/**
 * https://developer.mozilla.org/es/docs/Web/API/Event
 */

document.addEventListener("keydown", function (evento) {
    controles[evento.code] = true;
    if (controles["KeyS"] || controles["ShiftLeft"]) {
        sonidoCorte.currentTime = 0;
        sonidoCorte.play();
    }
});

document.addEventListener("keyup", function (evento) {
    controles[evento.code] = false;
});

/**
 * es mejor manejar objs
 */
class Moto {
    constructor(posX, posY, ancho, alto, color) {
        this.posX = posX;
        this.posY = posY;
        this.ancho = ancho;
        this.alto = alto;
        this.color = color;

        this.velY = 0;
        this.saltoFuerza = 15;
        this.alturaVerdadera = alto;
        this.noAlPiso = false;
        this.contadorS = 0;
    }

    Animar() {
        if (controles["KeyW"]) {
            this.Saltar();
        } else {
            this.contadorS = 0;
        }

        this.posY += this.velY;

        if (this.posY + this.alto < motoFigura.height) {
            this.velY += gravedad;
            this.noAlPiso = false;
        } else {
            this.velY = 0;
            this.noAlPiso = true;
            this.posY = motoFigura.height - this.alto;
        }

        this.Dibujo();
    }

    Saltar() {
        if (this.noAlPiso && this.contadorS == 0) {
            this.contadorS = 1;
            this.velY = -this.saltoFuerza;
        } else if (this.contadorS > 0 && this.contadorS < 15) {
            this.contadorS++;
            this.velY = -this.saltoFuerza - this.contadorS / 50;
        }
    }

    /**
     * https://developer.mozilla.org/es/docs/Web/API/CanvasRenderingContext2D/beginPath
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle
     * https://developer.mozilla.org/es/docs/Web/API/CanvasRenderingContext2D/fillRect
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/closePath
     */

    Dibujo() {
        contexto.beginPath();
        contexto.fillStyle = this.color;
        contexto.fillRect(this.posX, this.posY, this.ancho, this.alto);
        contexto.closePath();
    }
}

class Obstaculos {
    constructor(posX, posY, ancho, alto, color) {
        this.posX = posX;
        this.posY = posY;
        this.ancho = ancho;
        this.alto = alto;
        this.color = color;

        this.velX = -velocidad;
    }

    Generar() {
        this.posX += this.velX;
        this.Dibujo();
        this.velX = -velocidad;
    }

    Dibujo() {
        contexto.beginPath();
        contexto.fillStyle = this.color;
        contexto.fillRect(this.posX, this.posY, this.ancho, this.alto);
        contexto.closePath();
    }
}

class Txt {
    constructor(txt, posX, posY, alineacion, color, fontSize) {
        this.txt = txt;
        this.posX = posX;
        this.posY = posY;
        this.alineacion = alineacion;
        this.color = color;
        this.fontSize = fontSize;
    }

    Dibujo() {
        contexto.beginPath();
        contexto.fillStyle = this.color;
        contexto.font = this.fontSize + "px monospace";
        contexto.textAlign = this.alineacion;
        contexto.fillText(this.txt, this.posX, this.posY);
        contexto.closePath();
    }
}

function GeneracionObstaculos() {
    let tamanio = numerosRandoms(20, 70);
    let tipo = numerosRandoms(0, 1);
    let obstaculo = new Obstaculos(motoFigura.width + tamanio, motoFigura.height - tamanio, tamanio, tamanio, '#2484E4');

    if (tipo == 1) {
        obstaculo.y -= moto.originalHeight - 10;
    }
    colCactusRocas.push(obstaculo);
}

function numerosRandoms(min, max) {
    let resultado = Math.round(Math.random() * (max - min) + min);
    return resultado;
}

function Start() {
    motoFigura.width = window.innerWidth;
    motoFigura.height = window.innerHeight;

    contexto.font = "20px monospace";

    velocidad = 3;
    gravedad = 1;
    puntaje = 0;
    mayorPuntaje = 0;

    if (localStorage.getItem("mayorPuntaje")) {
        mayorPuntaje = localStorage.getItem("mayorPuntaje");
    }

    moto = new Moto(25, 0, 50, 50, "#135da8");

    txtPuntaje = new Txt("Puntaje: " + puntaje, 25, 25, "left", "#212121", "20");
    txtMayorPuntaje = new Txt("Puntaje max: " + mayorPuntaje, motoFigura.width - 25, 25, "right", "#212121", "20");

    requestAnimationFrame(Generar)
}

let cronometro = 200;
let cronometroSpaw = cronometro;

function Generar() {
    requestAnimationFrame(Generar);
    contexto.clearRect(0, 0, motoFigura.width, motoFigura.height);

    cronometroSpaw--;
    if (cronometroSpaw <= 0) {
        GeneracionObstaculos();
        console.log(colCactusRocas);
        cronometroSpaw = cronometro - velocidad * 8;

        if (cronometroSpaw < 60) {
            cronometroSpaw = 60;
        }
    }

    for (let i = 0; i < colCactusRocas.length; i++) {
        let obs = colCactusRocas[i];

        if (obs.posX + obs.ancho < 0) {
            colCactusRocas.splice(i, 1);
        }

        if (moto.posX < obs.ancho && moto.posX + moto.ancho > obs.posX && moto.posY < obs.posY + obs.alto && moto.posY + moto.alto > obs.posY) {
            colCactusRocas = [];
            puntaje = 0;
            cronometroSpaw = cronometro;
            velocidad = 3;
            window.localStorage.setItem("mayorPuntaje", mayorPuntaje);
        }
        obs.Generar();
    }
    moto.Animar();
    puntaje++;
    txtPuntaje.txt = "Puntaje: " + puntaje;
    txtPuntaje.Dibujo();

    if (puntaje > mayorPuntaje) {
        mayorPuntaje = puntaje;
        txtMayorPuntaje.txt = "Puntaje max: " + mayorPuntaje;
    }

    txtMayorPuntaje.Dibujo();

    velocidad += 0.003;
}

Start();