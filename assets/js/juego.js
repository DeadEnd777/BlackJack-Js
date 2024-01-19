/*
Usamos el patron modulo para organizar, dividir y encapsular el codigo en pequeñas partes y cada una realice una tarea en especifica, los modulos se pueden comunicar entre si a travez de interfaces definidas.
Al encapsular el codigo ocultamos los detalles internos y solo exponemos las partes esenciales para su uso externo
*/
// Patron modulo
const modulo = (() => {
  // modo estricto (recomendable cuando se trabaja con modulos)
  "use strict";

  let deck = [];

  const tipos = ["C", "D", "H", "S"],
    especiales = ["A", "J", "Q", "K"];

  let puntos_jugadores = [];

  // Referencias html
  const label_small = document.querySelectorAll("small"),
    btn_pedir = document.getElementById("PedirCarta"),
    btn_detener = document.getElementById("DetenerMano"),
    btn_juego_nuevo = document.getElementById("JuegoNuevo"),
    div_cartas = document.querySelectorAll(".divCartas");

  // Inicializar el juego
  const iniciar_juego = (num_jugadores = 2) => {
    deck = CrearDeck();
    puntos_jugadores = [];
    for (let i = 0; i < num_jugadores; i++) {
      puntos_jugadores.push(0);
    }
    label_small.forEach((elem) => (elem.innerText = 0));

    div_cartas.forEach((elem) => (elem.innerText = ''));

    btn_pedir.disabled = false;
    btn_detener.disabled = false;
  };

  // Crea una nueva baraja de cartas
  const CrearDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let tipo of tipos) {
        deck.push(i + tipo);
      }
    }
    for (let tipo of tipos) {
      for (let especial of especiales) {
        deck.push(especial + tipo);
      }
    }
    return deck;
  };

  const ObtenerCarta = () => {
    if (deck.length === 0) {
      Swal.fire({
        title: "El array está vacío!",
        icon: "error",
      });
    }
    const indiceAleatorio = Math.floor(Math.random() * deck.length),
      carta = deck[indiceAleatorio];
    deck.splice(indiceAleatorio, 1);
    return carta;
  };

  const ValorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1);
    const puntos =
      isNaN(valor) && valor === "A" ? 11 : !isNaN(valor) ? valor * 1 : 10;
    return puntos;
  };

  const acumular_puntos = (carta, turno) => {
    puntos_jugadores[turno] = puntos_jugadores[turno] + ValorCarta(carta);
    label_small[turno].innerText = puntos_jugadores[turno];
    return puntos_jugadores[turno];
  };

  const crear_carta = (carta, turno) => {
    const img_carta = document.createElement("img");
    img_carta.src = `assets/img/cartas/${carta}.png`;
    img_carta.classList.add("lg:w-1/6");
    img_carta.classList.add("md:w-1/5");
    img_carta.classList.add("sm:w-1/5");
    img_carta.classList.add("xs:w-1/3");
    img_carta.classList.add("p-6");
    div_cartas[turno].append(img_carta);
  };

  const ganador = () => {
    const [puntos, puntos_computadora] = puntos_jugadores;
    setTimeout(() => {
      if (puntos_computadora === puntos) {
        Swal.fire({
          title: "Empate",
          icon: "info",
        });
      } else if (puntos_computadora > 21) {
        Swal.fire({
          title: "Ganaste",
          icon: "success",
        });
      } else if (puntos > 21) {
        Swal.fire({
          title: "Tú Pierdes",
          icon: "warning",
        });
      } else {
        Swal.fire({
          title: "Tú Pierdes",
          icon: "warning",
        });
      }
    }, 200);
  };

  // Turno de la computadora
  const computadora = (puntos) => {
    let puntos_computadora = 0;
    do {
      const carta = ObtenerCarta();
      puntos_computadora = acumular_puntos(carta, puntos_jugadores.length - 1);
      crear_carta(carta, puntos_jugadores.length - 1);
    } while (puntos_computadora < puntos && puntos <= 21);
    ganador();
  };

  //eventos
  btn_pedir.addEventListener("click", () => {
    const carta = ObtenerCarta();
    const puntos_jugador = acumular_puntos(carta, 0);
    crear_carta(carta, 0);
    if (puntos_jugador > 21) {
      btn_pedir.disabled = true;
      btn_detener.disabled = true;
      computadora(puntos_jugador);
    } else if (puntos_jugador === 21) {
      btn_pedir.disabled = true;
      btn_detener.disabled = true;
      computadora(puntos_jugador);
    }
  });

  btn_detener.addEventListener("click", () => {
    btn_pedir.disabled = true;
    btn_detener.disabled = true;
    computadora(puntos_jugadores[0]);
  });

  btn_juego_nuevo.addEventListener("click", () => {
    iniciar_juego();
  });
  return {
    nuevo_juego: iniciar_juego
  };
})();
