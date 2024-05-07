// Globala variabler och konstanter
const activities = ["Museum", "Slott", "Kyrka", "Fornlämning", "Ateljé", "Biograf"]

let generateButton; // För knappen
let activiti; // För aktiviteten
// ---------------------------------------------------

function init() {
    generateButton = document.querySelector("#generateButton"); // Hämtar knappen

    activiti = document.querySelector("#activiti"); // Hämtar div

    generateButton.addEventListener("click", startProgram); // Gör knappen aktiv
} // Slut init

window.addEventListener("load", init);
// ---------------------------------------------------

// Skapar random funktionen
function startProgram() {
    let ix = Math.floor(Math.random() * activities.length);
    activiti.innerHTML = activities[ix];
} // Slut startProgram
// ---------------------------------------------------