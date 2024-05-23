let infoElem; //Element för att visa upp inforamtionen
let selectUrl = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall"; //bas-url för SMAPI
let h1Elem; //Referens till sidans H1-tagg
let icons = L.Icon.extend({ //Skapar inställningar för ikoner
    options: {
        iconSize: [25, 50],
        iconAnchor: [12, 49],
        popupAnchor: [0, -50]
    }
})
let museumIcon = new icons({ //Ikon för museum
    iconUrl: "Bilder/Markers/markermuseum.png"
})
let slottIcon = new icons({ //Ikon för slott
    iconUrl: "Bilder/Markers/markercastle.png"
})
let kyrkaIcon = new icons({ // Ikon för kyrka
    iconUrl: "Bilder/Markers/markerchurch.png"
})
let fornlamningIcon = new icons({ //Ikon för fornlämningar
    iconUrl: "Bilder/Markers/markerancientmonument.png"
})
let konstgalleriIcon = new icons({ //ikon för konstgalleri
    iconUrl: "Bilder/Markers/markerartgallery.png"
})
let biografIcon = new icons({ //Ikon för biograf
    iconUrl: "Bilder/Markers/markercinema.png"
})

//Körs när sidan laddas
function init() {
    infoElem = document.querySelector("#placeDesc");
    h1Elem = document.querySelector("#h1Info");
    getInfo();
}
window.addEventListener("load", init);

//Skapar kartan
function newMap(lat, lng, name, description) {
    let specificMap = L.map("mapInfo").setView([lat, lng], 16); //Ändra koordinater för att byta det som visas på kartan, sista värdet är zoom värdet, minska för att zooma ut och tvärtom
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(specificMap);

    let currentIcon;
    if (description == "Museum") {
        currentIcon = museumIcon;
    }
    else if (description == "Slott") {
        currentIcon = slottIcon;
    }
    else if (description == "Fornlämning") {
        currentIcon = fornlamningIcon;
    }
    else if (description == "Biograf") {
        currentIcon = biografIcon;
    }
    else if (description == "Kyrka") {
        currentIcon = kyrkaIcon;
    }
    else {
        currentIcon = konstgalleriIcon;
    }
    let marker = L.marker([lat, lng], { icon: currentIcon }).addTo(specificMap);
    marker.bindPopup("<b>" + name + "</b>").openPopup();
}

