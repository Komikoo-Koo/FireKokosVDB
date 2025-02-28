// 🔥 Cargar configuración desde GitHub y asegurarse de que Firebase esté inicializado
async function cargarConfigFirebase() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/Komikoo-Koo/FireKokosVDB/Scripts/firebase-config.js");
        const script = await response.text();
        eval(script); // 🔥 Carga la configuración de Firebase

        if (typeof firebaseConfig !== "undefined") {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            window.auth = firebase.auth();
            window.db = firebase.database();

            console.log("🔥 Firebase inicializado correctamente.");
            window.firebaseInicializado = true; // 🔥 Confirmar que Firebase está listo

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

// 🔥 Esperar a que Firebase esté inicializado antes de ejecutar cualquier código
function esperarFirebase() {
    return new Promise(resolve => {
        const intervalo = setInterval(() => {
            if (window.firebaseInicializado) {
                clearInterval(intervalo);
                resolve();
            }
        }, 100); // 🔥 Verifica cada 100ms si Firebase ya se inicializó
    });
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
