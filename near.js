let myMap; //Objekt för kartan;
let addMarkers = []; //Array med objekt för markörer

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
}
window.addEventListener("load", init);

function getLocation(){
    navigator.geolocation.getCurrentPosition((position) => {initMap(position.coords.latitude, position.coords.longitude);});
}
function initMap(lat, lng) {
    myMap = L.map("map").setView([lat, lng], 15); //Ändra koordinater för att byta det som visas på kartan, sista värdet är zoom värdet, minska för att zooma ut och tvärtom
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);
    showMarkers();
}

function showMarkers() {

}