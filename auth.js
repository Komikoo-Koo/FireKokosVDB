// 🔥 Cargar configuración desde GitHub
async function cargarConfigFirebase() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/Komikoo-Koo/FireKokosVDB/Scripts/firebase-config.js");
        const script = await response.text();
        eval(script); // 🔥 Carga la configuración de Firebase

        if (typeof firebaseConfig !== "undefined") {
            firebase.initializeApp(firebaseConfig);

            window.auth = firebase.auth();
            window.db = firebase.database();

            console.log("🔥 Firebase inicializado correctamente.");

            // 🔥 Detectar sesión activa en todas las páginas
            auth.onAuthStateChanged(user => {
                if (user) {
                    console.log("🔥 Usuario autenticado:", user.email);
                    obtenerDatosUsuario(user.uid);
                } else {
                    console.log("🚫 No hay usuario autenticado.");
                    if (!window.location.href.includes("login.html")) {
                        window.location.href = "login.html"; // 🔥 Redirigir si no hay sesión activa
                    }
                }
            });

        } else {
            console.error("🔥 Error: No se pudo cargar la configuración de Firebase.");
        }
    } catch (error) {
        console.error("🔥 Error al cargar Firebase Config:", error);
    }
}

// 🔥 Obtener datos del usuario
async function obtenerDatosUsuario(uid) {
    try {
        const snapshot = await db.ref("usuarios/" + uid).once("value");
        if (snapshot.exists()) {
            const datos = snapshot.val();
            console.log("🔥 Datos del usuario:", datos);
            if (document.getElementById("usuarioNombre")) {
                document.getElementById("usuarioNombre").innerText = datos.nombre;
            }
            if (document.getElementById("usuarioRol")) {
                document.getElementById("usuarioRol").innerText = datos.rol;
            }

            // 🔥 Redirigir según el rol
            if (datos.rol === "medico" && window.location.pathname !== "/medico.html") {
                window.location.href = "medico.html";
            } else if (datos.rol === "paciente" && window.location.pathname !== "/paciente.html") {
                window.location.href = "paciente.html";
            }
        }
    } catch (error) {
        console.error("🔥 Error al obtener datos del usuario:", error);
    }
}

// 🔥 Función para cerrar sesión
function cerrarSesion() {
    auth.signOut().then(() => {
        window.location.href = "login.html"; // 🔥 Redirigir al login después de cerrar sesión
    }).catch(error => {
        console.error("🔥 Error al cerrar sesión:", error);
    });
}

cargarConfigFirebase();
