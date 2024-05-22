let myMap; //Objekt för kartan;
let url; //URL för SMAPI
let markers = L.layerGroup();
let counter = 0; //Kontroll för funktionen showMoreCity
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
let idOne = ["alvesta", "älmhult", "åseda", "berga", "borgholm", "braås", "dädesjö", "degerhamn", "dörarp", "eksjö", "färjestaden", "gemla", "gnosjö", "göteryd", "gränna", "gripenberg", "halltorp", "hamneda", "hjärtlanda", "hovmantorp", "huskvarna", "hultsfred", "hylletofta", "ingelstad", "jönköping", "kalmar", "känna", "kävsjö", "långasjö", "lessebo", "lidhult", "linneryd", "ljungby", "ljungbyholm", "målilla", "mörbylånga", "myresjö", "norrahammar", "norrhult", "nybro", "pelarne", "sandby", "skruv", "stockaryd", "sävsjö", "valdemarsvik", "värnamo", "växjö", "vetlanda", "vimmerby", "visingsö", "vissefjärda"];
//Ikoner
let icons = L.Icon.extend({
    options: {
        iconSize: [25, 50],
        iconAnchor: [12, 49],
        popupAnchor: [0, -50]
    }
})
let museumIcon = new icons({
    iconUrl: "Bilder/Markers/markermuseum.png"
})
let slottIcon = new icons({
    iconUrl: "Bilder/Markers/markercastle.png"
})
let kyrkaIcon = new icons({
    iconUrl: "Bilder/Markers/markerchurch.png"
})
let fornlamningIcon = new icons({
    iconUrl: "Bilder/Markers/markerancientmonument.png"
})
let konstgalleriIcon = new icons({
    iconUrl: "Bilder/Markers/markerartgallery.png"
})
let biografIcon = new icons({
    iconUrl: "Bilder/Markers/markercinema.png"
})


function init() {
    activityTypeElem = document.querySelectorAll("#type input");
    citiesElem = document.querySelectorAll("#popular input");
    savedElem = document.querySelector("#favoriteBox");
    childElem = document.querySelector("#child");
    studentElem = document.querySelector("#student");
    seniorElem = document.querySelector("#senior");
    outdoorElem = document.querySelector("#outdoor");
    if (document.querySelector("#mapSma")) {
        initMap();
        resetFilter();
        filterResults();
    }
    window.addEventListener("resize", changeMap);
    let filter = document.querySelectorAll("#filter-system input");
    for (let i = 0; i < filter.length; i++) {
        filter[i].addEventListener("change", filterResults);
    }
    document.querySelector("#reset").addEventListener("click", resetFilter);
}
window.addEventListener("load", init);

function initMap() {
    let zoom;
    if(window.innerWidth <= 450){
        zoom = 7;
    }
    else if(window.innerWidth <= 600){
        zoom = 7.4;
    }
    else if(window.innerWidth <= 800){
        zoom = 7.6;
    }
    else if (window.innerWidth > 800 && window.innerWidth <= 1600) {
        zoom = 7.7;
    }
    else{
        zoom= 8;
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
function changeMap(){
    let zoom;
    if(window.innerWidth <= 450){
        zoom = 7;
    }
    else if(window.innerWidth <= 600){
        zoom = 7.4;
    }
    else if(window.innerWidth <= 800){
        zoom = 7.6;
    }
    else if (window.innerWidth > 800 && window.innerWidth <= 1600) {
        zoom = 7.7;
    }
    else{
        zoom= 8;
    }
    myMap.setView([57.32, 15.5], zoom);
}

function filterResults() {
    url = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall";//Base URL
    let typeURL = "&descriptions="; //filter url för typ av aktivitet
    let cityURL = "&cities=";
    let typeCounter = 0;
    cityCounter = 0;
    //Filter för städer och län
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

    //Filter för aktiviteter
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
            showMarkers(data);
        })
        .catch(error => {
            console.error("det uppstod ett problem: " + error);
        });
}

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