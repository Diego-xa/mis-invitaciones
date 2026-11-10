
/* =====================================
   CONFIGURACIÓN DEL SISTEMA DE XP
===================================== */

const XP_POR_SOL = 5;
const XP_POR_NIVEL = 25;


/* =====================================
   LISTA DE MIEMBROS

   Para subir los puntos de una persona,
   solamente modifica su propiedad puntos.
===================================== */

const MIEMBROS = [
    {
        nombre: "Diego",
        puntos: 20,
        foto: "",
        mensaje: "Gracias por formar parte."
    },
    {
        nombre: "Steita",
        puntos: 500,
        foto: "",
        mensaje: "Una persona especial de la comunidad."
    },
    {
        nombre: "Super Fan",
        puntos: 125,
        foto: "",
        mensaje: "Gracias por tu apoyo."
    }
];


/* =====================================
   PERSONAS AGRADECIDAS
===================================== */

const PERSONAS_AGRADECIDAS = [
    {
        nombre: "Nuestra comunidad",
        mensaje: "Gracias por cada momento compartido."
    },
    {
        nombre: "Nuestros seguidores",
        mensaje: "Gracias por estar presentes."
    },
    {
        nombre: "Nuestros amigos",
        mensaje: "Gracias por hacer especial este espacio."
    }
];


/* =====================================
   CALCULAR NIVEL
===================================== */

function getLevel(puntos) {
    return Math.floor(puntos / XP_POR_NIVEL);
}


/* =====================================
   CALCULAR PROGRESO
===================================== */

function getProgress(puntos) {
    const progreso = puntos % XP_POR_NIVEL;

    return (progreso / XP_POR_NIVEL) * 100;
}


/* =====================================
   CALCULAR XP FALTANTE
===================================== */

function getXPRestante(puntos) {
    const progreso = puntos % XP_POR_NIVEL;

    return XP_POR_NIVEL - progreso;
}


/* =====================================
   INSIGNIAS
===================================== */

function getBadge(nivel) {

    if (nivel >= 30) return "🏆 Legendario";
    if (nivel >= 20) return "💎 pa eso :V";
    if (nivel >= 10) return "👑 puchainon";
    if (nivel >= 5) return "💜 Super Fan";
    if (nivel >= 4) return "✨ Destacado";
    if (nivel >= 3) return "💗 Especial";
    if (nivel >= 2) return "🌷 Steita";
    if (nivel >= 1) return "🌱 miserable";

    return "♡ Aspirante";
}


/* =====================================
   FOTO O AVATAR
===================================== */

function getFoto(miembro) {

    if (miembro.foto) {
        return `<img src="${miembro.foto}" alt="Foto de ${miembro.nombre}">`;
    }

    return `<span>${miembro.nombre.charAt(0).toUpperCase()}</span>`;
}


/* =====================================
   ORDENAR MIEMBROS
===================================== */

function ordenarMiembros() {

    return [...MIEMBROS].sort((a, b) => {
        return b.puntos - a.puntos;
    });
}


/* =====================================
   MOSTRAR PODIO
===================================== */

function mostrarPodio() {

    const contenedor = document.getElementById("podium");
    const miembros = ordenarMiembros().slice(0, 3);

    const posiciones = [
        { clase: "second", medalla: "🥈" },
        { clase: "first", medalla: "🥇" },
        { clase: "third", medalla: "🥉" }
    ];

    const ordenPodio = [
        miembros[1],
        miembros[0],
        miembros[2]
    ];

    contenedor.innerHTML = "";

    ordenPodio.forEach((miembro, indice) => {

        if (!miembro) return;

        const posicion = posiciones[indice];
        const nivel = getLevel(miembro.puntos);

        contenedor.innerHTML += `
            <div class="podium-card ${posicion.clase}">
                <div class="podium-medal">${posicion.medalla}</div>

                <h3>${miembro.nombre}</h3>

                <p>${getBadge(nivel)}</p>

                <p>Nivel ${nivel}</p>

                <p>${miembro.puntos} XP</p>
            </div>
        `;
    });
}


/* =====================================
   MOSTRAR RANKING
===================================== */

function mostrarRanking() {

    const contenedor = document.getElementById("ranking");
    const miembros = ordenarMiembros();

    contenedor.innerHTML = "";

    miembros.forEach((miembro, indice) => {

        const nivel = getLevel(miembro.puntos);
        const progreso = getProgress(miembro.puntos);
        const restante = getXPRestante(miembro.puntos);

        contenedor.innerHTML += `
            <div class="donor-card">

                <div class="donor-position">
                    #${indice + 1}
                </div>

                <div class="donor-photo">
                    ${getFoto(miembro)}
                </div>

                <div class="donor-info">

                    <h4>${miembro.nombre}</h4>

                    <div class="donor-level">
                        ${getBadge(nivel)} · Nivel ${nivel}
                    </div>

                    <div class="donor-points">
                        ${miembro.puntos} XP
                    </div>

                    <div class="progress-container">
                        <div
                            class="progress-bar"
                            style="width: ${progreso}%"
                        ></div>
                    </div>

                    <div class="progress-info">
                        <span>${progreso}% de progreso</span>
                        <span>Faltan ${restante} XP</span>
                    </div>

                </div>

                <div class="donor-total">
                    ${miembro.puntos} XP
                </div>

            </div>
        `;
    });
}


/* =====================================
   MOSTRAR AGRADECIMIENTOS
===================================== */

function mostrarAgradecimientos() {

    const contenedor = document.getElementById("agradecidos");

    contenedor.innerHTML = "";

    PERSONAS_AGRADECIDAS.forEach(persona => {

        contenedor.innerHTML += `
            <div class="member-card">

                <div class="member-heart">♡</div>

                <h3>${persona.nombre}</h3>

                <p>${persona.mensaje}</p>

            </div>
        `;
    });
}


/* =====================================
   INICIAR LA PÁGINA
===================================== */

function iniciarPagina() {

    mostrarPodio();
    mostrarRanking();
    mostrarAgradecimientos();

}

iniciarPagina();
