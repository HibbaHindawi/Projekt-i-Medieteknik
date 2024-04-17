let navActive = false; //variabel för att kolla om dropdownmenyn är aktiv eller inte från början, icke-aktiv från början
let navMenu;

function init() {
    dropdownBtn = document.querySelector("#dropbtn");
    dropdownBtn.addEventListener("click", OpenAndCloseNavBar);
    navMenu = document.querySelector("#dropdown");
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