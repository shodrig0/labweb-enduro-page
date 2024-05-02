function cargarTemplate() {
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;
    })
    .catch((error) => {
      console.error("No se pueden cargar los diseños: ", error);
    });
}

cargarTemplate();

/**
 * Explicacion:
 *
 * fetch API: sirve para pedirle requests al browser
 *
 */
