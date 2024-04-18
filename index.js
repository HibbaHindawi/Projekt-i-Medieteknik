let navActive = false; //variabel för att kolla om dropdownmenyn är aktiv eller inte från början, icke-aktiv från början
let navMenu;

function init() {
    dropdownBtn = document.querySelector("#dropbtn");
    dropdownBtn.addEventListener("click", OpenAndCloseNavBar);
    navMenu = document.querySelector("#dropdown");
    
    // Add a click event listener to the window
    window.addEventListener("click", function (event) {
        // Check if the clicked element is not within the dropdown or dropdown button
        if (!navMenu.contains(event.target) && event.target !== dropdownBtn) {
            navMenu.style.display = "none";
            dropdownBtn.style.color = "";
            dropdownBtn.style.backgroundColor = "";
            navActive = false;
        }
    });
}
window.addEventListener("load", init);

function OpenAndCloseNavBar() {
    if (navActive == false) { //om meny inte är aktiv, öppna menyn och sätt variabel till aktiv
        dropdownBtn.style.backgroundColor = "white";
        dropdownBtn.style.color = "black";
        navMenu.style.display = "block";
        navActive = true;
    }
    else { //annars stäng menyn och sätt variabel till inaktiv
        navMenu.style.display = "none";
        dropdownBtn.style.color = "";
        dropdownBtn.style.backgroundColor = "";
        navActive = false;
    }
}