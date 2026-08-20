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
  valor: "$40.000",
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
const musica = $("musica");

function abrirInvitacion() {
  pantalla.classList.add("saliendo");
  invitacion.classList.remove("oculto");
  invitacion.setAttribute("aria-hidden", "false");

  musica.volume = 0.45;
  musica.play().catch(() => {});

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

  const bolas = [
    { numero: 1, color: "#f5c518", tipo: "lisa" },
    { numero: 2, color: "#174ea6", tipo: "lisa" },
    { numero: 3, color: "#d62828", tipo: "lisa" },
    { numero: 4, color: "#6a3fa0", tipo: "lisa" },
    { numero: 5, color: "#f28c28", tipo: "lisa" },
    { numero: 6, color: "#168a45", tipo: "lisa" },
    { numero: 7, color: "#8b1e2d", tipo: "lisa" },
    { numero: 8, color: "#111111", tipo: "lisa" },

    { numero: 9, color: "#f5c518", tipo: "rayada" },
    { numero: 10, color: "#174ea6", tipo: "rayada" },
    { numero: 11, color: "#d62828", tipo: "rayada" },
    { numero: 12, color: "#6a3fa0", tipo: "rayada" },
    { numero: 13, color: "#f28c28", tipo: "rayada" },
    { numero: 14, color: "#168a45", tipo: "rayada" },
    { numero: 15, color: "#8b1e2d", tipo: "rayada" }
  ];

  bolas.forEach((bola, index) => {
    const elemento = document.createElement("div");

    elemento.className = `bola-pool ${bola.tipo}`;

    elemento.dataset.numero = bola.numero;

    elemento.style.setProperty("--bola-color", bola.color);

    const tamaño = 38 + Math.random() * 12;
    elemento.style.width = `${tamaño}px`;
    elemento.style.height = `${tamaño}px`;

    elemento.style.left = `${Math.random() * 94 + 3}vw`;

    elemento.style.setProperty(
      "--desplazamiento",
      `${-80 + Math.random() * 160}px`
    );

    elemento.style.setProperty(
      "--rotacion",
      `${500 + Math.random() * 500}deg`
    );

    elemento.style.animationDelay = `${Math.random() * 1.2}s`;

    elemento.style.animationDuration =
      `${4.5 + Math.random() * 2.5}s`;

    document.body.appendChild(elemento);

    elemento.addEventListener("animationend", () => {
      elemento.remove();
    });
  });
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
/* ----------------------------------------------------------
   COPIAR ALIAS
---------------------------------------------------------- */
let idTimeoutCopia = null;

async function copiarAlias() {
  try {
    await navigator.clipboard.writeText(CONFIG.alias);
    mostrarConfirmacionCopia();
  } catch (error) {
    // Alternativa para navegadores sin soporte de clipboard API
    copiarAliasAlternativo();
  }
}

function copiarAliasAlternativo() {
  const areaTemporal = document.createElement("textarea");
  areaTemporal.value = CONFIG.alias;
  areaTemporal.setAttribute("readonly", "");
  areaTemporal.style.position = "absolute";
  areaTemporal.style.left = "-9999px";
  document.body.appendChild(areaTemporal);
  areaTemporal.select();
  try {
    document.execCommand("copy");
    mostrarConfirmacionCopia();
  } catch (error) {
    console.error("No se pudo copiar el alias:", error);
  }
  document.body.removeChild(areaTemporal);
}

function mostrarConfirmacionCopia() {
  dom.confirmacionCopia.classList.add("visible");
  if (idTimeoutCopia) window.clearTimeout(idTimeoutCopia);
  idTimeoutCopia = window.setTimeout(() => {
    dom.confirmacionCopia.classList.remove("visible");
  }, 2600);
}
/* =======================================================
   4) EVENTOS E INICIO
   ======================================================= */
btnAbrir.addEventListener("click", abrirInvitacion);
btnConfirmar.addEventListener("click", confirmarAsistencia);

cargarDatos();
actualizarContador();
const intervalo = window.setInterval(actualizarContador, 1000);
