document.getElementById("menu-button").addEventListener("click",() => {
    //todo add pause to game;
    document.getElementById( "game-menu").style.display = "block";
    document.getElementById("back-drop").style.display = "block";

});

document.getElementById("back-to-game").addEventListener("click",() => {
    //todo remove pause from game;
    document.getElementById( "game-menu").style.display = "none";
    document.getElementById("back-drop").style.display = "none";
});

document.getElementById("wormopedia").addEventListener("click",() => {
    document.getElementById( "under-construction").style.display = "block";
});

document.getElementById("contact-support").addEventListener("click",() => {
    document.getElementById( "under-construction").style.display = "block";
});

document.getElementById("under-construction").addEventListener("click",() => {
    document.getElementById( "under-construction").style.display = "none";
});