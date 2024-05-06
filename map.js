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
    let filter = document.querySelectorAll("#filter-system input");
    for(let i = 0; i < filter.length; i++){
        filter[i].addEventListener("change", filterResults);
    }
    
}
window.addEventListener("load", init);

function initMap(id) {
    myMap = L.map(id, {
        zoomDelta: 1,
        zoomSnap: 0.35
    }); //Ändra koordinater för att byta det som visas på kartan, sista värdet är zoom värdet, minska för att zooma ut och tvärtom
    myMap.setView([57.32, 15.5], 7.35);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);
}

function filterResults() {
    const museumID = document.querySelector("#museum");
    const slottID = document.querySelector("#slott");
    const kyrkaID = document.querySelector("#kyrka");
    const fornlamningID = document.querySelector("#fornlamning");
    const ateljeID = document.querySelector("#atelje");
    const konstgalleriID = document.querySelector("#konstgalleri");
    const biografID = document.querySelector("#biograf");

    url = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall";//Base URL
    let typeURL = "&descriptions="; //filter url för typ av aktivitet
    let cityURL = "&cities=";
    //Filter för städer och län


    //Filter för aktiviteter
    if(museumID.checked == true){
        typeURL+= "museum,";
    }
    if(slottID.checked == true){
        typeURL+= "slott,";
    }
    if(kyrkaID.checked == true){
        typeURL+= "kyrka,";
    }
    if(fornlamningID.checked == true){
        typeURL+= "fornlämning,";
    }
    if(ateljeID.checked == true){
        typeURL+= "ateljé,";
    }
    if(konstgalleriID.checked == true){
        typeURL+= "konstgalleri,";
    }
    if(biografID.checked == true){
        typeURL+= "biograf,";
    }
    if(museumID.checked != true && slottID.checked != true && kyrkaID.checked != true && fornlamningID.checked != true && ateljeID.checked != true && konstgalleriID.checked != true && biografID.checked != true){
        typeURL+= "museum,slott,biograf,ateljé,konstgalleri,kyrka,fornlämning"
    }

    //Övriga filter
    url+= typeURL;
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
        let marker = L.marker([lat, lng]);
        marker.bindPopup("<b>" + SMAPIdata.name + "</b><br> Typ: " + SMAPIdata.description + "<br>" + button.outerHTML);
        marker.addEventListener("click", () => {
            // Store the SMAPIdata.id in localStorage
            localStorage.setItem("Id", button.id);
        });
        markers.addLayer(marker);
    }
    markers.addTo(myMap);
}

function zIndex(){
    myMap.style.zIndex = "0";
}
