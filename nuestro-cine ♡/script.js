
const $ = (id) => document.getElementById(id);

const CLAVE = "nuestro_cine_v2";

let estado = JSON.parse(localStorage.getItem(CLAVE) || "{}");
let actual = null;

function guardarEstado() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}

function datos(id) {
    if (!estado[id]) {
        estado[id] = {
            pendiente: false,
            vista: false,
            minuto: 0
        };
    }
    return estado[id];
}

function extraerIdDrive(enlace) {
    try {
        const url = new URL(enlace);

        if (url.hostname === "drive.google.com") {
            const ruta = url.pathname.match(/\/file\/d\/([^/]+)/);
            if (ruta) return ruta[1];

            const id = url.searchParams.get("id");
            if (id) return id;
        }
    } catch (error) {
        return null;
    }

    return null;
}

function enlaceReproductor(pelicula) {
    const id = extraerIdDrive(pelicula.enlace);

    if (id) {
        return `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
    }

    // También admite enlaces de otras plataformas que permitan insertar videos.
    return pelicula.enlace;
}

function crearTarjeta(pelicula) {
    const progreso = datos(pelicula.id);
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";

    if (pelicula.portada) {
        const img = document.createElement("img");
        img.className = "portada";
        img.src = pelicula.portada;
        img.alt = pelicula.titulo;
        img.loading = "lazy";
        img.onerror = () => {
            const vacia = document.createElement("div");
            vacia.className = "portada-vacia";
            vacia.textContent = "♡";
            img.replaceWith(vacia);
        };
        tarjeta.appendChild(img);
    } else {
        const portada = document.createElement("div");
        portada.className = "portada-vacia";
        portada.textContent = "♡";
        tarjeta.appendChild(portada);
    }

    const contenido = document.createElement("div");
    contenido.className = "tarjeta-contenido";

    const titulo = document.createElement("h3");
    titulo.textContent = pelicula.titulo;

    const detalle = document.createElement("div");
    detalle.className = "detalle";
    detalle.textContent =
        `${pelicula.tipo.toUpperCase()} · ${pelicula.anio || "Sin año"} · ${pelicula.genero || "Sin género"}`;

    contenido.append(titulo, detalle);

    if (progreso.minuto > 0 && !progreso.vista) {
        const texto = document.createElement("div");
        texto.className = "detalle";
        texto.textContent = `Nos quedamos en el minuto ${progreso.minuto}`;
        contenido.appendChild(texto);
    }

    if (progreso.vista) {
        const texto = document.createElement("div");
        texto.className = "detalle";
        texto.textContent = "✓ Vista";
        contenido.appendChild(texto);
    }

    const barra = document.createElement("div");
    barra.className = "barra-progreso";

    const relleno = document.createElement("div");
    // Barra orientativa: no representa el porcentaje real de la película.
    relleno.style.width = progreso.minuto > 0 ? "35%" : "0%";
    barra.appendChild(relleno);
    contenido.appendChild(barra);

    const boton = document.createElement("button");
    boton.className = "boton principal boton-ver";
    boton.textContent = progreso.minuto > 0 && !progreso.vista
        ? "▶ Continuar"
        : "▶ Ver película";

    boton.addEventListener("click", () => abrirReproductor(pelicula));

    contenido.appendChild(boton);

    tarjeta.appendChild(contenido);
    return tarjeta;
}

function mostrarLista(contenedorId, lista, mensaje) {
    const contenedor = $(contenedorId);
    contenedor.replaceChildren();

    if (!lista.length) {
        const texto = document.createElement("p");
        texto.className = "vacio";
        texto.textContent = mensaje;
        contenedor.appendChild(texto);
        return;
    }

    lista.forEach(pelicula => {
        contenedor.appendChild(crearTarjeta(pelicula));
    });
}

function renderizar() {
    const busqueda = $("buscador").value.trim().toLowerCase();
    const filtro = $("filtro").value;

    const filtradas = peliculas.filter(pelicula => {
        const coincideBusqueda = [
            pelicula.titulo,
            pelicula.genero,
            pelicula.anio
        ].join(" ").toLowerCase().includes(busqueda);

        const coincideTipo = filtro === "todos" || pelicula.tipo === filtro;

        return coincideBusqueda && coincideTipo;
    });

    mostrarLista(
        "continuar",
        filtradas.filter(p => datos(p.id).minuto > 0 && !datos(p.id).vista),
        "Todavía no hay películas para continuar."
    );

    mostrarLista(
        "pendientes",
        filtradas.filter(p => datos(p.id).pendiente && !datos(p.id).vista),
        "Todavía no han añadido películas a pendientes."
    );

    mostrarLista(
        "catalogo",
        filtradas,
        "No se encontraron películas con esos criterios."
    );
}

function abrirReproductor(pelicula) {
    actual = pelicula;
    const progreso = datos(pelicula.id);

    $("titulo-modal").textContent = pelicula.titulo;
    $("minuto").value = progreso.minuto || "";
    $("progreso-guardado").textContent = progreso.minuto > 0
        ? `Último minuto guardado: ${progreso.minuto}`
        : "Aún no han guardado un minuto.";

    $("video").src = enlaceReproductor(pelicula);
    actualizarBotones();
    $("reproductor").showModal();
}

function actualizarBotones() {
    if (!actual) return;

    const progreso = datos(actual.id);

    $("pendiente-modal").textContent = progreso.pendiente
        ? "♥ Quitar de pendientes"
        : "♡ Añadir a pendientes";

    $("vista-modal").textContent = progreso.vista
        ? "↩ Marcar como no vista"
        : "✓ Marcar como vista";
}

$("guardar-progreso").addEventListener("click", () => {
    if (!actual) return;

    const minuto = Number($("minuto").value);

    if (!Number.isFinite(minuto) || minuto < 0) {
        $("progreso-guardado").textContent = "Introduce un minuto válido.";
        return;
    }

    datos(actual.id).minuto = Math.floor(minuto);
    datos(actual.id).vista = false;

    guardarEstado();
    $("progreso-guardado").textContent =
        `Progreso guardado: minuto ${Math.floor(minuto)}.`;

    renderizar();
});

$("pendiente-modal").addEventListener("click", () => {
    if (!actual) return;

    const progreso = datos(actual.id);
    progreso.pendiente = !progreso.pendiente;

    guardarEstado();
    actualizarBotones();
    renderizar();
});

$("vista-modal").addEventListener("click", () => {
    if (!actual) return;

    const progreso = datos(actual.id);
    progreso.vista = !progreso.vista;

    if (progreso.vista) {
        progreso.pendiente = false;
    }

    guardarEstado();
    actualizarBotones();
    renderizar();
});

function cerrarReproductor() {
    $("video").src = "about:blank";
    $("reproductor").close();
    actual = null;
    renderizar();
}

$("cerrar").addEventListener("click", cerrarReproductor);

$("reproductor").addEventListener("click", (evento) => {
    if (evento.target === $("reproductor")) {
        cerrarReproductor();
    }
});

$("buscador").addEventListener("input", renderizar);
$("filtro").addEventListener("change", renderizar);

renderizar();
