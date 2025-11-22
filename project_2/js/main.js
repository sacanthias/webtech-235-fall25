const apiPath = "https://api.jikan.moe/v4";
const prefix = "nob6010";
const listKey = prefix + "list";
const searchKey = prefix + "search";
const searchTerm = localStorage.getItem(searchKey);
const userSaved = localStorage.getItem(listKey);

let sfw;
let limit;
let anime;
let manga;
let userList = new Array();
let saveButtons = [];
let callResult;

window.onload = function(){
    populateHome();
    document.querySelector("#search").onclick = searchClicked;
    document.querySelector("#viewList").onclick = listClicked;
};

function populateHome(){
    // seasonal anime
    let seasonalURL = apiPath + "/seasons/now?limit=7";
    getData(seasonalURL, "#seasonal", "aniseason");

    // top manga
    let topMangaURL = apiPath + "/top/manga?limit=7";
    getData(topMangaURL, "#top_manga", "mantop")

    // top anime
    let topAnimeURL = apiPath + "/top/anime?limit=7";
    getData(topAnimeURL, "#top_anime", "anitop");

    if(searchTerm){
        document.querySelector("#searchterm").value = searchTerm;
    }

    if(userSaved){
        userList = JSON.parse(localStorage.getItem(listKey));
        
        listClicked();
    }
    else{
        document.querySelector("#showList").innerHTML = "<b>No saved entries found.</b>";
    }
}

// listClicked handles displaying the user's saved list (if found)
function listClicked(){
    document.querySelector(".user.load-home").style.display = "block";

    if(userSaved){
        let list = JSON.parse(localStorage.getItem(listKey));
        let bigString = "";

        for(let s of list){
            let line = `<div class='saved'><img src='${s.image}' />`;
            line += `<span><a target ='_blank' href='${s.url}'>${s.title}</a>
                <br>Rating: ${s.rating}</span>
                </div>`;
            bigString += line;
        }

        document.querySelector("#showList").innerHTML = bigString;
    }
    else{
        document.querySelector("#showList").innerHTML = "<b>No saved entries found.</b>";
    }
}

// searchClicked handles data requests & displays once the search button is clicked
function searchClicked(){
    console.log("search button was clicked!");
    // hiding everything
    let home = document.querySelectorAll("div.load-home");
    for(let c of home){
        c.style.display = "none";
    }
    document.querySelector("#resultText").innerHTML = "";
    
    // setting up the api link
    let searchURL = apiPath;
    let term;

    if(searchTerm){
        term = searchTerm;
    }
    term = encodeURIComponent(document.querySelector("#searchterm").value.trim());
    localStorage.setItem(searchKey, document.querySelector("#searchterm").value);

    let limit = document.querySelector("#limit").value;
    
    sfw = document.querySelector("#mediaSFW:checked");
    anime = document.querySelector("#mediaAnime:checked");
    manga = document.querySelector("#mediaManga:checked");

    if(sfw){
        if(anime){
            searchURL += "/anime";
            searchURL += "?q=" + term;
            
            // automatically orders by score/user rating
            searchURL += "&anime_search_query_orderby=score"
        }
        else if(manga){
            searchURL += "/manga";
            searchURL += "?q=" + term;
            searchURL += "&manga_search_query_orderby=score";
            // automatically orders by score/user rating
        }
        else{
            document.querySelector("#resultText").innerHTML = "Please select a medium to sort by!";
            return;
        }
        searchURL += "&sfw";
    }
    else{
        if(anime){
            searchURL += "/anime";
            searchURL += "?q=" + term;
            
            // automatically orders by score/user rating
            searchURL += "&anime_search_query_orderby=score"
        }
        else if(manga){
            searchURL += "/manga";
            searchURL += "?q=" + term;
            // automatically orders by score/user rating
            searchURL += "&manga_search_query_orderby=score";
        }
        else{
            document.querySelector("#resultText").innerHTML = "Please select a medium to sort by!";
            return;
        }
    }

    searchURL += "&limit=" + limit;
    
    console.log(searchURL);
    getData(searchURL, "#searchGrid", "results");
    saveButtons = document.querySelectorAll("button.save");
    document.querySelector("#resultTitle").innerHTML = "Results for '" + term + "'";
}

// TODO: solve the timing issue below.
// somehow make the dataLoaded function wait for the xhr GET or something
// use await xhr.open()?
// but i want to keep things separated as they are now without needing to encapsulate other functions....
function dataLoaded(xml){
    console.log("data has loaded")
    let xhr = xml;
    //console.log(xhr.responseText);

    if(!xhr.responseText){
        console.log("response text was undefined");
        return Promise.reject(new Error("rejected!"));;
    }

    let obj = JSON.parse(xhr.responseText);

    if(!obj.data || obj.data.length == 0){
        //document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        console.log("no results found.");
        return; //bail out
    }

    callResult = obj.data;
    //console.log("call result:" + callResult);
}

// this is done DO NOT TOUCH
function dataDisplay(containerID, classN){
    if(callResult){
        let bigString = "";

        for (let result of callResult){

            let image = result.images.jpg.image_url;
            if(!image) image = "images/no-image-found.png";

            let line = `<div class='${classN}'><img src='${image}' />`;
            line += `<span><a target ='_blank' href='${result.url}'>${result.title}</a>
                <br>Rating: ${result.score}</span>
                <button type='button' class='save' data-name='${result.title}' data-image='${image}' data-rating='${result.score}' data-url='${result.url}'>Save</button>
                </div>`;

            bigString += line;
        }

        document.querySelector(containerID).innerHTML = bigString;
    }
    else{
        console.log("callResult was undefined");
        return;
    }

    saveButtons = document.querySelectorAll("button.save");
    

    for(let b of saveButtons){
        b.onclick = function(e){
            console.log(userList);
            userList.push({
                title: e.target.dataset.name,
                image: e.target.dataset.image, 
                rating: e.target.dataset.rating,
                url: e.target.dataset.url
            });

            localStorage.setItem(listKey, JSON.stringify(userList));
        }
    }
}

// xml request code stuff
async function getData(url, containerID, classN){
    // 1 - create a new XHR object
    let xhr = new XMLHttpRequest();
    
    // 4 - open connection & send request
    xhr.open("GET", url, true);
    //console.log("request opened");
    xhr.send();
    
    await delay(500);

    dataLoaded(xhr);
    dataDisplay(containerID, classN);
}

// delay helper method
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function dataError(e){
    console.log("ERROR");
}

// automatically searches under new criteria if the search filters have been changed
for(let checks in document.querySelectorAll(".widget").children){
    checks.onchange = function(){
        searchClicked();
    }
}