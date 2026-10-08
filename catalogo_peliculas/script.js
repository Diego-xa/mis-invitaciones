/* =========================================
   CONFIGURACION
========================================= */

/*
    ESCRIBE TU NUMERO AQUI

    Ejemplo Peru:
    51987654321

    SIN:
    +
    espacios
    guiones
*/

const NUMERO_WHATSAPP = "51996347326";


/* =========================================
   PELICULAS
========================================= */

const peliculas = [

    {
        titulo: "Spider-Man: Un nuevo día",
        anio: "2026",
        calidad: "full hd",
        genero: "Marvel - Superhéroe - Acción ",
        imagen: "img/spider_man_un_nuevo_dia_2026.webp",
        descripcion:
            "Tras el Día del Juicio Final, Peter Parker intenta centrarse en la universidad y abandonar a Spider-Man. Cuando una nueva amenaza pone en peligro a sus amigos, debe romper su promesa y volver al traje."
    },


    {
        titulo: "Película de prueba",
        anio: "2026",
        calidad:  "full hd",
        genero: "Terror · Suspenso",
        imagen: "img/pelicula-2.webp",
        descripcion:
            "Una breve descripción de esta película."
    },


    {
        titulo: "Otra película",
        anio: "2026",
        genero: "Comedia",
        imagen: "img/pelicula-3.webp",
        descripcion:
            "Una divertida película para disfrutar."
    }

];


/* =========================================
   ELEMENTOS
========================================= */

const moviesGrid =
    document.getElementById("moviesGrid");

const searchInput =
    document.getElementById("searchInput");

const movieCount =
    document.getElementById("movieCount");

const noResults =
    document.getElementById("noResults");

const generalWhatsapp =
    document.getElementById("generalWhatsapp");


/* =========================================
   WHATSAPP
========================================= */

function crearEnlaceWhatsApp(
    titulo,
    anio
) {

    const mensaje =
        `Hola 👋, quisiera la película "${titulo} (${anio})" 🎬`;

    return (
        `https://wa.me/` +
        `${NUMERO_WHATSAPP}` +
        `?text=` +
        encodeURIComponent(mensaje)
    );

}


/* =========================================
   MOSTRAR PELICULAS
========================================= */

function mostrarPeliculas(lista) {

    moviesGrid.innerHTML = "";


    movieCount.textContent =
        `${lista.length} ${lista.length === 1
            ? "película"
            : "películas"
        }`;


    if (lista.length === 0) {

        noResults.classList.remove(
            "hidden"
        );

        return;

    }


    noResults.classList.add(
        "hidden"
    );


    lista.forEach(
        pelicula => {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "movie-card";


            tarjeta.innerHTML = `

                <div class="movie-poster-wrapper">

                    <img
                        class="movie-poster"
                        src="${pelicula.imagen}"
                        alt="Poster de ${pelicula.titulo}"
                        loading="lazy"
                    >

                    <div class="movie-meta">
                    <span class="movie-year">
                    ${pelicula.anio}
                    </span>

                    <span class="movie-quality">
                    ${pelicula.calidad}
                    </span>
                    </div>
                    
                    

                </div>


                <div class="movie-info">

                    <h3 class="movie-title">
                        ${pelicula.titulo}
                    </h3>


                    <p class="movie-genre">
                        ${pelicula.genero}
                    </p>


                    <p class="movie-description">
                        ${pelicula.descripcion}
                    </p>


                    <a
                        class="movie-button"
                        href="${crearEnlaceWhatsApp(
                pelicula.titulo,
                pelicula.anio
            )}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🎬 Quiero esta
                    </a>

                </div>

            `;


            moviesGrid.appendChild(
                tarjeta
            );

        }
    );

}


/* =========================================
   BUSQUEDA
========================================= */

searchInput.addEventListener(
    "input",
    () => {

        const texto =
            searchInput.value
                .toLowerCase()
                .trim();


        const resultados =
            peliculas.filter(
                pelicula => {

                    return (

                        pelicula.titulo
                            .toLowerCase()
                            .includes(texto)

                        ||

                        pelicula.genero
                            .toLowerCase()
                            .includes(texto)

                    );

                }
            );


        mostrarPeliculas(
            resultados
        );

    }
);


/* =========================================
   BOTON PEDIR PELICULA
========================================= */

const mensajeGeneral =
    "Hola 👋, estoy buscando una película y quisiera hacer una consulta 🎬";


generalWhatsapp.href =
    `https://wa.me/${NUMERO_WHATSAPP}` +
    `?text=` +
    encodeURIComponent(
        mensajeGeneral
    );


/* =========================================
   INICIO
========================================= */

mostrarPeliculas(
    peliculas
);