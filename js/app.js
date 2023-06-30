const criptomonedasSelect = document.querySelector('#criptomonedas');

document.addEventListener('DOMContentLoaded', () => {
  consultarCriptomonedas();

})

function consultarCriptomonedas() {
  const url = ` https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`
}