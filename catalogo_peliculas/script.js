
/* =========================================
   CONFIGURACIÓN
========================================= */

const NUMERO_WHATSAPP = "51996347326";
const anioEstrenos = "2026";

const API_CATALOGO =
    "https://catalogo-api.TUUSUARIO.workers.dev/api/pelicula";

/* =========================================
   PELÍCULAS
========================================= */

const peliculas = [
    {
        titulo: "Spider Man Brand New Day",
        anio: "2026",
        calificacion: 8.0,
        enlaceCalificacion: "https://www.imdb.com/title/tt22084616/",
        calidad: "full hd",
        genero: "Marvel - Superhéroes",
        imagen: "img/Spider Man Brand New Day.webp",
        muestra: "https://drive.google.com/file/d/1_A3SmAgW9kfXyInOHKLUrjkRf14_tHtx/view?usp=drive_link",
        descripcion: "El mundo ha olvidado quién es Peter Parker, pero él sigue protegiendo Nueva York. Cuando una nueva amenaza aparece y sus poderes comienzan a cambiar, deberá descubrir qué está ocurriendo antes de perder el control"
    },
    {
        titulo: "Noche del demonio - Están entre nosotros",
        consultaOmdb: "Insidious: Out of the Further",
        anio: "2026",
        calificacion: 6.2,
        enlaceCalificacion: "https://www.imdb.com/title/tt32393988/",
        posterAutomatico: "",
        calidad: "full hd",
        genero: "Estrenos - Terror",
        imagen: "img/Noche del demonio - Están entre nosotros.webp",
        muestra: "",
        descripcion: "Gemma descubre que puede entrar en el más allá y traer de vuelta a sus habitantes. Pero cuando fuerzas oscuras descubren su poder, algo aterrador comienza a cruzar al mundo de los vivos"
    },
    {
        titulo: "Las cartas de la vida (2026)",
        consultaOmdb: "Doing Life",
        anio: "2026",
        calificacion: 6.4,
        enlaceCalificacion: "https://www.imdb.com/find/?q=Doing%20Life",
        posterAutomatico: "",
        calidad: "full hd",
        genero: "Estrenos - Drama y romance",
        imagen: "img/Las cartas de la vida (2026).webp",
        muestra: "",
        descripcion: "Una madre soltera comienza a intercambiar cartas con un preso que busca una segunda oportunidad. Lo que nace entre palabras y secretos cambiará sus vidas de una forma que ninguno imaginaba"
    },
    {
        titulo: "Coyote vs. Acme",
        anio: "2026",
        calificacion: 7.4,
        enlaceCalificacion: "https://www.imdb.com/title/tt1756855/",
        calidad: "full hd",
        genero: "Infantil y animación - Comedia",
        imagen: "img/Coyote vs. Acme.webp",
        muestra: "",
        descripcion: "Tras años de trampas fallidas y productos defectuosos, el Coyote decide llevar a ACME a los tribunales. Con un abogado a su lado, descubrirá que detrás de sus desastres se esconde algo mucho más grande"
    },
    {
        titulo: "Proyecto Fin Del Mundo",
        anio: "2026",
        calificacion: 8.2,
        enlaceCalificacion: "https://www.imdb.com/es/title/tt12042730/",
        calidad: "full hd",
        genero: "Estrenos - Ciencia ficción y fantasía",
        imagen: "img/Proyecto Fin Del Mundo.webp",
        muestra: "",
        descripcion: "Un astronauta despierta solo en el espacio y descubre que el Sol está muriendo. Con la humanidad al borde de la extinción, una misión imposible y un encuentro inesperado podrían ser su última esperanza"
    },
    {
        titulo: "Super Mario Galaxy",
        anio: "2026",
        calificacion: 6.2,
        enlaceCalificacion: "https://www.imdb.com/title/tt28650488/",
        calidad: "full hd",
        genero: "Infantil y animación - Acción y aventura",
        imagen: "img/Super Mario Galaxy.webp",
        muestra: "",
        descripcion: "Una aventura inesperada lleva a Mario y Luigi más allá de las estrellas, donde nuevos aliados y peligros los esperan. Para salvar la galaxia, deberán enfrentarse a una amenaza que podría cambiarlo todo"
    },
    {
        titulo: "Spider-Man No Way Home",
        anio: "2021",
        calificacion: 8.2,
        enlaceCalificacion: "https://www.imdb.com/title/tt10872600/",
        calidad: "full hd",
        genero: "Superhéroes - Ciencia ficción y fantasía",
        imagen: "img/Spider-Man No Way Home.webp",
        muestra: "",
        descripcion: "La identidad de Peter Parker ha sido revelada y su vida cambia para siempre. Al pedir ayuda al Doctor Strange, un hechizo sale mal y abre las puertas a otros universos, trayendo enemigos inesperados. Ahora Spider-Man deberá enfrentarse a una amenaza que pondrá a prueba todo lo que significa ser un héroe"
    },
    {
        titulo: "Ferrari",
        anio: "2023",
        calificacion: 6.4,
        enlaceCalificacion: "https://www.imdb.com/title/tt3758542/",
        calidad: "full hd",
        genero: "Biografía y hechos reales - Drama y romance",
        imagen: "img/Ferrari.webp",
        muestra: "",
        descripcion: "Enzo Ferrari atraviesa una crisis que amenaza con destruir su empresa y su vida personal. Con su matrimonio al borde del colapso y el futuro de su escudería en juego, deberá arriesgarlo todo en la legendaria Mille Miglia, una carrera donde la velocidad, la ambición y el peligro pueden cambiarlo todo"
    }
];

