let url; //URL för SMAPI
let cityCounter; // Räknare för filteralternativen av städerna

//filter
let savedElem; // Element för sparade alternativet
let childElem; // Element för barn alternativet
let studentElem; // Element för student alternativet
let seniorElem; // Element för pensionär alternativet
let outdoorElem; // Element för utomhus alternativet

let activityTypeElem; // Element för aktivitet alternativen
let activitiyId = ["museum", "slott", "kyrka", "fornlämning", "ateljé", "konstgalleri", "biograf"]; // Id för varje typ alternativ
let citiesElem; // Element för städernas alternativ
let resultElem; // Element för att visa alla aktiviteter
let filterlist; // Element för att skapa alternativ till städerna

//Körs när sidan laddar
function init() {
    activityTypeElem = document.querySelectorAll("#type input");
    savedElem = document.querySelector("#favoriteBox");
    childElem = document.querySelector("#child");
    studentElem = document.querySelector("#student");
    seniorElem = document.querySelector("#senior");
    outdoorElem = document.querySelector("#outdoor");

    resultElem = document.querySelector("#results");
    getSMAPIonce();
    resetFilter();
    document.querySelector("#reset").addEventListener("click", resetFilter);
}
window.addEventListener("load", init);
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
        let filter = document.querySelectorAll("#filter-system input");
        for (let i = 0; i < filter.length; i++) {
            filter[i].addEventListener("change", filterResults);
        }
        citiesElem = document.querySelectorAll("input");
        filterResults();
    }
}
//Filtrerar resultaten för SMAPI
function filterResults() {
    url = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall&order_by=city";//Base URL
    let typeURL = "&descriptions="; //filter url för typ av aktivitet
    let typeCounter = 0;
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

    for (let i = 0; i < activityTypeElem.length; i++) {
        if (activityTypeElem[i].checked == true) {
            typeURL += activitiyId[i] + ",";
        }
        if (activityTypeElem[i].checked == false) {
            typeCounter++;
        }
    }
    if (typeCounter == activityTypeElem.length) {
        typeURL += "museum,slott,biograf,ateljé,konstgalleri,kyrka,fornlämning"
    }
    let favoritesArray = [];
    if (typeof localStorage !== "undefined") {
        let storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites !== null) {
            favoritesArray = storedFavorites.split(",");
        }
    }

    if (favoritesArray.length > 0 && savedElem.checked) {
        url += "&ids=" + favoritesArray;
    }
    if (childElem.checked == true) {
        url += "&child_discount=Y";
    }
    if (studentElem.checked == true) {
        url += "&student_discount=Y";
    }
    if (seniorElem.checked == true) {
        url += "&senior_discount=Y";
    }
    if (outdoorElem.checked == true) {
        url += "&outdoors=Y";
    }
    //Övriga filter
    url += typeURL + cityURL;
    getSMAPI();
}

// Avcheckar alla filteralternativ
function resetFilter() {
    citiesElem = document.querySelectorAll("#popular input");
    //Uncheck
    for (let i = 0; i < activityTypeElem.length; i++) {
        activityTypeElem[i].checked = false;
    }
    for (let i = 0; i < citiesElem.length; i++) {
        citiesElem[i].checked = false;
    }
    savedElem.checked = false;
    childElem.checked = false;
    studentElem.checked = false;
    seniorElem.checked = false;
    outdoorElem.checked = false;
    filterResults();
}

// Hämtar info från SMAPI
function getSMAPI() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //Input code here
            createList(data);
        })
        .catch(error => {
            console.error("det uppstod ett problem: " + error);
        });
}

