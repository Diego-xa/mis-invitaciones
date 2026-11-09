
/* ========================================
   CARTITAS DE AMOR
======================================== */

const cartas = [

     {
         titulo: "HOLI MI AMOORRRR",
        mensaje: "Soy muy feliz contigo corazoncito, gracias por esto y a serguir creciendo jutnos ♡",
        firma: "Me encantas, preciosa"
    },
    {
        titulo: "Recordatorio",
        mensaje: "no olvides las cosas que debemos  mejorar mi amor, ambos debemos hacerlo para fortalecer lo nuestro corazoncito ❤️"
    },

    {
        titulo: "Llamame  siempre",
        mensaje: "Nunca en la fokin vida serias una molestia para mi, mi corazoncito de melon hermoso, llamame, siempre estare para ti.",
        firma: "Amo tu persencia ♡"
    },

];


/* ========================================
   ELEMENTOS HTML
======================================== */

const tituloCarta = document.getElementById("titulo-carta");
const mensajeCarta = document.getElementById("mensaje-carta");
const firmaCarta = document.getElementById("firma");
const botonCarta = document.getElementById("boton-carta");
const sobre = document.getElementById("sobre");
const lluviaCorazones = document.getElementById("lluvia-corazones");

let ultimaCarta = -1;


/* ========================================
   MOSTRAR CARTA ALEATORIA
======================================== */

function mostrarCarta() {

    let numeroAleatorio;

    do {
        numeroAleatorio = Math.floor(Math.random() * cartas.length);
    } while (
        numeroAleatorio === ultimaCarta &&
        cartas.length > 1
    );

    ultimaCarta = numeroAleatorio;

    const cartaSeleccionada = cartas[numeroAleatorio];

    tituloCarta.textContent = cartaSeleccionada.titulo;
    mensajeCarta.textContent = cartaSeleccionada.mensaje;
    firmaCarta.textContent = cartaSeleccionada.firma;

    // Animar carta
    sobre.classList.remove("animar-carta");

    void sobre.offsetWidth;

    sobre.classList.add("animar-carta");

    // Lanzar lluvia de corazones
    crearLluviaCorazones();
}


/* ========================================
   CREAR LLUVIA DE CORAZONES
======================================== */

function crearLluviaCorazones() {

    const cantidad = 40;

    const colores = [
        "#e65b82",
        "#f28da5",
        "#d94d70",
        "#ffb6c8",
        "#c95070"
    ];

    for (let i = 0; i < cantidad; i++) {

        const corazon = document.createElement("span");

        corazon.classList.add("corazon-lluvia");

        // Elegir un corazón
        corazon.textContent = Math.random() > 0.5 ? "♥" : "♡";

        // Posición horizontal aleatoria
        corazon.style.left = Math.random() * 100 + "vw";

        // Tamaño aleatorio
        corazon.style.fontSize = (15 + Math.random() * 25) + "px";

        // Color aleatorio
        corazon.style.color = colores[
            Math.floor(Math.random() * colores.length)
        ];

        // Duración aleatoria
        corazon.style.animationDuration = (3 + Math.random() * 3) + "s";

        // Retraso para que parezca una lluvia natural
        corazon.style.animationDelay = (Math.random() * 1.5) + "s";

        lluviaCorazones.appendChild(corazon);

        // Eliminar el corazón cuando termine su animación
        corazon.addEventListener("animationend", function () {
            corazon.remove();
        });

    }

}


/* ========================================
   EVENTO DEL BOTON
======================================== */

botonCarta.addEventListener("click", mostrarCarta);
/* ========================================
   MODO CLARO Y MODO OSCURO
======================================== */

const botonTema = document.getElementById("boton-tema");

// Revisar el tema guardado
let temaGuardado = localStorage.getItem("tema");

// Aplicar el tema guardado
if (temaGuardado === "oscuro") {
    document.body.classList.add("modo-oscuro");
}

// Actualizar el texto del botón
function actualizarBotonTema() {

    if (document.body.classList.contains("modo-oscuro")) {
        botonTema.textContent = "☀️ Modo claro";
    } else {
        botonTema.textContent = "🌙 Modo oscuro";
    }

}

// Cambiar de tema al pulsar
botonTema.addEventListener("click", function () {

    document.body.classList.toggle("modo-oscuro");

    // Guardar la selección
    if (document.body.classList.contains("modo-oscuro")) {
        localStorage.setItem("tema", "oscuro");
    } else {
        localStorage.setItem("tema", "claro");
    }

    actualizarBotonTema();

});

// Mostrar el texto correcto al iniciar
actualizarBotonTema();