/* =========================================
   CONSULTA OPCIONAL DE OMDb
========================================= */

const consultasRealizadas = new Map();

async function obtenerDatosAutomaticos(pelicula) {
    if (!API_CATALOGO || API_CATALOGO.includes("TUUSUARIO")) {
        return null;
    }

    const titulo = pelicula.consultaOmdb || pelicula.titulo;
    const clave = `${titulo}-${pelicula.anio}`;

    if (consultasRealizadas.has(clave)) {
        return consultasRealizadas.get(clave);
    }

    const promesa = (async () => {
        try {
            const parametros = new URLSearchParams({
                titulo,
                anio: String(pelicula.anio)
            });

            const respuesta = await fetch(
                `${API_CATALOGO}?${parametros}`
            );

            if (!respuesta.ok) return null;

            const datos = await respuesta.json();

            if (datos.error) return null;

            return datos;
        } catch (error) {
            console.warn(
                "No se pudieron cargar datos externos:",
                error
            );
            return null;
        }
    })();

    consultasRealizadas.set(clave, promesa);
    return promesa;
}

async function cargarDatosAutomaticos() {
    await Promise.all(
        peliculas.map(async pelicula => {
            const datos = await obtenerDatosAutomaticos(pelicula);

            if (!datos) return;

            const nota = Number(datos.puntuacion);

            if (
                datos.puntuacion !== null &&
                datos.puntuacion !== "" &&
                Number.isFinite(nota) &&
                nota >= 0 &&
                nota <= 10
            ) {
                pelicula.calificacion = nota;
            }

            if (datos.enlace) {
                pelicula.enlaceCalificacion = datos.enlace;
            }

            if (datos.poster) {
                pelicula.posterAutomatico = datos.poster;
            }
        })
    );

    actualizarCatalogo();
}

/* =========================================
   ELEMENTOS HTML
========================================= */

const moviesGrid = document.getElementById("moviesGrid");
const searchInput = document.getElementById("searchInput");
const movieCount = document.getElementById("movieCount");
const noResults = document.getElementById("noResults");
const generalWhatsapp = document.getElementById("generalWhatsapp");
const genreTabs = document.getElementById("genreTabs");
const sectionHeading = document.getElementById("sectionHeading");
const sectionLabel = document.getElementById("sectionLabel");

const sampleModal = document.getElementById("sampleModal");
const sampleFrame = document.getElementById("sampleFrame");
const sampleTitle = document.getElementById("sampleTitle");
const closeSample = document.getElementById("closeSample");

/* =========================================
   PESTAÑA INICIAL
========================================= */

// Al abrir la página, mostrar todas las películas.
let categoriaActiva = "todos";

/* =========================================
   UTILIDADES
========================================= */

