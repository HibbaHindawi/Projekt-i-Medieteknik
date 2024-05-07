let myMap; //Objekt för kartan;
let addMarkers = []; //Array med objekt för markörer
let url; //URL för SMAPI
let placeInfoDescElem;
let markers = L.layerGroup();
let showMoreBtn;
let showMoreElem;
let counter = 0; //Kontroll för funktionen showMoreCity
let cityCounter;

//filter
//Typ av aktivitetet
let museumID;
let slottID;
let kyrkaID;
let fornlamningID;
let ateljeID;
let konstgalleriID;
let biografID;

let moreCitiesElem;
let idOne = ["alvesta", "borgholm", "huskvarna", "jönköping", "kalmar", "ljungby", "nybro", "värnamo", "växjö", "vetlanda", "vimmerby", "älmhult"];
let idTwo = ["berga", "braås", "dädesjö", "degerhamn", "dörarp", "eksjö", "färjestaden", "gemla", "gnosjö", "göteryd", "gränna", "gripenberg", "halltorp", "hamneda", "hjärtlanda", "hovmantorp", "hultsfred", "hylletofta", "ingelstad", "känna", "kävsjö", "långasjö", "lessebo", "lidhult", "linneryd", "ljungbyholm", "målilla", "mörbylånga", "myresjö", "norrhult", "norrahammar", "pelarne", "sävsjö", "sandby", "skruv", "stockaryd", "valdemarsvik", "visingsö", "vissefjärda", "virseram", "åseda"];
//Stad
let vaxjoID;
let alvestaID;
let borgholmID;
let huskvarnaID;
let jonkopingID;
let kalmarID;
let ljungbyID;
let nybroID;
let varnamoID;
let vetlandaID;
let vimmerbyID;
let almhultID;


function init() {
    museumID = document.querySelector("#museum");
    slottID = document.querySelector("#slott");
    kyrkaID = document.querySelector("#kyrka");
    fornlamningID = document.querySelector("#fornlamning");
    ateljeID = document.querySelector("#atelje");
    konstgalleriID = document.querySelector("#konstgalleri");
    biografID = document.querySelector("#biograf");
    vaxjoID = document.querySelector("#vaxjo");
    alvestaID = document.querySelector("#alvesta");
    borgholmID = document.querySelector("#borgholm");
    huskvarnaID = document.querySelector("#huskvarna");
    jonkopingID = document.querySelector("#jonkoping");
    kalmarID = document.querySelector("#kalmar");
    ljungbyID = document.querySelector("#ljungby");
    nybroID = document.querySelector("#nybro");
    varnamoID = document.querySelector("#varnamo");
    vetlandaID = document.querySelector("#vetlanda");
    vimmerbyID = document.querySelector("#vimmerby");
    almhultID = document.querySelector("#almhult")

    moreCitiesElem = document.querySelectorAll("#moreCities input");

    showMoreBtn = document.querySelector("#showMore");
    showMoreElem = document.querySelector("#moreCities");
    showMoreBtn.addEventListener("click", showMoreCity);

    placeInfoDescElem = document.querySelector("#placeDesc");
    if (document.querySelector("#mapSma")) {
        initMap("mapSma");
        filterResults()
    }
    let filter = document.querySelectorAll("#filter-system input");
    for (let i = 0; i < filter.length; i++) {
        filter[i].addEventListener("change", filterResults);
    }
    document.querySelector("#reset").addEventListener("click", resetFilter);
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

function showMoreCity() {
    if (counter == 0) { //Om den är inaktiv, gör den aktiv
        showMoreElem.style.display = "grid";
        showMoreElem.style.gridTemplateColumns= "repeat(5, 1fr)";
        showMoreElem.style.marginBottom = "20px";
        counter = 1;
    }
    else { //Om den är aktiv, gör den inaktiv
        showMoreElem.style.display = "none";
        counter = 0;
    }

}

function filterResults() {
    url = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall";//Base URL
    let typeURL = "&descriptions="; //filter url för typ av aktivitet
    let cityURL = "&cities=";
    cityCounter = 0;
    //Filter för städer och län
    if (vaxjoID.checked == true) {
        cityURL += "växjö,";
    }
    if(alvestaID.checked == true){
        cityURL += "alvesta,";
    }
    if(borgholmID.checked == true){
        cityURL += "borgholm,";
    }
    if(huskvarnaID.checked == true){
        cityURL += "huskvarna,";
    }
    if(jonkopingID.checked == true){
        cityURL += "jönköping,";
    }
    if(kalmarID.checked == true){
        cityURL += "kalmar,";
    }
    if(ljungbyID.checked == true){
        cityURL += "ljungby,";
    }
    if(nybroID.checked == true){
        cityURL += "nybro,";
    }
    if(varnamoID.checked == true){
        cityURL += "värnamo,";
    }
    if(vetlandaID.checked == true){
        cityURL += "vetlanda";
    }
    if(vimmerbyID.checked == true){
        cityURL += "vimmerby,";
    }
    if(almhultID.checked == true){
        cityURL += "älmhult,";
    }
    for (let index = 0; index < moreCitiesElem.length; index++) {
        if(moreCitiesElem[index].checked == true){
            cityURL += idTwo[index] + ",";
        }
        if (moreCitiesElem[index].checked == false) {
            cityCounter++;
        }
    }
    if (!vaxjoID.checked && !alvestaID.checked && !borgholmID.checked && !huskvarnaID.checked && !jonkopingID.checked && !kalmarID.checked && !ljungbyID.checked && !nybroID.checked && !varnamoID.checked && !vetlandaID.checked && !vimmerbyID.checked && !almhultID.checked && cityCounter == 42) {
        cityURL = "";
    }

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
    url += typeURL + cityURL;
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
    vaxjoID.checked = false;
    alvestaID.checked = false;
    borgholmID.checked = false;
    huskvarnaID.checked = false;
    jonkopingID.checked = false;
    kalmarID.checked = false;
    ljungbyID.checked = false;
    nybroID.checked = false;
    varnamoID.checked = false;
    vetlandaID.checked = false;
    vimmerbyID.checked = false;
    almhultID.checked = false;
    for (let i = 0; i < moreCitiesElem.length; i++) {
        moreCitiesElem[i].checked = false;
    }
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
