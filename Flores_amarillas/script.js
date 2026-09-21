const jardin = document.getElementById("flores");


// ================================
// CREAR UNA FLOR
// ================================

function crearFlor(posicion, escala, retraso) {

    const flor = document.createElement("div");

    flor.className = "flor";

    flor.style.left = `${posicion}%`;
    flor.style.transform = `scale(${escala})`;
    flor.style.animationDelay = `${retraso}s`;


    // Tallo
    const tallo = document.createElement("div");
    tallo.className = "tallo";

    flor.appendChild(tallo);


    // Hojas
    const hojaIzquierda = document.createElement("div");
    hojaIzquierda.className = "hoja izquierda";

    const hojaDerecha = document.createElement("div");
    hojaDerecha.className = "hoja derecha";

    flor.appendChild(hojaIzquierda);
    flor.appendChild(hojaDerecha);


    // Cabeza
    const cabeza = document.createElement("div");
    cabeza.className = "cabeza";


    // Pétalos
    for (let i = 0; i < 8; i++) {

        const petalo = document.createElement("div");

        petalo.className = "petalo";

        cabeza.appendChild(petalo);
    }


    // Centro
    const centro = document.createElement("div");
    centro.className = "centro";

    cabeza.appendChild(centro);

    flor.appendChild(cabeza);


    jardin.appendChild(flor);
}


// ================================
// CREAR MUCHAS FLORES
// ================================

const cantidadFlores = 13;

for (let i = 0; i < cantidadFlores; i++) {

    const posicion = Math.random() * 100;

    const escala = 0.55 + Math.random() * 0.8;

    const retraso = Math.random() * 3;

    crearFlor(
        posicion,
        escala,
        retraso
    );
}


// ================================
// PÉTALOS QUE CAEN
// ================================

function crearPetalo() {

    const petalo = document.createElement("div");

    petalo.className = "petalo-caido";

    petalo.style.left =
        `${Math.random() * 100}%`;

    const duracion =
        5 + Math.random() * 6;

    petalo.style.animationDuration =
        `${duracion}s`;

    petalo.style.opacity =
        0.3 + Math.random() * 0.6;

    document.body.appendChild(petalo);


    setTimeout(() => {
        petalo.remove();
    }, duracion * 1000);
}


// Crear pétalos periódicamente

setInterval(
    crearPetalo,
    700
);