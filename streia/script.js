/* =========================================
   CONFIGURACIÓN
========================================= */

const STORAGE_DONATIONS = "streia_donations_v4";

const POINTS_PER_SOL = 10;

const LEVELS = [
    50, 150, 300, 500, 750,
    1000, 1500, 2000, 3000, 5000
];

const $ = id => document.getElementById(id);


/* =========================================
   PERSONAS DEL MURO DE AGRADECIMIENTOS

   EDITA ESTA LISTA DIRECTAMENTE EN EL CÓDIGO.
   Puedes agregar tantas personas como quieras.
========================================= */

const PERSONAS_AGRADECIDAS = [
    {
        nombre: "Steitas",
        reconocimiento: "MVP del Live",
        mensaje: "Gracias por tu apoyo, tu cariño y por formar parte de esta bonita comunidad rodrix me llegas al pincho.",
        icono: "",
        fecha: "Siempre en nuestra comunidad"
    },
    {
        nombre: "Moredadores",
        reconocimiento: "Miembro especial",
        mensaje: "Gacias por cuidar el live y ser activos en nuestra comunidad.",
        icono: "🌷",
        fecha: "Siempre en nuestra comunidad"
    },
    {
        nombre: "Super Fan",
        reconocimiento: "Moderador/a",
        mensaje: "No se que poner :v.",
        icono: "🛡️",
        fecha: "Siempre en nuestra comunidad"
    }
];


/* =========================================
   ALMACENAMIENTO
========================================= */

