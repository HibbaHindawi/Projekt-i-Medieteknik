// Globala variabler och konstanter
let apiUrl = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall&descriptions=museum,slott,biograf,ateljé,konstgalleri,kyrka,fornlämning";
let generateButton; // För knappen
// ---------------------------------------------------
//Körs när sidan laddar
function init() {
    generateButton = document.querySelector("#generateButton"); // Hämtar knappen
    if (generateButton) {
        generateButton.addEventListener("click", getActivities); // Gör knappen aktiv
    }
    randomInfoBtn = document.querySelector("#randomInformation");
    if (randomInfoBtn) {
        randomInfoBtn.addEventListener("click", getActivities);
    }
} // Slut init

window.addEventListener("load", init);
// ---------------------------------------------------

// ---------------------------------------------------
//Hämtar data
function getActivities() {
    let request = new XMLHttpRequest();
    request.responseType = "text";
    request.open("GET", apiUrl);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) {
                getRandomActivity(JSON.parse(request.responseText));
            }
    }
}

//Skapar slumpmässig index
function getRandomActivity(jsonData) {
    const ix = Math.floor(Math.random() * jsonData.payload.length);
    window.location.href = "information.html?id=" + jsonData.payload[ix].id;
}

//Skickar svar från getActivities till getRandomActivity
function generateRandomActivity() {
    const activities = getActivities();
    getRandomActivity(activities);
}