consoleText(
  ["Bienvenidos", "amantes del Enduro", "fans del off-road"],
  "texto",
  ["#e81717", "#1641cc", "#129906"]
);

function consoleText(words, id, colors) {
  if (colors === undefined) colors = ["#fff"];
  let contabilizador = 1;
  let i = 1;
  let banderaTiempo = false;
  let target = document.getElementById(id);
  target.setAttribute("style", "color:" + colors[0]);
  window.setInterval(function () {
    if (contabilizador === 0 && !banderaTiempo) {
      banderaTiempo = true;
      target.innerHTML = words[0].substring(0, contabilizador);
      window.setTimeout(function () {
        let usedColor = colors.shift();
        colors.push(usedColor);
        let usedWord = words.shift();
        words.push(usedWord);
        i = 1;
        target.setAttribute("style", "color:" + colors[0]);
        contabilizador += i;
        banderaTiempo = false;
      }, 1000);
    } else if (contabilizador === words[0].length + 1 && !banderaTiempo) {
      banderaTiempo = true;
      window.setTimeout(function () {
        i = -1;
        contabilizador += i;
        banderaTiempo = false;
      }, 1000);
    } else if (!banderaTiempo) {
      target.innerHTML = words[0].substring(0, contabilizador);
      contabilizador += i;
    }
  }, 150);
}
