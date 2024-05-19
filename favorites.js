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
            newDiv.innerText = SMAPIdata.name + " - " + SMAPIdata.city;
            newDiv.classList.add("title");
            newA.classList.add("plats");
            newA.addEventListener("click", () => {
                // Store the SMAPIdata.id in localStorage
                localStorage.setItem("Id", newA.id);
            });
            newA.appendChild(newDiv);
            let infoElem = document.createElement("div");
            infoElem.classList.add("infoList");
            let outdoors;
            let student;
            let child;
            let senior;
            if (SMAPIdata.outdoors == "Y") {
                outdoors = "<img src='Bilder/Ikoner/checkmark.png' alt='checkmark'>";
            }
            else {
                outdoors = "<img src='Bilder/Ikoner/cross.png' alt='cross'>";
            }
            if (SMAPIdata.student_discount == "Y") {
                student = "<img src='Bilder/Ikoner/checkmark.png' alt='checkmark'>";
            }
            else {
                student = "<img src='Bilder/Ikoner/cross.png' alt='cross'>";
            }
            if (SMAPIdata.child_discount == "Y") {
                child = "<img src='Bilder/Ikoner/checkmark.png' alt='checkmark'>";
            }
            else {
                child = "<img src='Bilder/Ikoner/cross.png' alt='cross'>";
            }
            if (SMAPIdata.senior_discount == "Y") {
                senior = "<img src='Bilder/Ikoner/checkmark.png' alt='checkmark'>";
            }
            else {
                senior = "<img src='Bilder/Ikoner/cross.png' alt='cross'>";
            }
            infoElem.innerHTML = "<p><u>" + SMAPIdata.description + "</u></p><p><span>Utomhus:</span> " + outdoors + " | <span>Barn Rabatt:</span> " + child + " | <span>Student Rabatt:</span> " + student + " | <span>Pensionär Rabatt:</span> " + senior + "</p>";
            newA.appendChild(infoElem);

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