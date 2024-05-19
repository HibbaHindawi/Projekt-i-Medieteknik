let url; //URL för SMAPI
let placeInfoDescElem;

let resultElem;

function init() {
    resultElem = document.querySelector("#results_favorites");
    filterResults()
}
window.addEventListener("load", init);

function filterResults() {
    let savedActivities = [];
    if (typeof localStorage !== "undefined") {
        // localStorage is supported
        let storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites !== null) {
            savedActivities = storedFavorites.split(",");
        }
    }

    if (savedActivities.length > 0) {
        url = "https://smapi.lnu.se/api/?api_key=Q0wfRecE&controller=establishment&method=getall&order_by=city&ids=";//Base URL
        url += savedActivities;
        getSMAPI();
    }
}
function getSMAPI() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //Input code here
            createList(data);
        })
        .catch(error => {
            console.error("det uppstod ett problem: " + error);
        });
}
function createList(data) {
    resultElem.innerHTML = "";
    if (data.payload.length == 0) {
        let errorElement = document.createElement("p");
        errorElement.id = "error";
        errorElement.innerText = "Du har inte sparat någon aktivitet ännu, spara först några aktiviteter.";
        resultElem.appendChild(errorElement);
    }
    else {
        for (let i = 0; i < data.payload.length; i++) {
            let SMAPIdata = data.payload[i];
            let newA = document.createElement("a");
            newA.href = "information.html";
            newA.id = SMAPIdata.id;
            let favoritDiv = document.createElement("div");
            favoritDiv.classList.add("favorite");
            let heartIMG = document.createElement("img");
            let favoritesArray = [];
            if (typeof localStorage !== "undefined") {
                // localStorage is supported
                let storedFavorites = localStorage.getItem("favorites");
                if (storedFavorites !== null) {
                    favoritesArray = storedFavorites.split(",");
                }
            }

            if (favoritesArray.length > 0 && favoritesArray.includes(newA.id)) {
                heartIMG.alt = "Full heart";
                heartIMG.src = "Bilder/Ikoner/heartFull.png";
            }
            favoritDiv.appendChild(heartIMG);
            let id = newA.id;
            heartIMG.addEventListener("click", function (event) {
                removeFromFavorite(event, id);
            });
            let newDiv = document.createElement("div");
            newDiv.innerText = SMAPIdata.name + " - " + SMAPIdata.city + " - " + SMAPIdata.description;
            newA.classList.add("plats");
            newA.addEventListener("click", () => {
                // Store the SMAPIdata.id in localStorage
                localStorage.setItem("Id", newA.id);
            });
            newA.appendChild(newDiv);
            let parentDiv = document.createElement("div");
            parentDiv.appendChild(newA);
            parentDiv.appendChild(favoritDiv);
            parentDiv.classList.add("parentDiv");
            resultElem.appendChild(parentDiv);
        }
    }
}

function removeFromFavorite(event, id) {
    let clickedIMG = event.target;
    let favoritesArray = [];
    if (typeof localStorage !== "undefined") {
        // localStorage is supported
        let storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites !== null) {
            favoritesArray = storedFavorites;
        }
    }

    if (favoritesArray.length > 0 && favoritesArray.includes(id)) {
        clickedIMG.src = "Bilder/Ikoner/heartEmpty.png";
        let filteredNumbers = favoritesArray
            .split(",") // Convert favoritesArray string to an array
            .filter(number => number !== id);
        localStorage.setItem("favorites", filteredNumbers.join(",")); // Convert filteredNumbers array back to a string before storing in localStorage
    }
    filterResults();
}