function normalizarTexto(texto) {
    return String(texto ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function obtenerGeneros(pelicula) {
    return String(pelicula.genero ?? "")
        .split(/[·•,;|]| - | – | — /)
        .map(genero => genero.trim())
        .filter(Boolean);
}

function crearEnlaceWhatsApp(titulo, anio) {
    const mensaje =
        `Hola 👋, quisiera la película "${titulo} (${anio})" 🎬`;

    return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

function obtenerEnlaceReproduccion(enlace) {
    const url = String(enlace ?? "").trim();
    const coincidencia = url.match(/\/file\/d\/([^/?]+)/);

    if (coincidencia) {
        return `https://drive.google.com/file/d/${coincidencia[1]}/preview`;
    }

    const idCoincide = url.match(/[?&]id=([^&]+)/);

    if (idCoincide && url.includes("drive.google.com")) {
        return `https://drive.google.com/file/d/${idCoincide[1]}/preview`;
    }

    return "";
}

/* =========================================
   REPRODUCTOR DE MUESTRAS
========================================= */

function abrirMuestra(pelicula) {
    if (!sampleModal || !sampleFrame || !sampleTitle) {
        alert("No se encontró el reproductor. Revisa el bloque sampleModal de index.html.");
        return;
    }

    const enlace = obtenerEnlaceReproduccion(pelicula.muestra);

    if (!enlace) {
        alert("El enlace de la muestra no es válido.");
        return;
    }

    sampleTitle.textContent = `Ver muestra: ${pelicula.titulo}`;
    sampleFrame.src = enlace;
    sampleModal.classList.remove("hidden");
    sampleModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("sample-modal-open");

    if (closeSample) closeSample.focus();
}

function cerrarMuestra() {
    if (!sampleModal || !sampleFrame) return;

    sampleFrame.src = "about:blank";
    sampleModal.classList.add("hidden");
    sampleModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("sample-modal-open");
}

if (closeSample) {
    closeSample.addEventListener("click", cerrarMuestra);
}

if (sampleModal) {
    const fondo = sampleModal.querySelector(".sample-modal-backdrop");

    if (fondo) {
        fondo.addEventListener("click", cerrarMuestra);
    }
}

document.addEventListener("keydown", evento => {
    if (
        evento.key === "Escape" &&
        sampleModal &&
        !sampleModal.classList.contains("hidden")
    ) {
        cerrarMuestra();
    }
});

/* =========================================
   PESTAÑAS: SOLO TODOS Y ESTRENOS
========================================= */

function crearPestanas() {
    if (!genreTabs) return;

    genreTabs.innerHTML = "";

    const pestanas = [
        { id: "todos", nombre: "Todos" },
        { id: "estrenos", nombre: `Estrenos ${anioEstrenos}` }
    ];

    pestanas.forEach(pestana => {
        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "genre-tab";
        boton.textContent = pestana.nombre;

        boton.setAttribute(
            "aria-pressed",
            String(categoriaActiva === pestana.id)
        );

        if (categoriaActiva === pestana.id) {
            boton.classList.add("active");
        }

        boton.addEventListener("click", () => {
            categoriaActiva = pestana.id;
            crearPestanas();
            actualizarCatalogo();
        });

        genreTabs.appendChild(boton);
    });
}

function perteneceACategoria(pelicula) {
    if (categoriaActiva === "todos") {
        return true;
    }

    if (categoriaActiva === "estrenos") {
        return String(pelicula.anio).trim() === String(anioEstrenos);
    }

    return true;
}

/* =========================================
   BUSCADOR
========================================= */

function coincideConBusqueda(pelicula, texto) {
    const busqueda = normalizarTexto(texto);

    if (!busqueda) return true;

    const generos = obtenerGeneros(pelicula).map(normalizarTexto);

    // Si la búsqueda coincide con un género existente,
    // mostrar solo las películas clasificadas en ese género.
    if (!busqueda.includes(" ")) {
        const coincideGenero = generos.some(
            genero => genero.includes(busqueda)
        );

        if (coincideGenero) {
            return true;
        }

        const existeEseGenero = peliculas.some(p =>
            obtenerGeneros(p).some(
                genero => normalizarTexto(genero).includes(busqueda)
            )
        );

        if (existeEseGenero) {
            return false;
        }
    }

    const contenido = normalizarTexto([
        pelicula.titulo,
        pelicula.anio,
        pelicula.calidad,
        pelicula.genero,
        pelicula.descripcion
    ].join(" "));

    return contenido.includes(busqueda);
}

/* =========================================
   TÍTULOS DE SECCIÓN
========================================= */

function actualizarTitulo() {
    if (!sectionHeading || !sectionLabel) return;

    if (categoriaActiva === "estrenos") {
        sectionHeading.textContent = `🔥 Estrenos ${anioEstrenos}`;
        sectionLabel.textContent = "PELÍCULAS DEL AÑO";
    } else {
        sectionHeading.textContent = "🎬 Todas las películas";
        sectionLabel.textContent = "CATÁLOGO COMPLETO";
    }
}

/* =========================================
   CALIFICACIONES
========================================= */

function crearCalificacion(pelicula) {
    const contenedor = document.createElement("div");
    contenedor.className = "movie-rating";

    const notaValor = Number(pelicula.calificacion);

    if (
        pelicula.calificacion === null ||
        pelicula.calificacion === undefined ||
        !Number.isFinite(notaValor)
    ) {
        contenedor.classList.add("rating-unavailable");
        contenedor.textContent = "Sin calificación";
        return contenedor;
    }

    const estrellasLlenas = Math.max(
        0,
        Math.min(5, Math.round(notaValor / 2))
    );

    const estrellas = document.createElement("span");
    estrellas.className = "rating-stars";
    estrellas.textContent =
        "★".repeat(estrellasLlenas) +
        "☆".repeat(5 - estrellasLlenas);

    const nota = document.createElement("span");
    nota.className = "rating-score";
    nota.textContent = `${notaValor.toFixed(1)}/10`;

    contenedor.append(estrellas, nota);

    if (pelicula.enlaceCalificacion) {
        const fuente = document.createElement("a");

        fuente.className = "rating-source";
        fuente.href = pelicula.enlaceCalificacion;
        fuente.target = "_blank";
        fuente.rel = "noopener noreferrer";
        fuente.textContent = "IMDb";

        contenedor.appendChild(fuente);
    }

    return contenedor;
}

/* =========================================
   MOSTRAR PELÍCULAS
========================================= */

function mostrarPeliculas(lista) {
    if (!moviesGrid || !movieCount || !noResults) return;

    moviesGrid.innerHTML = "";

    movieCount.textContent =
        `${lista.length} ${lista.length === 1 ? "película" : "películas"}`;

    noResults.classList.toggle("hidden", lista.length !== 0);

    lista.forEach(pelicula => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "movie-card";

        const posterWrapper = document.createElement("div");
        posterWrapper.className = "movie-poster-wrapper";

        const imagen = document.createElement("img");
        imagen.className = "movie-poster";
        imagen.alt = `Póster de ${pelicula.titulo}`;
        imagen.loading = "lazy";
        imagen.src = pelicula.posterAutomatico || pelicula.imagen;

        imagen.addEventListener("error", () => {
            const posterLocal =
                new URL(pelicula.imagen, document.baseURI).href;

            if (imagen.src !== posterLocal) {
                imagen.src = pelicula.imagen;
            } else {
                imagen.alt = `Imagen no disponible: ${pelicula.titulo}`;
            }
        });

        const meta = document.createElement("div");
        meta.className = "movie-meta";

        const anio = document.createElement("span");
        anio.className = "movie-year";
        anio.textContent = pelicula.anio;

        const calidad = document.createElement("span");
        calidad.className = "movie-quality";
        calidad.textContent = pelicula.calidad;

        meta.append(anio, calidad);
        posterWrapper.append(imagen, meta);

        const info = document.createElement("div");
        info.className = "movie-info";

        const titulo = document.createElement("h3");
        titulo.className = "movie-title";
        titulo.textContent = pelicula.titulo;

        const calificacion = crearCalificacion(pelicula);

        const genero = document.createElement("p");
        genero.className = "movie-genre";
        genero.textContent = pelicula.genero;

        const descripcion = document.createElement("p");
        descripcion.className = "movie-description";
        descripcion.textContent = pelicula.descripcion;

        const acciones = document.createElement("div");
        acciones.className = "movie-actions";

        if (pelicula.muestra && pelicula.muestra.trim()) {
            const botonMuestra = document.createElement("button");

            botonMuestra.type = "button";
            botonMuestra.className = "movie-button sample-button";
            botonMuestra.textContent = "▶ Ver muestra";

            botonMuestra.addEventListener(
                "click",
                () => abrirMuestra(pelicula)
            );

            acciones.appendChild(botonMuestra);
        }

        const botonWhatsApp = document.createElement("a");

        botonWhatsApp.className = "movie-button";
        botonWhatsApp.href = crearEnlaceWhatsApp(
            pelicula.titulo,
            pelicula.anio
        );
        botonWhatsApp.target = "_blank";
        botonWhatsApp.rel = "noopener noreferrer";
        botonWhatsApp.textContent = "🎬 Quiero esta";

        acciones.appendChild(botonWhatsApp);

        info.append(
            titulo,
            calificacion,
            genero,
            descripcion,
            acciones
        );

        tarjeta.append(posterWrapper, info);
        moviesGrid.appendChild(tarjeta);
    });
}

/* =========================================
   ACTUALIZAR CATÁLOGO
========================================= */

function actualizarCatalogo() {
    actualizarTitulo();

    const texto = searchInput ? searchInput.value : "";

    const resultados = peliculas.filter(pelicula =>
        perteneceACategoria(pelicula) &&
        coincideConBusqueda(pelicula, texto)
    );

    mostrarPeliculas(resultados);
}

/* =========================================
   INICIO
========================================= */

if (searchInput) {
    searchInput.addEventListener("input", actualizarCatalogo);
}

if (generalWhatsapp) {
    const mensaje =
        "Hola 👋, estoy buscando una película y quisiera hacer una consulta 🎬";

    generalWhatsapp.href =
        `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

crearPestanas();
actualizarCatalogo();
cargarDatosAutomaticos();
