let containers = document.querySelectorAll('.container-galleriaModal') // todo lo que contenga esa clase

// para los containers hay que iterar
containers.forEach((container, i) => {
    let btnAnterior = document.getElementById('atrasBtn' + (i + 1))
    let btnSiguiente = document.getElementById('siguienteBtn' + (i + 1))

    btnAnterior.addEventListener('click', function () {
        container.scrollTo({
            left: container.scrollLeft - 500,
            behavior: 'smooth'
        })
    })

    btnSiguiente.addEventListener('click', function () {
        container.scrollTo({
            left: container.scrollLeft + 500,
            behavior: 'smooth'
        })
    })
})

