let myMap; //Objekt för kartan;
let addMarkers = []; //Array med objekt för markörer
let url = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall&provinces=småland";
let placeInfoDescElem;
let category = {
    atelje: [],
    konstgalleri: [],
    kyrka: [],
    museum: [],
    slott: [],
    fornlamning: []
}; // filtersystem

function init() {
    placeInfoDescElem = document.querySelector("#placeDesc");
    if (document.querySelector("#mapSma")) {
        initMap("mapSma");
    }
}
window.addEventListener("load", init);

function initMap(id) {
    myMap = L.map(id).setView([57.1, 14.4882], 7.5); //Ändra koordinater för att byta det som visas på kartan, sista värdet är zoom värdet, minska för att zooma ut och tvärtom
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);
    getSMAPI();
}

function getSMAPI() {
    url += "&per_page=11"

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
    for (let i = 0; i < data.payload.length; i++) {
        let SMAPIdata = data.payload[i];
        let lat = SMAPIdata.lat;
        let lng = SMAPIdata.lng;
        let button = document.createElement("a");
        button.href = "information.html";
        button.id = SMAPIdata.id;
        button.innerText = "Läs mer här";
        let marker = L.marker([lat, lng]).addTo(myMap);
        marker.bindPopup("<b>" + SMAPIdata.name + "</b><br>" + button.outerHTML);
        marker.addEventListener("click", () => {
            // Store the SMAPIdata.id in localStorage
            localStorage.setItem("Id", button.id);
        });
    }
}
