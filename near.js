let myMap; //Objekt för kartan;
let url; //URL för SMAPI
let markers = L.layerGroup();

let savedElem;
let childElem;
let studentElem;
let seniorElem;
let outdoorElem;

let activityTypeElem;
let activitiyId = ["museum", "slott", "kyrka", "fornlämning", "ateljé", "konstgalleri", "biograf"];
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

function initMap() {
    myMap = L.map("map").locate({setView: true, maxZoom: 13}); //Ändra koordinater för att byta det som visas på kartan, sista värdet är zoom värdet, minska för att zooma ut och tvärtom
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);
    filterResults()
}

function filterResults() {
    url = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall";//Base URL
    let typeURL = "&descriptions="; //filter url för typ av aktivitet
    let typeCounter = 0;

    for(let i = 0; i < activityTypeElem.length; i++){
        if(activityTypeElem[i].checked == true){
            typeURL += activitiyId[i] + ",";
        }
        if(activityTypeElem[i].checked == false){
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
    url += typeURL;
    getSMAPI();
}
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