const apiPath = "https://api.jikan.moe/v4";
let sfw;
let limit;
let anime;
let manga;
let aniList;
let saveButtons;

window.onload = (e) => {
    populateHome();
    document.querySelector("#search").onclick = searchClicked;
};

function populateHome(){
    // let topAnimeURL = apiPath + "/top/anime";
    // console.log(topAnimeURL);

    // getData(topAnimeURL);
    // await 300; dataDisplay("#top_anime", "top-anime");
}


async function dataDisplay(containerID, classN){
    if(callResult){
        let bigString = "";

        for (let i = 0; i < callResult.length; i++){
            let result = callResult[i];

            let image = result.images.jpg.image_url;
            if(!image) image = "images/no-image-found.png";

            let url = result.url;
            let rating = result.rating;

            let line = `<div class='${classN}'><img src='${smallURL}' title='${result.id}' />`;
            line += `<span><a target ='_blank' href='${url}'>View on MAL</a><br>Rating: ${rating}</span></div>`;

            bigString += line;
        }

        document.querySelector(containerID).innerHTML = bigString;
    }
}

function searchClicked(){
    console.log("search button was clicked!");
    let searchURL = apiPath;
    let term = encodeURIComponent(document.querySelector("#searchterm").value.trim());
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

    
    searchURL += "&limit=" + limit;
    
    console.log(searchURL);
    getData(searchURL);
}

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

function dataLoaded(){
    let xhr = this;

    console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);
    console.log(obj.data);

    if(!obj.data || obj.data.length == 0){
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        console.log("no results found.");
        return; //bail out
    }

    let searchResult = obj.data;
    let bigString = "";

        for (let i = 0; i < searchResult.length; i++){
            let result = searchResult[i];

            let image = result.images.jpg.image_url;
            if(!image) image = "images/no-image-found.png";

            let url = result.url;
            let rating = result.rating;
            if(!rating) rating = "Unrated";
            let title = result.title;

            let line = `<div class='search-results'><img src='${image}' title='${result.title}' />`;
            line += `<span>
            <a target ='_blank' href='${url}'>${title}</a>
            <br>Rating: ${rating}
            <button type='button' class='save'>Save</button>
            </span></div>`;

            bigString += line;
        }

        document.querySelector("#searchResults").innerHTML = bigString;
}

function dataError(e){
    console.log("ERROR");
}

saveButtons = document.querySelectorAll("button.save");
for(let b of saveButtons){
    b.onchange = function(e){
            
       }
}