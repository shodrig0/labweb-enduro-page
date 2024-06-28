function cargarHeader() {
  fetch("../header.html")
    .then((request) => request.text())
    .then((dataPage) => {
      document.getElementById("header").innerHTML = dataPage
      fondoRandom()
    })
    .catch((error) => {
      console.error("No se pueden cargar los diseños: ", error)
    })
}

cargarHeader();

function cargarFooter() {
  fetch("../footer.html")
    .then((request) => request.text())
    .then((dataPage) => {
      document.getElementById("footer").innerHTML = dataPage
    })
    .catch((error) => {
      console.error("No se pueden cargar los diseños: ", error)
    })
}

cargarFooter()


/**
 * Cambia el fondo del header, con respecto al html en el que
 */
function fondoRandom() {
  const bgRandom = document.querySelector(".bg-img")
  const bgRuta = window.location.pathname

  let bgCambianteClase;
  if (bgRuta.includes("/index.html")) {
    bgCambianteClase = "index-bg"
  } else if (bgRuta.includes("/galeria.html")) {
    bgCambianteClase = "index-bg"
  } else if (bgRuta.includes("/sobreEnduro.html")) {
    bgCambianteClase = "index-bg"
  } else if (bgRuta.includes("/sobreMi.html")) {
    bgCambianteClase = "sobreEnd-bg"
  } else if (bgRuta.includes("/contacto.html")) {
    bgCambianteClase = "sobreEnd-bg"
  } else if (bgRuta.includes("/game.html")) {
    bgCambianteClase = "sobreEnd-bg"
  }

  bgRandom.classList.add(bgCambianteClase)
}

fondoRandom()

// document.addEventListener("DOMContentLoaded", fondoRandom);

/**
 * Explicacion:
 *
 * fetch API: sirve para pedirle requests al browser (solicitudes HTTP)
 * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * --
 * .then(soli) => soli.text() (promises): si la solicitud esta bien y es devuelta correctamente, se transforma en texto lo del html
 * Promises (promesas) son objetos que finalizan una operación asincrónica y retornan su valor. En este, uso doble .then() ya que son chained promises, que el primer argumento que pasa son las request convertidas a texto (se llaman callbacks). Cada promesa retorna una objeto generado. También el catch es una promise en caso de ocurrir error
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * --
 * .then(datPage) => ...... ).innerHTML: acá se vuelve a transformar el texto a contenido html con innerHTML, en la etiqueta que tenga el id de "header" o "footer"
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
 * --
 * .catch((error ........)): si hay un fallo, retornará el error console.error()
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
 */
