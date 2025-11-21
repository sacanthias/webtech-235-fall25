const apiPath = "https://api.jikan.moe/v4";
let sfw;
let limit;
let anime;
let manga;
let userList;
let saveButtons;

window.onload = (e) => {
    populateHome();
    document.querySelector("#search").onclick = searchClicked;
};

function populateHome(){
    let topAnimeURL = apiPath + "/top/anime";
    console.log(topAnimeURL);

    //getData(topAnimeURL);
}

// TODO: solve the timing issue below.
// somehow make the dataLoaded function wait for the xhr GET or something
// use await xhr.open()?
// but i want to keep things separated as they are now without needing to encapsulate other functions....
async function dataLoaded(){
    console.log("data has loaded")
    let xhr = this;
    console.log(xhr.responseText);

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

    return obj.data;
}

async function dataDisplay(containerID, classN){
    console.log("calling");
    let callResult = await dataLoaded();
    console.log("received data");
    console.log("call result:" + callResult);

    if(callResult){
        let bigString = "";

        for (let result of callResult){

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

// searchClicked is to *specifically* handle searching 
function searchClicked(){
    console.log("search button was clicked!");
    let searchURL = apiPath;
    let term = encodeURIComponent(document.querySelector("#searchterm").value.trim());
    let limit = document.querySelector("#limit").value;
    
    sfw = document.querySelector("#mediaSFW:checked");
    anime = document.querySelector("#mediaAnime:checked");
    manga = document.querySelector("#mediaManga:checked");

    // TODO: simplify this if else block.
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
    getSearch(searchURL);
    //dataDisplay("searchResults", "results")
}

// xml request code stuff *specifically* for handling user-inputted search
function getSearch(url){
    // 1 - create a new XHR object
    let xhr = new XMLHttpRequest();
    
    // 4 - open connection & send request
    xhr.open("GET", url, true);
    console.log("request opened");
    xhr.send();

    // code snatched from mozilla docs dattebayo
    if (xhr.readyState === XMLHttpRequest.DONE) {
        const status = xhr.status;
        console.log("xhr status: " + xhr.status);
        if (status === 0 || (status >= 200 && status < 400)) {
            // The request has been completed successfully
            console.log(xhr.responseText);
            dataLoaded;
        } else {
        // Oh no! There has been an error with the request!
        }
    }
}

function dataError(e){
    console.log("ERROR");
}

saveButtons = document.querySelectorAll("button.save");
for(let b of saveButtons){
    b.onchange = function(e){
        
    }
}