let infoElem;
let id;
let selectUrl = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall&provinces=småland";
let h1Elem;
let specificMap;

function init() {
    infoElem = document.querySelector("#placeDesc");
    h1Elem = document.querySelector("#h1Info");
    getInfo();
}
window.addEventListener("load", init);

function newMap(lat, lng, name){
    specificMap = L.map("mapInfo").setView([lat, lng], 16); //Ändra koordinater för att byta det som visas på kartan, sista värdet är zoom värdet, minska för att zooma ut och tvärtom
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(specificMap);
    let marker = L.marker([lat, lng]).addTo(specificMap);
    marker.bindPopup("<b>" + name + "</b>").openPopup();
}

function getInfo(){
    id = localStorage.getItem("Id");
    selectUrl += ("&ids=" + id);

    fetch(selectUrl)
        .then(response => response.json())
        .then(data => {
            setInfo(data);
            createDesc(data);
        })
        .catch(error => {
            console.error("det uppstod ett problem: " + error);
        });
}

function setInfo(data){
    for(let i = 0; i < data.payload.length; i++){
        let specificData = data.payload[i];
        h1Elem.innerText = specificData.name;
        document.title = (specificData.name + " || CultActivi");
        newMap(specificData.lat, specificData.lng, specificData.name);
    }
}
function createDesc(data) {
    for (let i = 0; i < data.payload.length; i++) {
        let specificData = data.payload[i];
        const rating = (parseFloat(specificData.rating)).toFixed(2);
        const newDiv = document.createElement("div");
        newDiv.classList.add("placeinfo");
        newDiv.innerHTML = "<div><p>Adress: " + specificData.address + "</p><p>Stad: " + specificData.city + "</p><a href='blank'> " + specificData.website + "</a><p>Telefonnummer: " + specificData.phone_number + "</p><div class='PushIn'><p>Betyg: " + rating + " | " + "</p><p> Pris: " + specificData.price_range + "</p></div><p>Kategori/Typ: " + specificData.description + " | " + specificData.type + "</p><p>Beskrivning: " + specificData.abstract + "</p>";
        if (specificData.outdoors == "Y") {
            newDiv.innerHTML += "<p>Utomhus: Ja</p>";
        }
        else {
            newDiv.innerHTML += "<p>Utomhus: Nej</p>";
        }
        newDiv.innerHTML += "<p>Rabatter Inkluderade: </div>";

        const PushInDiv = document.createElement("div");
        PushInDiv.classList.add("PushIn");

        if (specificData.student_discount == "Y") {
            PushInDiv.innerHTML += "<p>Student</p>";
        }
        if (specificData.child_discount == "Y") {
            PushInDiv.innerHTML += "<p>Barn</p>";
        }
        if (specificData.senior_discount == "Y") {
            PushInDiv.innerHTML += "<p>Senior</p>";
        }
        if(specificData.senior_discount == "N" && specificData.child_discount == "N" && specificData.student_discount == "N"){
            PushInDiv.innerHTML += "<p>Det finns tyvärr inga rabatter för denna aktiviteten.</p>";
        }
        newDiv.appendChild(PushInDiv);

        infoElem.appendChild(newDiv);
    }
}