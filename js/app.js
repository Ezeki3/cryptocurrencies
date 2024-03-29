const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedasSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
  moneda: '',
  criptomoneda: ''
}

// Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve =>{
  resolve(criptomonedas);

});

document.addEventListener('DOMContentLoaded', () => {
  consultarCriptomonedas();

  formulario.addEventListener('submit', submitFormulario);

  criptomonedasSelect.addEventListener('change', leerValor);
  monedasSelect.addEventListener('change', leerValor);
})

async function consultarCriptomonedas() {
  const url = ` https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`

  // fetch(url)
  //   .then(respuesta => respuesta.json())
  //   .then(resultado => obtenerCriptomonedas(resultado.Data))
  //   .then(criptomonedas => selectCriptomonedas(criptomonedas))

  try {
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();
    const criptomonedas = await obtenerCriptomonedas(resultado.Data);
    selectCriptomonedas(criptomonedas);

  } catch (error) {
    console.log(error);
  }
}

function selectCriptomonedas(criptomonedas){
  criptomonedas.forEach( cripto => {
    const { FullName, Name} = cripto.CoinInfo;

    const option = document.createElement('option');
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e){
  objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e){
  e.preventDefault();

  // Validacion
  const {moneda, criptomoneda} = objBusqueda;
  
  if (moneda === '' || criptomoneda === '') {
    mostrarAlerta('Ambos campos son obligatorios');
    return;
  }

  // Consultamos la API con los resultados
  consultarAPI();

}

function mostrarAlerta(mensaje){
  
  const existeError = document.querySelector('.error');

  if (!existeError) {
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');

    // Mensaje de error
    divMensaje.textContent = mensaje;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

async function consultarAPI(){
  const { moneda, criptomoneda }= objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  // setTimeout(() => {
  //   //metemos el fetch dentro del setTimeout para mostrar nuestro spinner
  //   fetch(url)
  //   .then(respuesta => respuesta.json())
  //   .then( cotizacion =>{
  //     mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
  //   })
  // }, 2000);

  try {
    const respuesta = await fetch(url);
    const cotizacion = await respuesta.json();
    mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
  } catch (error) {
    console.log(error);
  }
}

function mostrarCotizacionHTML(cotizacion){

  limpiarHmtl();

  const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

  const precio = document.createElement('p');
  precio.classList.add('precio');
  precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

  const precioAlto = document.createElement('p');
  precioAlto.innerHTML = `El precio más alto del dia: <span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement('p');
  precioBajo.innerHTML = `El precio más bajo del dia: <span>${LOWDAY}</span>`;

  const ultimasHoras = document.createElement('p');
  ultimasHoras.innerHTML = `Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

  const utlimaActualizacion = document.createElement('p');
  utlimaActualizacion.innerHTML = `Ultima actualización: <span>${LASTUPDATE}</span>`;
  
  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(utlimaActualizacion);
}

function limpiarHmtl(){
  while(resultado.firstChild){
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarSpinner(){
  limpiarHmtl();

  const spinner = document.createElement('div');
  spinner.classList.add("spinner");

  spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  `;

  resultado.appendChild(spinner);
}