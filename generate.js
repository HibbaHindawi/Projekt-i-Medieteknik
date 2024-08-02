// Globala variabler och konstanter
let apiUrl = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall&descriptions=museum,slott,biograf,ateljé,konstgalleri,kyrka,fornlämning";
let generateButton; // För knappen
let randomInfoBtn;
let errorElem;

let childElem; // Element för barn alternativet
let studentElem; // Element för student alternativet
let seniorElem; // Element för pensionär alternativet
let outdoorElem; // Element för utomhus alternativet
let citiesElem; // Element för städernas alternativ
let filterlist; // Element för att skapa alternativ till städerna
// ---------------------------------------------------
//Körs när sidan laddar
function init() {
    let filterElem = document.querySelector("#filter-system-random");
    childElem = document.querySelector("#child");
    studentElem = document.querySelector("#student");
    seniorElem = document.querySelector("#senior");
    outdoorElem = document.querySelector("#outdoor");
    errorElem = document.getElementById("error");
    if(filterElem){
        getSMAPIonce();
        resetFilter();
        document.querySelector("#reset").addEventListener("click", resetFilter);
    }
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
function getSMAPIonce() {
    url = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall&descriptions=museum,slott,biograf,ateljé,konstgalleri,kyrka,fornlämning"
    fetch(url)
        .then(response => response.json())
        .then(data => {
            createFilters(data);
        })
        .catch(error => {
            console.error("det uppstod ett problem: " + error);
        });
}
// Avcheckar alla filteralternativ
function resetFilter() {
    citiesElem = document.querySelectorAll("#popular input");
    //Uncheck
    for (let i = 0; i < citiesElem.length; i++) {
        citiesElem[i].checked = false;
    }
    childElem.checked = false;
    studentElem.checked = false;
    seniorElem.checked = false;
    outdoorElem.checked = false;
    filterResults();
}

function createFilters(data) {
    filterlist = document.querySelector("#popular");
    filterlist.innerHTML = "";
    let uniqueCities = [];
    for (let i = 0; i < data.payload.length; i++) {
        let SMAPIdata = data.payload[i];
        const city = SMAPIdata.city;
        if (!uniqueCities.includes(city)) {
            uniqueCities.push(city);
        }
    }
    uniqueCities.sort();
    for (let j = 0; j < uniqueCities.length; j++) {
        const divElem = document.createElement("div");
        const inputElem = document.createElement("input");
        inputElem.id = uniqueCities[j];
        inputElem.type = "checkbox";
        const labelElem = document.createElement("label");
        labelElem.textContent = uniqueCities[j];
        labelElem.htmlFor = uniqueCities[j];
        divElem.appendChild(inputElem);
        divElem.appendChild(labelElem);
        filterlist.appendChild(divElem);
    }
    if (filterlist) {
        let filter = document.querySelectorAll("#filter-system-random input");
        for (let i = 0; i < filter.length; i++) {
            filter[i].addEventListener("change", filterResults);
        }
        citiesElem = document.querySelectorAll("#popular input");
        filterResults();
    }
}
//Filtrerar resultaten för SMAPI
function filterResults() {
    apiUrl = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall&descriptions=museum,slott,biograf,ateljé,konstgalleri,kyrka,fornlämning";//Base URL
    if (childElem.checked == true) {
        apiUrl += "&child_discount=Y";
    }
    if (studentElem.checked == true) {
        apiUrl += "&student_discount=Y";
    }
    if (seniorElem.checked == true) {
        apiUrl += "&senior_discount=Y";
    }
    if (outdoorElem.checked == true) {
        apiUrl += "&outdoors=Y";
    }

    let cityURL = "&cities=";
    cityCounter = 0;
    for (let i = 0; i < citiesElem.length; i++) {
        if (citiesElem[i].checked == true) {
            cityURL += citiesElem[i].id + ",";
        }
        if (citiesElem[i].checked == false) {
            cityCounter++
        }
    }
    
    if (cityCounter == citiesElem.length) {
        cityURL = "";
    }
    //Övriga filter
    apiUrl += cityURL;
}
// ---------------------------------------------------
//Hämtar data
function getActivities() {
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if(errorElem){
            errorElem.innerText = "";
        }
        getRandomActivity(data)
    })
    .catch(error => {
        errorElem.innerText = "Aktiviteten som du söker finns inte, testa söka med andra filter.";
        console.log("Error message: " + error);
    })
}

//Skapar slumpmässig index
function getRandomActivity(data) {
    let i = Math.floor(Math.random() * data.payload.length);
    window.location.href = "information.html?id=" + data.payload[i].id;
}