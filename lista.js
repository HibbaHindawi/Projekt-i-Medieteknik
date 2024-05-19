let url; //URL för SMAPI
let cityCounter;

//filter
let savedElem;
let childElem;
let studentElem;
let seniorElem;
let outdoorElem;

let activityTypeElem;
let activitiyId = ["museum", "slott", "kyrka", "fornlämning", "ateljé", "konstgalleri", "biograf"];
let citiesElem;
let moreCitiesElem;
let idOne = ["alvesta", "älmhult", "åseda", "berga", "borgholm", "braås", "dädesjö", "degerhamn", "dörarp", "eksjö", "färjestaden", "gemla", "gnosjö", "göteryd", "gränna", "gripenberg", "halltorp", "hamneda", "hjärtlanda", "hovmantorp", "hultsfred", "huskvarna", "hylletofta", "ingelstad", "jönköping", "kalmar", "känna", "kävsjö", "långasjö", "lessebo", "lidhult", "linneryd", "ljungby", "ljungbyholm", "målilla", "mörbylånga", "myresjö", "norrhult", "norrahammar", "nybro", "pelarne", "sävsjö", "sandby", "skruv", "stockaryd", "valdemarsvik", "värnamo", "växjö", "vetlanda", "vimmerby", "visingsö", "vissefjärda", "virseram", "virsaram"];

let resultElem;


function init() {
    activityTypeElem = document.querySelectorAll("#type input");
    citiesElem = document.querySelectorAll("#popular input");
    savedElem = document.querySelector("#favoriteBox");
    childElem = document.querySelector("#child");
    studentElem = document.querySelector("#student");
    seniorElem = document.querySelector("#senior");
    outdoorElem = document.querySelector("#outdoor");

    resultElem = document.querySelector("#results");
    resetFilter();
    filterResults();
    let filter = document.querySelectorAll("#filter-system input");
    for (let i = 0; i < filter.length; i++) {
        filter[i].addEventListener("change", filterResults);
    }
    document.querySelector("#reset").addEventListener("click", resetFilter);
}
window.addEventListener("load", init);

function filterResults() {
    url = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall&order_by=city";//Base URL
    let typeURL = "&descriptions="; //filter url för typ av aktivitet
    let typeCounter = 0;

    let cityURL = "&cities=";
    cityCounter = 0;
    for (let i = 0; i < citiesElem.length; i++) {
        if (citiesElem[i].checked == true) {
            cityURL += idOne[i] + ",";
        }
        if (citiesElem[i].checked == false) {
            cityCounter++
        }
    }
    if (cityCounter == 54) {
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
    if (typeCounter == 7) {
        typeURL += "museum,slott,biograf,ateljé,konstgalleri,kyrka,fornlämning"
    }
    let favoritesArray = [];
    if (typeof localStorage !== "undefined") {
        // localStorage is supported
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
function resetFilter() {
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
            newA.href = "information.html";
            newA.id = SMAPIdata.id;
            let favoritDiv = document.createElement("div");
            favoritDiv.classList.add("favorite");
            let heartIMG = document.createElement("img");
            let favoritesArray = localStorage.getItem("favorites");
            if (favoritesArray.includes(newA.id)) {
                heartIMG.alt = "Full heart";
                heartIMG.src = "Bilder/Ikoner/heartFull.png";
            }
            else {
                heartIMG.alt = "empty heart";
                heartIMG.src = "Bilder/Ikoner/heartEmpty.png";
            }
            let id = newA.id;
            heartIMG.addEventListener("click", function (event) {
                addToFavorite(event, id);
            });
            favoritDiv.appendChild(heartIMG);
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

function addToFavorite(event, id) {
    let clickedIMG = event.target;
    let favoritesArray = [];
    if (typeof localStorage !== "undefined") {
        // localStorage is supported
        let storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites !== null) {
            favoritesArray = storedFavorites.split(",");
        }
    }

    if (favoritesArray.length > 0 && favoritesArray.includes(id)) {
        clickedIMG.src = "Bilder/Ikoner/heartEmpty.png";
        let filteredNumbers = favoritesArray
            .split(",") // Convert favoritesArray string to an array
            .filter(number => number !== id);
        localStorage.setItem("favorites", filteredNumbers.join(",")); // Convert filteredNumbers array back to a string before storing in localStorage
    }
    else {
        favoritesArray = ""; // Initialize favoritesArray as an empty string if it is null
        favoritesArray += (favoritesArray.length === 0 ? "" : ",") + id; // Append the new id to favoritesArray
        clickedIMG.src = "Bilder/Ikoner/heartFull.png";
        localStorage.setItem("favorites", favoritesArray);
    }

}