// Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;   
}

Seguro.prototype.cotizarSeguro = function() {
    /*
        1 = Americano 1.15
        2 = Americano 1.05
        3 = Europeo 1.35
    */

    let cantidad;
    const base = 2000;

    switch(this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    // Calcular diferencia de años con el año actual
    const diferencia = new Date().getFullYear() - this.year;

    // Cada año que el auto sea más antiguo, el costo va a reducirse un 3%
    cantidad -= (diferencia * 0.03) * cantidad;

    /* 
        Si el seguro es básico se multiplica por un 30% más
        Si el seguro es completo se multiplica por un 50% más
    */

    if(this.tipo === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }

    return cantidad;
}

function UI() {

}

// Llenar select de los años
UI.prototype.llenarSelect = () => {
    const max = new Date().getFullYear(),
          min = max - 20;

          const selectYear = document.querySelector('#year');

          for(let i = max; i > min; i--) {
            let option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            selectYear.appendChild(option);
          }
}

UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');

    if(tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 2000)
}

UI.prototype.mostrarResultado = (seguro, total) => {

    const { marca, year, tipo} = seguro;

    let nombreMarca;
    switch(marca) {
        case '1':
            nombreMarca = 'Americano';
            break;
        case '2':
            nombreMarca = 'Asiático';
            break;
        case '3':
            nombreMarca = 'Europeo';
            break;
        default:
            break;
    }

    // Crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu resumen</p>
        <p class="font-bold">Marca: <span class="font-normal"> ${nombreMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal"> ${year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado');

    // Mostrar el spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    }, 2000)

}

// Instanciar UI
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarSelect(); // Llena el select con los años
})

eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    const mensajeAlerta = document.querySelector('.mensaje');

    if(marca === '' || year === '' || tipo === '') {

        // Comprobar si no existe el mensaje de alerta
        if(!mensajeAlerta) {
            ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        }
        
        return;
    }

    ui.mostrarMensaje('Cotizando...', 'exito');

    // Ocultar cotizaciones previas
    const resultados = document.querySelector('#resultado div')
    if(resultados != null) {
        resultados.remove();
    }

    // Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    // Utilizar prototype para calcular el seguro
    ui.mostrarResultado(seguro, total)

}
