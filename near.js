let myMap; //Objekt för kartan;
let addMarkers = []; //Array med objekt för markörer
let url; //URL för SMAPI
let placeInfoDescElem;
let markers = L.layerGroup();
let showMoreBtn;
let showMoreElem;

//Typ av aktivitetet
let museumID;
let slottID;
let kyrkaID;
let fornlamningID;
let ateljeID;
let konstgalleriID;
let biografID;

function init() {
    navigator.permissions.query({name: 'geolocation'}).then((permission) => {
        if (permission.state == 'granted') {
            // Location sharing is already enabled
            navigator.geolocation.getCurrentPosition((position) => {
                initMap(position.coords.latitude, position.coords.longitude);
            });
        } else {
            document.querySelector("#map").innerText = "För att se aktiviteter nära dig, behöver du dela din platsinformation. Vänligen tillåt denna behörighet så att vi kan ge dig relevanta resultat.";
            getLocation();
        }
    });
    museumID = document.querySelector("#museum");
    slottID = document.querySelector("#slott");
    kyrkaID = document.querySelector("#kyrka");
    fornlamningID = document.querySelector("#fornlamning");
    ateljeID = document.querySelector("#atelje");
    konstgalleriID = document.querySelector("#konstgalleri");
    biografID = document.querySelector("#biograf");

    placeInfoDescElem = document.querySelector("#placeDesc");
    let filter = document.querySelectorAll("#filter-system input");
    for (let i = 0; i < filter.length; i++) {
        filter[i].addEventListener("change", filterResults);
    }
    document.querySelector("#reset").addEventListener("click", resetFilter);
}
window.addEventListener("load", init);

function getLocation(){
    navigator.geolocation.getCurrentPosition((position) => {initMap(position.coords.latitude, position.coords.longitude);});
}

function initMap(lat, lng) {
    myMap = L.map("map").setView([lat, lng], 13); //Ändra koordinater för att byta det som visas på kartan, sista värdet är zoom värdet, minska för att zooma ut och tvärtom
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);
    filterResults()
}

function filterResults() {
    url = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall";//Base URL
    let typeURL = "&descriptions="; //filter url för typ av aktivitet

    //Filter för aktiviteter
    if (museumID.checked == true) {
        typeURL += "museum,";
    }
    if (slottID.checked == true) {
        typeURL += "slott,";
    }
    if (kyrkaID.checked == true) {
        typeURL += "kyrka,";
    }
    if (fornlamningID.checked == true) {
        typeURL += "fornlämning,";
    }
    if (ateljeID.checked == true) {
        typeURL += "ateljé,";
    }
    if (konstgalleriID.checked == true) {
        typeURL += "konstgalleri,";
    }
    if (biografID.checked == true) {
        typeURL += "biograf,";
    }
    if (museumID.checked != true && slottID.checked != true && kyrkaID.checked != true && fornlamningID.checked != true && ateljeID.checked != true && konstgalleriID.checked != true && biografID.checked != true) {
        typeURL += "museum,slott,biograf,ateljé,konstgalleri,kyrka,fornlämning"
    }
    //Övriga filter
    url += typeURL;
    getSMAPI();
}
function resetFilter() {
    //Uncheck
    museumID.checked = false;
    slottID.checked = false;
    kyrkaID.checked = false;
    fornlamningID.checked = false;
    ateljeID.checked = false;
    konstgalleriID.checked = false;
    biografID.checked = false;
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
    for (let i = 0; i < data.payload.length; i++) {
        let SMAPIdata = data.payload[i];
        let lat = SMAPIdata.lat;
        let lng = SMAPIdata.lng;
        let button = document.createElement("a");
        button.href = "information.html";
        button.id = SMAPIdata.id;
        button.innerText = "Läs mer här";
        let marker = L.marker([lat, lng]);
        marker.bindPopup("<b>" + SMAPIdata.name + "</b><br> Typ: " + SMAPIdata.description + "<br>" + button.outerHTML, {
            fontSize: "10px"
        });
        marker.addEventListener("click", () => {
            // Store the SMAPIdata.id in localStorage
            localStorage.setItem("Id", button.id);
        });
        markers.addLayer(marker);
    }
    markers.addTo(myMap);
}