import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getDatabase, 
  ref, 
  push, 
  onChildAdded, 
  remove 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXgn-MWg7odpGRW91wNnJky5Z8MBxnZM0",
  authDomain: "clasificaciontexto.firebaseapp.com",
  projectId: "clasificaciontexto",
  storageBucket: "clasificaciontexto.appspot.com",  
  messagingSenderId: "340331082605",
  appId: "1:340331082605:web:486ad984dd36dbadd0e064"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const frasesRef = ref(database, "frases");

//Borrar todas las frases de la BD cada 24 horas
/*
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.borrarFrasesAntiguas = functions.pubsub.schedule("every 24 hours").onRun(() => {
  const ref = admin.database().ref("frases");
  ref.remove(); // Borra todo el nodo
});*/


// FUNCIÓN PARA ENVIAR FRASES
export function analizarTexto() {
  const frase = document.querySelector(".feelings-box2").value;
  
  // Guarda la frase en Firebase con timestamp
  push(frasesRef, {
    texto: frase,
    timestamp: Date.now()  // Ordenar por tiempo de llegada
  }).then(() => {
    window.location.href = "index.html";  // Redirige al index
  }).catch((error) => {
    console.error("Error al guardar:", error);
  });
}

// FUNCIÓN PARA MOSTRAR FRASES
export function mostrarFrasesEnTiempoReal() {
  const textoMostrado = document.querySelector(".feelings-box.textomostrar");
  
  // Verifica que el elemento textarea exista
  if (!textoMostrado) {
    console.error("No se encontró el textarea con clase 'feelings-box textomostrar'");
    return;
  }

  // Escucha cambios en la referencia 'frases'
  onChildAdded(frasesRef, (snapshot) => {
    const frase = snapshot.val().texto;
    console.log("Frase recibida de Firebase:", frase); // Debug
    
    textoMostrado.value = frase;
    
    setTimeout(() => {
      textoMostrado.value = "";
      remove(snapshot.ref).catch(error => {
        console.error("Error al borrar frase:", error);
      });
    }, 10000);
  });
}

