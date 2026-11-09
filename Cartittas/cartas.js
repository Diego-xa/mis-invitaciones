
/* ========================================
   CARTITAS DE AMOR
======================================== */

const cartas = [

    {
        titulo: "Una cosita que quiero recordarte...",
        mensaje: "No importa cuántos kilómetros nos separen, siempre habrá una parte de mí que estará contigo. Te amo incluso en los días en los que no podemos estar cerquita.",
        firma: "Siempre tuyo, mi niña ♡"
    },

    {
        titulo: "Mi persona favorita",
        mensaje: "De todas las personas que pude encontrar en este mundo, qué bonito que haya sido a ti. No sabes lo feliz que me hace tenerte en mi vida.",
        firma: "Te elegiría otra vez ❤️"
    },

    {
        titulo: "Un pensamiento de tu Spider-Man",
        mensaje: "Si tuviera que cruzar toda la ciudad colgado de mis telarañas para darte un abrazo, lo haría. Aunque ni todos los edificios de Nueva York serían suficientes para demostrarte cuánto te quiero.",
        firma: "Tu Spider-Man enamorado 🕷️"
    },

    {
        titulo: "Para cuando me extrañes...",
        mensaje: "Cierra tus ojitos un ratito e imagina que estoy ahí contigo, abrazándote fuerte y llenándote de besitos. Ojalá pudiera convertir todos mis te extraño en abrazos de verdad.",
        firma: "Prontito tendremos uno ♡"
    },

    {
        titulo: "Algo que amo de ti",
        mensaje: "Amo tus ocurrencias, tu manera de ser, tus pequeñas locuras y hasta esas cositas que quizás tú no notas. Me encanta conocerte un poquito más cada día.",
        firma: "Me encantas, preciosa 🌷"
    },

    {
        titulo: "Un abrazo de Snoopy",
        mensaje: "Hoy Snoopy y yo queremos recordarte que eres una personita muy especial. Así que deja de preocuparte un ratito, sonríe y recibe este abrazote que te mando desde aquí.",
        firma: "Con amor y muchas patitas 🐾"
    },

    {
        titulo: "Si pudiera pedir un deseo...",
        mensaje: "No pediría riquezas ni viajes a lugares lejanos. Pediría tenerte cerquita, despertar a tu lado y poder darte un besito cada mañana.",
        firma: "Mi deseo favorito eres tú ❤️"
    },

    {
        titulo: "Nunca olvides esto",
        mensaje: "No tienes que ser perfecta, ni tener siempre un buen día, ni sonreír todo el tiempo. Me gustas tú, con tus días bonitos y también con los difíciles.",
        firma: "Te amo tal y como eres."
    },

    {
        titulo: "Una pequeña promesa",
        mensaje: "Quiero seguir construyendo recuerdos contigo, compartir tonterías, reírnos de cualquier cosa y algún día dejar de contar los kilómetros que nos separan.",
        firma: "Tenemos muchas historias por vivir ♡"
    },

    {
        titulo: "Una última cosita...",
        mensaje: "Por si hoy nadie te lo ha dicho: eres hermosa, eres importante, eres querida y hay un chico al otro lado de la distancia que está muy enamorado de ti.",
        firma: "Ese chico soy yo. Te amo. 💗"
    }

];


/* ========================================
   ELEMENTOS HTML
======================================== */

const tituloCarta = document.getElementById("titulo-carta");
const mensajeCarta = document.getElementById("mensaje-carta");
const firmaCarta = document.getElementById("firma");
const botonCarta = document.getElementById("boton-carta");
const sobre = document.getElementById("sobre");

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

    // Reiniciar animación
    sobre.classList.remove("animar-carta");

    void sobre.offsetWidth;

    sobre.classList.add("animar-carta");
}


/* ========================================
   EVENTO DEL BOTON
======================================== */

botonCarta.addEventListener("click", mostrarCarta);
