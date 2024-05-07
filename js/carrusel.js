document.addEventListener("DOMContentLoaded", function () {

    let logos = document.querySelectorAll(".sponsors div")
    let btnAtras = document.getElementById("previo")
    let btnAdelante = document.getElementById("siguiente")
    let acum = 0 // iterar

    function mostrarImg() {
        logos.forEach((img, i) => {
            if (i == acum) {
                img.style.display = "block"
            } else {
                img.style.display = "none"
            }
        });
    }

    function avanzarDiapo() {
        acum++
        if (acum >= logos.length) {
            acum = 0
        }
        mostrarImg()
    }

    function retrocederDiapo() {
        acum--
        if (acum < 0) {
            acum = logos.length - 1
        }
        mostrarImg()
    }

    btnAdelante.addEventListener("click", avanzarDiapo)
    btnAtras.addEventListener("click", retrocederDiapo)

    function iniciarCarrousel() {
        tiempo = setInterval(avanzarDiapo, 3000)
    }

    iniciarCarrousel()
})