// Skapar HTML-kod för listan
function createList(data) {
    resultElem.innerHTML = "";
    if (data.payload.length == 0) {
        let errorElement = document.createElement("p");
        errorElement.id = "error";
        errorElement.innerText = "Tyvärr finns det inga resultat, testa söka med andra filter.";
        resultElem.appendChild(errorElement);
    }
    else {
        for (let i = 0; i < data.payload.length; i++) {
            let SMAPIdata = data.payload[i];
            let newA = document.createElement("a");
            newA.href = "information.html?id=" + SMAPIdata.id;
            newA.id = SMAPIdata.id;
            let favoritDiv = document.createElement("div");
            favoritDiv.classList.add("favorite");
            let heartIMG = document.createElement("img");
            let favoritesArray = []
            if (favoritesArray.length > 0 && favoritesArray.includes(newA.id)) {
                heartIMG.alt = "Full heart";
                heartIMG.src = "Bilder/Ikoner/heartFull.png";
            }
            else {
                heartIMG.alt = "empty heart";
                heartIMG.src = "Bilder/Ikoner/heartEmpty.png";
            }
            let id = newA.id;
            favoritDiv.appendChild(heartIMG);
            heartIMG.addEventListener("click", function (event) {
                addToFavorite(event, id);
            });
            let newDiv = document.createElement("div");
            newDiv.innerText = SMAPIdata.name + " - " + SMAPIdata.city;
            newDiv.classList.add("title");
            newA.classList.add("plats");
            newA.addEventListener("click", () => {
                // Store the SMAPIdata.id in localStorage
                localStorage.setItem("Id", newA.id);
            });
            newA.appendChild(newDiv);
            let infoElem = document.createElement("div");
            infoElem.classList.add("infoList");
            let outdoors;
            let student;
            let child;
            let senior;
            if (SMAPIdata.outdoors == "Y") {
                outdoors = "<img src='Bilder/Ikoner/checkmark.png' alt='checkmark'>";
            }
            else {
                outdoors = "<img src='Bilder/Ikoner/cross.png' alt='cross'>";
            }
            if (SMAPIdata.student_discount == "Y") {
                student = "<img src='Bilder/Ikoner/checkmark.png' alt='checkmark'>";
            }
            else {
                student = "<img src='Bilder/Ikoner/cross.png' alt='cross'>";
            }
            if (SMAPIdata.child_discount == "Y") {
                child = "<img src='Bilder/Ikoner/checkmark.png' alt='checkmark'>";
            }
            else {
                child = "<img src='Bilder/Ikoner/cross.png' alt='cross'>";
            }
            if (SMAPIdata.senior_discount == "Y") {
                senior = "<img src='Bilder/Ikoner/checkmark.png' alt='checkmark'>";
            }
            else {
                senior = "<img src='Bilder/Ikoner/cross.png' alt='cross'>";
            }
            infoElem.innerHTML = "<p><u>" + SMAPIdata.description + "</u></p><p><span>Utomhus:</span> " + outdoors + " | <span>Barn Rabatt:</span> " + child + " | <span>Student Rabatt:</span> " + student + " | <span>Pensionär Rabatt:</span> " + senior + "</p>";
            newA.appendChild(infoElem);

            let parentDiv = document.createElement("div");
            parentDiv.appendChild(newA);
            parentDiv.appendChild(favoritDiv);
            parentDiv.classList.add("parentDiv");
            resultElem.appendChild(parentDiv);
        }
    }
}

// Lägger till den valda aktiviteten i sparade
function addToFavorite(event, id) {
    let clickedIMG = event.target;
    let favoritesArray = localStorage.getItem("favorites");

    if (favoritesArray != null && favoritesArray.includes(id)) {
        clickedIMG.src = "Bilder/Ikoner/heartEmpty.png";
        let filteredNumbers = favoritesArray.split(",").filter(number => number !== id);
        localStorage.setItem("favorites", filteredNumbers.join(","));
    } else {
        if (favoritesArray) {
            favoritesArray += ",";
        } else {
            favoritesArray = "";
        }
        favoritesArray += id;
        clickedIMG.src = "Bilder/Ikoner/heartFull.png";
        localStorage.setItem("favorites", favoritesArray);
    }
}