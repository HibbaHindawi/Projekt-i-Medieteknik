let myMap; //Objekt för kartan;
let url; //URL för SMAPI
let markers = L.layerGroup(); //Array med alla markörer

//filter
let savedElem; // Element för sparade alternativet
let childElem; // Element för barn alternativet
let studentElem; // Element för student alternativet
let seniorElem; // Element för pensionär alternativet
let outdoorElem; // Element för utomhus alternativet

let activityTypeElem; // Element för aktivitet alternativen
let activitiyId = ["museum", "slott", "kyrka", "fornlämning", "ateljé", "konstgalleri", "biograf"]; // Id för varje typ alternativ

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

    initMap();
    resetFilter();
    filterResults();

    let filter = document.querySelectorAll("#filter-system input");
    for (let i = 0; i < filter.length; i++) {
        filter[i].addEventListener("change", filterResults);
    }
    document.querySelector("#reset").addEventListener("click", resetFilter);
}
window.addEventListener("load", init);

//Skapar kartan
function initMap() {
    myMap = L.map("map").locate({ setView: true, maxZoom: 13 });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);
    filterResults()
}

//Filtrerar resultaten för SMAPI
function filterResults() {
    url = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall";//Base URL
    let typeURL = "&descriptions="; //filter url för typ av aktivitet
    let typeCounter = 0;

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
    url += typeURL;
    getSMAPI();
}

// Avcheckar alla filteralternativ
function resetFilter() {
    //Uncheck
    for (let i = 0; i < activityTypeElem.length; i++) {
        activityTypeElem[i].checked = false;
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
            console.error("Det uppstod ett problem: " + error);
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
        button.href = "information.html";
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
        marker.addEventListener("click", () => {
            // Store the SMAPIdata.id in localStorage
            localStorage.setItem("Id", button.id);
        });
        markers.addLayer(marker);
    }
    markers.addTo(myMap);
}