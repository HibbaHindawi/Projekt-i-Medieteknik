let myMap; //Objekt för kartan;
let addMarkers = []; //Array med objekt för markörer
let url; //URL för SMAPI
let placeInfoDescElem;
let markers = L.layerGroup();

function init() {
    placeInfoDescElem = document.querySelector("#placeDesc");
    if (document.querySelector("#mapSma")) {
        initMap("mapSma");
        filterResults()
    }
    document.querySelector("#slott").addEventListener("change", filterResults);//Ändra detta
}
window.addEventListener("load", init);

function initMap(id) {
    myMap = L.map(id, {
        zoomDelta: 1,
        zoomSnap: 0.35
    }); //Ändra koordinater för att byta det som visas på kartan, sista värdet är zoom värdet, minska för att zooma ut och tvärtom
    myMap.setView([57.32, 15.5], 7.35);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);
}

function filterResults() {
    let filterBar = document.querySelector("#filter-system");
    if (filterBar) {
        url = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall";//Base URL
        //Filter för städer och län

        //Filter för aktiviteter

        //Övriga filter

        url+= "&descriptions=museum,slott,biograf,ateljé,konstgalleri,kyrka,fornlämning"
    }
    getSMAPI();
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
    for (let i = 0; i < data.payload.length; i++) {
        let SMAPIdata = data.payload[i];
        let lat = SMAPIdata.lat;
        let lng = SMAPIdata.lng;
        let button = document.createElement("a");
        button.href = "information.html";
        button.id = SMAPIdata.id;
        button.innerText = "Läs mer här";
        marker = L.marker([lat, lng]);
        marker.bindPopup("<b>" + SMAPIdata.name + "</b><br> Typ: " + SMAPIdata.description + "<br>" + button.outerHTML);
        marker.addEventListener("click", () => {
            // Store the SMAPIdata.id in localStorage
            localStorage.setItem("Id", button.id);
        });
        markers.addLayer(marker);
    }
    markers.addTo(myMap);
}
