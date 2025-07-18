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

export function enviarEjemplo() {
  const ejemplo = "Hoy fue un día extraño, no sabría decir si fue bueno o malo.";

  // Guarda la frase y un flag diferente en Firebase
  push(frasesRef, {
    texto: ejemplo,
    timestamp: Date.now(),
    tipo: "ejemplo"
  }).then(() => {
    localStorage.setItem("grayscaleEjemplo", "true");
    window.location.href = "index.html";
  }).catch((error) => {
    console.error("Error al enviar ejemplo:", error);
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
    const datosFrase = snapshot.val();
    const frase = datosFrase.texto;
    textoMostrado.value = frase;

    const esEjemplo = datosFrase.tipo === "ejemplo" && localStorage.getItem("grayscaleEjemplo") === "true";

    if (esEjemplo) {
      // Para ejemplos: poner en gris positivo y negativo
      const bueno = document.getElementById("imgBueno");
      const buenoM = document.getElementById("imgBuenoM");
      const malo = document.getElementById("imgMalo");
      const maloM = document.getElementById("imgMaloM");

      const textoPositivo = document.getElementById("textoPositivo");
      const textoNegativo = document.getElementById("textoNegativo");

      [bueno, buenoM, malo, maloM].forEach(img => {
        if (img) img.style.filter = "grayscale(100%)";
      });

      if (textoPositivo) textoPositivo.style.color = "gray";
      if (textoNegativo) textoNegativo.style.color = "gray";

      setTimeout(() => {
        [bueno, buenoM, malo, maloM].forEach(img => {
          if (img) img.style.filter = "none";
        });

        if (textoPositivo) textoPositivo.style.color = "";
        if (textoNegativo) textoNegativo.style.color = "";

        localStorage.removeItem("grayscaleEjemplo");
      }, 10000);
    } else {
      // Para texto analizado: poner en gris neutral y negativo
      const neutro = document.getElementById("imgNeutro");
      const neutroM = document.getElementById("imgNeutroM");
      const malo = document.getElementById("imgMalo");
      const maloM = document.getElementById("imgMaloM");

      const textoNeutral = document.getElementById("textoNeutral");
      const textoNegativo = document.getElementById("textoNegativo");

      [neutro, neutroM, malo, maloM].forEach(img => {
        if (img) img.style.filter = "grayscale(100%)";
      });

      if (textoNeutral) textoNeutral.style.color = "gray";
      if (textoNegativo) textoNegativo.style.color = "gray";

      setTimeout(() => {
        [neutro, neutroM, malo, maloM].forEach(img => {
          if (img) img.style.filter = "none";
        });

        if (textoNeutral) textoNeutral.style.color = "";
        if (textoNegativo) textoNegativo.style.color = "";
      }, 10000);
    }

    // Borrar la frase después de 10 segundos
    setTimeout(() => {
      textoMostrado.value = "";
      remove(snapshot.ref).catch(error => {
        console.error("Error al borrar frase:", error);
      });
    }, 10000);
  });
}