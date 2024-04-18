let myMap; //Objekt för kartan;
let addMarkers = []; //Array med objekt för markörer

function init() {
    initMap("map");
}
window.addEventListener("load", init);

function initMap(id) {
    myMap = L.map(id).setView([56.7738, 16.6882], 8);//Ändra koordinater för att byta det som visas på kartan, sista värdet är zoom värdet, minska för att zooma ut och tvärtom
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);
}

function showMarkers() {

}