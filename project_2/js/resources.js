// functions n stuff


function getData(url){
    // 1 - create a new XHR object
    let xhr = new XMLHttpRequest();

    // 2 - setting the *onload* handler
    xhr.onload = homeLoaded;

    // 3 - setting the *onerror* handler
    xhr.onerror = dataError;

    // 4 - open connection & send request
    xhr.open("GET", url);
    xhr.send();
}

function homeLoaded(id, classN){
    let xhr = this;
    console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);
    console.log(obj.data);

    if(!obj.data || obj.data.length == 0){
        //document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        console.log("no results found.");
        return; //bail out
    }

    let searchResult = obj.data;
    let bigString = "";

        for (let result of searchResult){

            let image = result.images.jpg.image_url;
            if(!image) image = "images/no-image-found.png";

            let url = result.url;
            let rating = result.rating;
            if(!rating) rating = "Unrated";
            let title = result.title;

            let line = `<div class='${classN}'><img src='${image}' title='${result.title}' />`;
            line += `<span>
            <a target ='_blank' href='${url}'>${title}</a>
            <br>Rating: ${rating}
            <button type='button' class='save'>Save</button>
            </span></div>`;

            bigString += line;
        }

        document.querySelector(id).innerHTML = bigString;
}



function searchLoaded(){
    let xhr = this;

    console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);
    console.log(obj.data);

    if(!obj.data || obj.data.length == 0){
        //document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        console.log("no results found.");
        return; //bail out
    }

    let searchResult = obj.data;
    let bigString = "";

        for (let result of searchResult){

            let image = result.images.jpg.image_url;
            if(!image) image = "images/no-image-found.png";

            let url = result.url;
            let rating = result.rating;
            if(!rating) rating = "Unrated";
            let title = result.title;

            let line = `<div class='results'><img src='${image}' title='${result.title}' />`;
            line += `<span>
            <a target ='_blank' href='${url}'>${title}</a>
            <br>Rating: ${rating}
            <button type='button' class='save'>Save</button>
            </span></div>`;

            bigString += line;
        }

        document.querySelector("#searchResults").innerHTML = bigString;
}