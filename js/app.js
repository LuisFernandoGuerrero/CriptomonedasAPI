const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// Crear promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas)
})

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor)
    monedaSelect.addEventListener('change', leerValor)
});

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => obtenerCriptomonedas(datos.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = `${FullName} (${Name})`;
        criptomonedasSelect.appendChild(option)
    });
}

// Escribir en el objeto
function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    // Validar campos
    const { moneda, criptomoneda } = objBusqueda;
    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // Consultar la API con los resultados.
    consultarAPI();
}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    mostrarSpinner();
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarAlerta(mensaje) {
    const divMensaje = document.createElement('DIV')
    const existeAlerta = document.querySelector('.error')

    if (!existeAlerta) {
        divMensaje.classList.add('error');

        // Mensaje de error 
        divMensaje.textContent = mensaje;

        formulario.appendChild(divMensaje)

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

function mostrarCotizacionHTML(cotizacion) {
    limpiarHTML();
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;
    const existeConsulta = document.querySelector('.precio')

    if (!existeConsulta) {
        const precio = document.createElement('P')
        precio.classList.add('precio')
        precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

        const precioMax = document.createElement('P')
        precioMax.innerHTML = `El precio maximo de hoy es: <span>${HIGHDAY}</span>`;

        const precioMin = document.createElement('P')
        precioMin.innerHTML = `El precio minimo de hoy es: <span>${LOWDAY}</span>`;

        const ultimasHoras = document.createElement('P')
        ultimasHoras.innerHTML = `Ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

        const ultimaActualizacion = document.createElement('P')
        ultimaActualizacion.innerHTML = `Ultimas actualización: <span>${LASTUPDATE}%</span>`;

        resultado.appendChild(precio)
        resultado.appendChild(precioMax)
        resultado.appendChild(precioMin)
    }
}

function limpiarHTML(params) {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('DIV')
    spinner.classList.add('spinner')
    spinner.innerHTML = `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
        `

    resultado.appendChild(spinner)
}