//Hämtar information från SMAPI
function getInfo() {
    let id = localStorage.getItem("Id");
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

//Sätter informationen på h1-taggen samt html title, anropar newMap med information
function setInfo(data) {
    for (let i = 0; i < data.payload.length; i++) {
        let specificData = data.payload[i];
        h1Elem.innerText = specificData.name;
        document.title = (specificData.name + " | CultActivi");
        newMap(specificData.lat, specificData.lng, specificData.name, specificData.description);
    }
}

//Skapar HTML-kod för informationssidan
function createDesc(data) {
    for (let i = 0; i < data.payload.length; i++) {
        let specificData = data.payload[i];
        const rating = (parseFloat(specificData.rating)).toFixed(2);
        const newDiv = document.createElement("div");
        newDiv.classList.add("placeinfo");
        let favoritDiv = document.createElement("div");
        favoritDiv.classList.add("favorite");
        let heartIMG = document.createElement("img");
        heartIMG.style.cursor = "pointer";
        let favoritesArray = [];
        if (typeof localStorage !== "undefined") {
            let storedFavorites = localStorage.getItem("favorites");
            if (storedFavorites !== null) {
                favoritesArray = storedFavorites.split(",");
            }
        }
        if (favoritesArray.length > 0 && favoritesArray.includes(specificData.id)) {
            heartIMG.alt = "Full heart";
            heartIMG.src = "Bilder/Ikoner/heartFull.png";
        }
        else {
            heartIMG.alt = "empty heart";
            heartIMG.src = "Bilder/Ikoner/heartEmpty.png";
        }
        favoritDiv.appendChild(heartIMG);
        let id = specificData.id;
        heartIMG.addEventListener("click", function (event) {
            addToFavorite(event, id);
        });

        const divContent = document.createElement("div");
        const categoryParagraph = document.createElement("p");
        categoryParagraph.innerHTML = "<span>Kategori:</span> " + specificData.description;
        divContent.appendChild(categoryParagraph);

        const cityParagraph = document.createElement("p");
        cityParagraph.innerHTML = "<span>Stad/By:</span> " + specificData.city + " | <span>Adress:</span> " + specificData.address;
        if (specificData.phone_number != "") {
            cityParagraph.innerHTML += " | <span>" + specificData.phone_number + " </span><img id='phoneImg' src='Bilder/Ikoner/phone.png' alt='Telefonnummer ikon'>";
        }
        divContent.appendChild(cityParagraph);

        if (specificData.website != "") {
            const websiteParagraph = document.createElement("p");
            const websiteLink = document.createElement("a");
            websiteLink.href = specificData.website;
            websiteLink.innerText = specificData.website;
            websiteParagraph.innerHTML = "<span>Webbplats:</span> ";
            websiteParagraph.appendChild(websiteLink);
            divContent.appendChild(websiteParagraph);
        }

        const ratingDiv = document.createElement("div");
        ratingDiv.classList.add("PushIn");
        const ratingParagraph = document.createElement("p");
        if (rating == 1) { //Betyg
            ratingParagraph.innerHTML = "<span>Betyg:</span> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> | "
        }
        else if (rating > 1 && rating <= 1.5) {
            ratingParagraph.innerHTML = "<span>Betyg:</span> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starHalf.png' alt='Half Full Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> | ";
        }
        else if (rating > 1.5 && rating <= 2) {
            ratingParagraph.innerHTML = "<span>Betyg:</span> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> | ";
        }
        else if (rating > 2 && rating <= 2.5) {
            ratingParagraph.innerHTML = "<span>Betyg:</span> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starHalf.png' alt='Half Full Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> | ";
        }
        else if (rating > 2.5 && rating <= 3) {
            ratingParagraph.innerHTML = "<span>Betyg:</span> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> | ";
        }
        else if (rating > 3 && rating <= 3.5) {
            ratingParagraph.innerHTML = "<span>Betyg:</span> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starHalf.png' alt='Half Full Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> | ";
        }
        else if (rating > 3.5 && rating <= 4) {
            ratingParagraph.innerHTML = "<span>Betyg:</span> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starEmpty.png' alt='Empty Star'> | ";
        }
        else if (rating > 4 && rating <= 4.5) {
            ratingParagraph.innerHTML = "<span>Betyg:</span> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starHalf.png' alt='Half Full Star'> | ";
        }
        else if (rating > 4.5 && rating <= 5) {
            ratingParagraph.innerHTML = "<span>Betyg:</span> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> <img src='Bilder/Ikoner/starFull.png' alt='Full Star'> | ";
        }
        ratingDiv.appendChild(ratingParagraph);

        const priceParagraph = document.createElement("p");
        priceParagraph.innerHTML = "<span>Pris:</span> " + specificData.price_range + " kr";
        ratingDiv.appendChild(priceParagraph);

        divContent.appendChild(ratingDiv);

        const abstractParagraph = document.createElement("p");
        if (specificData.abstract != "") {
            abstractParagraph.innerHTML = "<span>Beskrivning:</span> " + specificData.abstract;
        }
        divContent.appendChild(abstractParagraph);
        const pushInDiv = document.createElement("div");
        pushInDiv.classList.add("PushIn");
        const discountsParagraph = document.createElement("p");
        discountsParagraph.innerHTML = "<span>Rabatter:</span> ";
        pushInDiv.appendChild(discountsParagraph);

        if (specificData.student_discount == "Y") {
            const studentDiscountParagraph = document.createElement("p");
            studentDiscountParagraph.innerHTML = "Student <img src='Bilder/Ikoner/checkmark.png' alt='checkmark ikon'> | ";
            pushInDiv.appendChild(studentDiscountParagraph);
        } else {
            const studentDiscountParagraph = document.createElement("p");
            studentDiscountParagraph.innerHTML = "Student <img src='Bilder/Ikoner/cross.png' alt='cross ikon'> | ";
            pushInDiv.appendChild(studentDiscountParagraph);
        }
        if (specificData.child_discount == "Y") {
            const childDiscountParagraph = document.createElement("p");
            childDiscountParagraph.innerHTML = "Barn <img src='Bilder/Ikoner/checkmark.png' alt='checkmark ikon'> | ";
            pushInDiv.appendChild(childDiscountParagraph);
        } else {
            const childDiscountParagraph = document.createElement("p");
            childDiscountParagraph.innerHTML = "Barn <img src='Bilder/Ikoner/cross.png' alt='cross ikon'> | ";
            pushInDiv.appendChild(childDiscountParagraph);
        }
        if (specificData.senior_discount == "Y") {
            const seniorDiscountParagraph = document.createElement("p");
            seniorDiscountParagraph.innerHTML = "Senior <img src='Bilder/Ikoner/checkmark.png' alt='checkmark ikon'>";
            pushInDiv.appendChild(seniorDiscountParagraph);
        } else {
            const seniorDiscountParagraph = document.createElement("p");
            seniorDiscountParagraph.innerHTML = "Senior <img src='Bilder/Ikoner/cross.png' alt='cross ikon'>";
            pushInDiv.appendChild(seniorDiscountParagraph);
        }

        const otherParagraph = document.createElement("div");
        otherParagraph.id = "otherInfo";
        otherParagraph.innerHTML = "<p><span>Annat: </span></p> ";
        if (specificData.outdoors == "Y") {
            const outdoorsParagraph = document.createElement("p");
            outdoorsParagraph.innerHTML = "Utomhus: <img src='Bilder/Ikoner/checkmark.png' alt='checkmark ikon'>";
            otherParagraph.appendChild(outdoorsParagraph);
        } else {
            const outdoorsParagraph = document.createElement("p");
            outdoorsParagraph.innerHTML = "Utomhus: <img src='Bilder/Ikoner/cross.png' alt='cross ikon'>";
            otherParagraph.appendChild(outdoorsParagraph);
        }

        divContent.appendChild(pushInDiv);
        divContent.appendChild(otherParagraph);
        heartIMG.style.width = "30px";
        heartIMG.style.height = "30px";
        favoritDiv.style.margin = "10px 20px";
        favoritDiv.style.float = "right";
        newDiv.appendChild(favoritDiv);
        newDiv.appendChild(divContent);
        infoElem.appendChild(newDiv);
    }
}

//Lägger till den valda aktiviteter i sparade
function addToFavorite(event, id) {
    let clickedIMG = event.target;
    let favoritesArray = localStorage.getItem("favorites");

    if (favoritesArray != null && favoritesArray.includes(id)) {
        clickedIMG.src = "Bilder/Ikoner/heartEmpty.png";
        let filteredNumbers = favoritesArray
            .split(",") // Convert favoritesArray string to an array
            .filter(number => number !== id);
        localStorage.setItem("favorites", filteredNumbers.join(",")); // Convert filteredNumbers array back to a string before storing in localStorage
    }
    else {
        if (favoritesArray == null) {
            favoritesArray = ""; // Initialize favoritesArray as an empty string if it is null
        }
        favoritesArray += (favoritesArray.length === 0 ? "" : ",") + id; // Append the new id to favoritesArray
        clickedIMG.src = "Bilder/Ikoner/heartFull.png";
        localStorage.setItem("favorites", favoritesArray);
    }

}