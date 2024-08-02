let myMap; //Objekt för kartan;
let markers = L.layerGroup(); //Array med alla markörer
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
let filterlist; // Element för att skapa alternativ till städerna
//Ikoner

let icons = L.Icon.extend({ //Skapar inställningar för ikoner
    options: {
        iconSize: [25, 50],
        iconAnchor: [12, 49],
        popupAnchor: [0, -50]
    }
})
let museumIcon = new icons({ //Ikon för museum
    iconUrl: "Bilder/Markers/markermuseum.png"
})
let slottIcon = new icons({ //Ikon för slott
    iconUrl: "Bilder/Markers/markercastle.png"
})
let kyrkaIcon = new icons({ // Ikon för kyrka
    iconUrl: "Bilder/Markers/markerchurch.png"
})
let fornlamningIcon = new icons({ //Ikon för fornlämningar
    iconUrl: "Bilder/Markers/markerancientmonument.png"
})
let konstgalleriIcon = new icons({ //ikon för konstgalleri
    iconUrl: "Bilder/Markers/markerartgallery.png"
})
let biografIcon = new icons({ //Ikon för biograf
    iconUrl: "Bilder/Markers/markercinema.png"
})

//Körs när sidan laddar
function init() {
    activityTypeElem = document.querySelectorAll("#type input");
    savedElem = document.querySelector("#favoriteBox");
    childElem = document.querySelector("#child");
    studentElem = document.querySelector("#student");
    seniorElem = document.querySelector("#senior");
    outdoorElem = document.querySelector("#outdoor");
    if (document.querySelector("#mapSma")) {
        initMap();
        resetFilter();
        getSMAPIonce();
    }
    window.addEventListener("resize", changeMap);
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
        citiesElem = document.querySelectorAll("#popular input");
        filterResults();
    }
}
//Skapar kartan
function initMap() {
    let zoom;
    if (window.innerWidth <= 450) {
        zoom = 7;
    }
    else if (window.innerWidth <= 600) {
        zoom = 7.4;
    }
    else if (window.innerWidth <= 800) {
        zoom = 7.6;
    }
    else if (window.innerWidth > 800 && window.innerWidth <= 1600) {
        zoom = 7.7;
    }
    else {
        zoom = 8;
    }
    myMap = L.map("mapSma", {
        zoomDelta: 1,
        zoomSnap: 0.35
    }); //Ändra koordinater för att byta det som visas på kartan, sista värdet är zoom värdet, minska för att zooma ut och tvärtom
    myMap.setView([57.32, 15.25], zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);
}

//Ändrar det som kartan visar beroende på vilken skärmstorlek som användaren befinner sig på
function changeMap() {
    let zoom;
    if (window.innerWidth <= 450) {
        zoom = 7;
    }
    else if (window.innerWidth <= 600) {
        zoom = 7.4;
    }
    else if (window.innerWidth <= 800) {
        zoom = 7.6;
    }
    else if (window.innerWidth > 800 && window.innerWidth <= 1600) {
        zoom = 7.7;
    }
    else {
        zoom = 8;
    }
    myMap.setView([57.32, 15.5], zoom);
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
            showMarkers(data);
        })
        .catch(error => {
            console.error("det uppstod ett problem: " + error);
        });
}

//Skapar markörer och lägger det på kartan
function showMarkers(data) {
    markers.clearLayers();
    let currentActivity;
    let currentIcon;
    for (let i = 0; i < data.payload.length; i++) {
        let SMAPIdata = data.payload[i];
        let lat = SMAPIdata.lat;
        let lng = SMAPIdata.lng;
        let button = document.createElement("a");
        button.href = "information.html?id=" + SMAPIdata.id;
        button.id = SMAPIdata.id;
        button.innerText = "Läs mer här";
        currentActivity = SMAPIdata.description;
        if (currentActivity == "Museum") {
            currentIcon = museumIcon;
        }
        else if (currentActivity == "Slott") {
            currentIcon = slottIcon;
        }
        else if (currentActivity == "Fornlämning") {
            currentIcon = fornlamningIcon;
        }
        else if (currentActivity == "Biograf") {
            currentIcon = biografIcon;
        }
        else if (currentActivity == "Kyrka") {
            currentIcon = kyrkaIcon;
        }
        else {
            currentIcon = konstgalleriIcon;
        }
        let marker = L.marker([lat, lng], { icon: currentIcon });
        marker.bindPopup("<b>" + SMAPIdata.name + "</b><br> Typ: " + SMAPIdata.description + "<br>" + button.outerHTML);
        markers.addLayer(marker);
    }
    markers.addTo(myMap);
}