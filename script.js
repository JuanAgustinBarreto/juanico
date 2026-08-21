/* =======================================================
   1) CONFIGURACIÓN — EDITÁ SOLO ESTO
   La foto va en:  img/abuelo.jpg
   ======================================================= */
const CONFIG = {
  nombre: "Juanico",
  fecha: "19 de diciembre",
  hora: "21:00 hs",
  lugar: "Salón La Familia",
  direccion: "Feliciano 443",
  telefono: "5493435451818", // sin +, sin espacios
  valor: "$45.000",
  alias: "los80dejuanico",
};

// Fecha y hora del evento para el contador (año, mes-1, día, hora, minuto)
const FECHA_EVENTO = new Date(2026, 11, 19, 21, 0, 0);

/* =======================================================
   2) ELEMENTOS DEL DOM
   ======================================================= */
const $ = (id) => document.getElementById(id);

const pantalla = $("bienvenida");
const invitacion = $("invitacion");
const btnAbrir = $("btn-abrir");
const btnConfirmar = $("btn-confirmar");
const cuenta = $("cuenta");
const cuentaFinal = $("cuenta-final");
const musica = $("musica");

const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =======================================================
   3) FUNCIONES
   ======================================================= */

/** Vuelca los datos de CONFIG en la tarjeta */
function cargarDatos() {
  $("nombre").textContent = CONFIG.nombre;
  $("fecha").textContent = CONFIG.fecha.toUpperCase();
  $("hora").textContent = CONFIG.hora;
  $("lugar").textContent = CONFIG.lugar;
  $("direccion").textContent = CONFIG.direccion;
  $("valor").textContent = CONFIG.valor;
}

/** Transición de la pantalla de bienvenida a la invitación */


function abrirInvitacion() {
  pantalla.classList.add("saliendo");
  invitacion.classList.remove("oculto");
  invitacion.setAttribute("aria-hidden", "false");

  // Iniciar música al tocar "APRETÁ AQUÍ"
  musica.volume = 0.60;
  musica.play().catch((error) => {
    console.log("No se pudo iniciar la música:", error);
  });

  window.setTimeout(() => {
    pantalla.classList.add("oculto");

    invitacion.scrollIntoView({
      behavior: reducirMovimiento ? "auto" : "smooth",
      block: "start"
    });

    lanzarBolasPool();
  }, reducirMovimiento ? 0 : 700);
}
function lanzarBolasPool() {
  if (reducirMovimiento) return;

  const colores = [
    "#f4f1e8", // blanco
    "#e8b923", // amarillo
    "#c83232"  // rojo
  ];

  for (let i = 0; i < 15; i++) {
    const elemento = document.createElement("div");

    elemento.className = "bola-pool";

    // Color aleatorio
    const color =
      colores[Math.floor(Math.random() * colores.length)];

    elemento.style.setProperty(
      "--bola-color",
      color
    );

    // Tamaño ligeramente variable
    const tamaño = 38 + Math.random() * 12;

    elemento.style.width = `${tamaño}px`;
    elemento.style.height = `${tamaño}px`;

    // Posición horizontal
    elemento.style.left =
      `${Math.random() * 94 + 3}vw`;

    // Movimiento lateral
    elemento.style.setProperty(
      "--desplazamiento",
      `${-80 + Math.random() * 160}px`
    );

    // Rotación
    elemento.style.setProperty(
      "--rotacion",
      `${500 + Math.random() * 500}deg`
    );

    // Aparición escalonada
    elemento.style.animationDelay =
      `${Math.random() * 1.2}s`;

    // Duración
    elemento.style.animationDuration =
      `${4.5 + Math.random() * 2.5}s`;

    document.body.appendChild(elemento);

    elemento.addEventListener(
      "animationend",
      () => elemento.remove()
    );
  }
}

/** Arma el link de WhatsApp y lo abre */
function confirmarAsistencia() {
  const mensaje =
    "Hola! 🎉 Confirmo mi asistencia al cumpleaños de los 80 de " +
    CONFIG.nombre +
    " el " + CONFIG.fecha + ". ¡Nos vemos! ❤️";

  const url = "https://wa.me/" + CONFIG.telefono + "?text=" + encodeURIComponent(mensaje);
  window.open(url, "_blank", "noopener");
}

/** Contador regresivo */
function actualizarContador() {
  const restante = FECHA_EVENTO.getTime() - Date.now();

  if (restante <= 0) {
    cuenta.classList.add("oculto");
    cuentaFinal.classList.remove("oculto");
    window.clearInterval(intervalo);
    return;
  }

  const seg = Math.floor(restante / 1000);
  $("c-dias").textContent = Math.floor(seg / 86400);
  $("c-horas").textContent = Math.floor((seg % 86400) / 3600);
  $("c-min").textContent = Math.floor((seg % 3600) / 60);
  $("c-seg").textContent = seg % 60;
}

/* =======================================================
   4) EVENTOS E INICIO
   ======================================================= */
btnAbrir.addEventListener("click", abrirInvitacion);
btnConfirmar.addEventListener("click", confirmarAsistencia);

cargarDatos();
actualizarContador();
const intervalo = window.setInterval(actualizarContador, 1000);