function loadData(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : null;
    } catch {
        return null;
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

let donations = loadData(STORAGE_DONATIONS);


/* =========================================
   PERSONA DE EJEMPLO

   Solo se crea cuando todavía no existen registros.
   Puedes cambiar el nombre y el monto.
========================================= */

function createExampleIfNeeded() {

    if (donations !== null) return;

    donations = [
        {
            id: "example-diego",
            name: "Diego",
            amount: 10,
            points: 100,
            message: "¡Con mucho cariño para Streia!",
            photo: "",
            date: peruDate(),
            createdAt: Date.now()
        }
    ];

    saveData(STORAGE_DONATIONS, donations);
}


/* =========================================
   FECHA DE PERÚ
========================================= */

function peruDate(date = new Date()) {

    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Lima",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(date);

    const values = {};

    parts.forEach(part => {
        values[part.type] = part.value;
    });

    return `${values.year}-${values.month}-${values.day}`;
}

function formatDate(date = new Date()) {

    return new Intl.DateTimeFormat("es-PE", {
        timeZone: "America/Lima",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}


/* =========================================
   PUNTOS Y NIVELES
========================================= */

function calculatePoints(amount) {
    return Math.round(amount * POINTS_PER_SOL);
}

function getLevel(points) {

    let level = 0;
    let previousThreshold = 0;
    let nextThreshold = LEVELS[0];

    for (let i = 0; i < LEVELS.length; i++) {

        if (points >= LEVELS[i]) {
            level = i + 1;
            previousThreshold = LEVELS[i];
        } else {
            nextThreshold = LEVELS[i];
            break;
        }
    }

    if (level === LEVELS.length) {
        nextThreshold = previousThreshold;
    }

    const progress = nextThreshold > previousThreshold
        ? Math.min(
            100,
            Math.max(
                0,
                ((points - previousThreshold) /
                (nextThreshold - previousThreshold)) * 100
            )
        )
        : 100;

    return {
        level,
        progress,
        remaining: Math.max(0, nextThreshold - points)
    };
}


/* =========================================
   FORMATO Y SEGURIDAD
========================================= */

function money(amount) {
    return new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN"
    }).format(amount);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function defaultAvatar(name) {

    const initial = String(name || "?")
        .trim()
        .charAt(0)
        .toUpperCase();

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
            <rect width="100" height="100" rx="50" fill="#f5e5f4"/>
            <text x="50%" y="55%" dominant-baseline="middle"
                text-anchor="middle" font-size="42"
                font-family="Arial" fill="#a995d8">
                ${escapeHTML(initial)}
            </text>
        </svg>
    `;

    return "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg);
}

function getAvatar(name, photo) {
    return photo || defaultAvatar(name);
}


/* =========================================
   AGRUPAR DONADORES HISTÓRICOS
========================================= */

function getDonors() {

    const grouped = {};

    donations.forEach(donation => {

        const key = donation.name.trim().toLowerCase();

        if (!grouped[key]) {
            grouped[key] = {
                name: donation.name,
                amount: 0,
                points: 0,
                photo: ""
            };
        }

        grouped[key].amount += Number(donation.amount);
        grouped[key].points += Number(donation.points);

        if (donation.photo) {
            grouped[key].photo = donation.photo;
        }
    });

    return Object.values(grouped);
}


/* =========================================
   RANKING DEL DÍA
========================================= */

function getTodayDonors() {

    const today = peruDate();
    const grouped = {};

    donations.forEach(donation => {

        if (donation.date !== today) return;

        const key = donation.name.trim().toLowerCase();

        if (!grouped[key]) {
            grouped[key] = {
                name: donation.name,
                amount: 0,
                photo: ""
            };
        }

        grouped[key].amount += Number(donation.amount);

        if (donation.photo) {
            grouped[key].photo = donation.photo;
        }
    });

    return Object.values(grouped).sort(
        (a, b) => b.amount - a.amount
    );
}


/* =========================================
   PODIO
========================================= */

function renderPodium(todayDonors) {

    const podium = $("podium");

    if (!todayDonors.length) {
        podium.innerHTML = `
            <div class="podium-empty">
                <div style="font-size:35px;margin-bottom:12px;">💗</div>
                <strong>¡El podio está esperando!</strong>
                <p style="margin-top:8px;font-size:12px;">
                    Sé la primera persona en apoyar hoy.
                </p>
            </div>
        `;
        return;
    }

    const positions = [
        { index: 1, className: "second", medal: "🥈" },
        { index: 0, className: "first", medal: "👑" },
        { index: 2, className: "third", medal: "🥉" }
    ];

    podium.innerHTML = positions.map(position => {

        const donor = todayDonors[position.index];

        if (!donor) {
            return `<div class="podium-card ${position.className}"></div>`;
        }

        return `
            <div class="podium-card ${position.className}">
                <div class="podium-position">${position.medal}</div>

                <img
                    src="${getAvatar(donor.name, donor.photo)}"
                    alt="Foto de ${escapeHTML(donor.name)}"
                >

                <h3>${escapeHTML(donor.name)}</h3>
                <p>${money(donor.amount)}</p>
            </div>
        `;

    }).join("");
}


/* =========================================
   TARJETAS DEL RANKING
========================================= */

function renderRanking(todayDonors) {

    const ranking = $("ranking");

    if (!todayDonors.length) {
        ranking.innerHTML = "";
        return;
    }

    const lifetimeDonors = getDonors();

    ranking.innerHTML = todayDonors.map((donor, index) => {

        const lifetime = lifetimeDonors.find(item =>
            item.name.trim().toLowerCase() ===
            donor.name.trim().toLowerCase()
        );

        const totalPoints = lifetime ? lifetime.points : 0;
        const levelData = getLevel(totalPoints);
        const photo = lifetime?.photo || donor.photo;

        return `
            <article class="donor-card">

                <div class="donor-position">#${index + 1}</div>

                <img
                    class="donor-photo"
                    src="${getAvatar(donor.name, photo)}"
                    alt="Foto de ${escapeHTML(donor.name)}"
                >

                <div class="donor-info">

                    <h3>${escapeHTML(donor.name)}</h3>

                    <span class="donor-level">
                        NIVEL ${levelData.level}
                    </span>

                    <div class="donor-points">
                        ${totalPoints.toLocaleString("es-PE")} puntos acumulados
                    </div>

                    <div class="progress-container">
                        <div
                            class="progress-bar"
                            style="width:${levelData.progress}%"
                        ></div>
                    </div>

                    <div class="progress-info">
                        <span>${Math.round(levelData.progress)}% hacia el siguiente nivel</span>
                        <span>
                            ${levelData.remaining > 0
                                ? `Faltan ${levelData.remaining} pts`
                                : "Nivel máximo"}
                        </span>
                    </div>

                </div>

                <div class="donor-total">
                    <strong>${money(donor.amount)}</strong>
                    <span>Hoy</span>
                </div>

            </article>
        `;

    }).join("");
}


/* =========================================
   MURO DE AGRADECIMIENTOS
========================================= */

function renderMembers() {

    const container = $("members");

    if (!PERSONAS_AGRADECIDAS.length) {
        container.innerHTML = `
            <div class="empty-wall">
                <strong>Pronto tendremos nuevos agradecimientos.</strong>
            </div>
        `;
        return;
    }

    container.innerHTML = PERSONAS_AGRADECIDAS.map(persona => {

        return `
            <article class="member-card">

                <div class="member-icon">
                    ${escapeHTML(persona.icono || "💗")}
                </div>

                <h3>${escapeHTML(persona.nombre)}</h3>

                <span class="member-role">
                    ${escapeHTML(persona.reconocimiento)}
                </span>

                <p>${escapeHTML(persona.mensaje)}</p>

                <div class="member-date">
                    ${escapeHTML(persona.fecha || "")}
                </div>

            </article>
        `;

    }).join("");
}


/* =========================================
   ACTUALIZAR PÁGINA
========================================= */

function render() {

    $("today").textContent = formatDate();

    const todayDonors = getTodayDonors();

    renderPodium(todayDonors);
    renderRanking(todayDonors);
    renderMembers();
}


/* =========================================
   PREVISUALIZAR PUNTOS
========================================= */

$("donor-amount").addEventListener("input", () => {

    const amount = Number($("donor-amount").value);

    const points = amount > 0
        ? calculatePoints(amount)
        : 0;

    $("donor-points").value = points > 0
        ? `${points} puntos`
        : "";
});


/* =========================================
   LEER FOTO
========================================= */

function readPhoto(file) {

    return new Promise((resolve, reject) => {

        if (!file) {
            resolve("");
            return;
        }

        if (!file.type.startsWith("image/")) {
            reject(new Error("El archivo debe ser una imagen."));
            return;
        }

        if (file.size > 1024 * 1024) {
            reject(new Error("La foto no debe superar 1 MB."));
            return;
        }

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(
            new Error("No se pudo leer la imagen.")
        );

        reader.readAsDataURL(file);
    });
}


/* =========================================
   REGISTRAR YAPE
========================================= */

$("donation-form").addEventListener("submit", async event => {

    event.preventDefault();

    const name = $("donor-name").value.trim();
    const amount = Number($("donor-amount").value);
    const message = $("donor-message").value.trim();
    const file = $("donor-photo").files[0];

    if (!name || !Number.isFinite(amount) || amount <= 0) {
        showStatus("Revisa el nombre y el monto.");
        return;
    }

    try {

        const photo = await readPhoto(file);
        const points = calculatePoints(amount);

        donations.push({
            id: Date.now() + Math.random(),
            name,
            amount,
            points,
            message,
            photo,
            date: peruDate(),
            createdAt: Date.now()
        });

        saveData(STORAGE_DONATIONS, donations);

        render();

        $("donation-form").reset();
        $("donor-points").value = "";

        showStatus(
            `¡Aporte de ${name} registrado! +${points} puntos 💗`
        );

    } catch (error) {
        showStatus(error.message);
    }
});


/* =========================================
   MENSAJES
========================================= */

function showStatus(message) {
    $("status").textContent = message;
}


/* =========================================
   MOSTRAR / OCULTAR ADMINISTRACIÓN
========================================= */

$("admin-toggle").addEventListener("click", () => {

    $("admin-panel").classList.toggle("hidden");

    if (!$("admin-panel").classList.contains("hidden")) {
        $("admin-panel").scrollIntoView({
            behavior: "smooth"
        });
    }
});


/* =========================================
   BORRAR APORTES DE HOY
========================================= */

$("clear-today").addEventListener("click", () => {

    const confirmed = confirm(
        "¿Seguro que quieres borrar todos los aportes de hoy?"
    );

    if (!confirmed) return;

    const today = peruDate();

    donations = donations.filter(
        donation => donation.date !== today
    );

    saveData(STORAGE_DONATIONS, donations);

    render();

    showStatus("Los aportes de hoy fueron eliminados.");
});


/* =========================================
   BORRAR TODOS LOS DATOS
========================================= */

$("clear-all").addEventListener("click", () => {

    const confirmed = confirm(
        "¿Seguro que quieres borrar TODOS los aportes? Esta acción no se puede deshacer."
    );

    if (!confirmed) return;

    donations = [];

    saveData(STORAGE_DONATIONS, donations);

    render();

    showStatus("Todos los aportes fueron eliminados.");
});


/* =========================================
   INICIAR
========================================= */

if (donations === null) {
    createExampleIfNeeded();
}

render();