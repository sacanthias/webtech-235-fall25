// 1
window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};

// 2
let displayTerm = "";

let gifs = [];

// 3
function searchButtonClicked(){
    console.log("searchButtonClicked() called");
    // url is the giphy search endpoint
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    // API key - identifies the owner of the service
    let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";

    //
    let url = GIPHY_URL + "api_key=" + GIPHY_KEY;

    // gets the value of the text input field & trims it (removes whitespace)
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    term = encodeURIComponent(term.trim());

    if(term.length < 1) return;

    url += "&q=" + term;

    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";
    console.log(url);

    // using XHR
    getData(url);
}

// 4
function getData(url){
    // 1 - create a new XHR object
    let xhr = new XMLHttpRequest();

    // 2 - setting the *onload* handler
    xhr.onload = dataLoaded;

    // 3 - setting the *onerror* handler
    xhr.onerror = dataError;

    // 4 - open connection & send request
    xhr.open("GET", url);
    xhr.send();
}

// callback functions
function dataLoaded(e){
    let xhr = e.target;

    console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);
    //console.log(obj.data);

    if(!obj.data || obj.data.length == 0){
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        return; //bail out
    }

    let results = obj.data;
    console.log("results lenght = " + results.length);
    let bigString = "Here are " + results.length + "results for " + displayTerm;
    
    for (let i = 0; i < results.length; i++){
        let result = results[i];

        let smallURL = result.images.fixed_width_downsampled.url;
        if(!smallURL) smallURL = "images/no-image-found.png";

        let url = result.url;
        let rating = result.rating.toUpperCase();

        let line = `<div class='result'><img src='${smallURL}' title='${result.id}' />`;
        line += `<span><a target ='_blank' href='${url}'>View on Giphy</a><br>Rating: ${rating}</span></div>`;

        bigString += line;
    }

    document.querySelector("#content").innerHTML = bigString;

    document.querySelector("#status").innerHTML = "<b>Success!</b>";

    gifs = document.querySelectorAll("#content .result");
    console.log(gifs);
}

function dataError(e){
    console.log("ERROR");
}

function rollOver(){
    console.log("mouse over")
}

function rollOut(){
    console.log("mouse out")
}

for(let result in gifs){
    result.onmouseover = rollOver;
    result.onmouseout = rollOut;
}