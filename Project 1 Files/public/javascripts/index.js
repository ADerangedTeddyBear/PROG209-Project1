// Arrays to be used
let gameArray = [];
let systemArray = [];

let GameSystemObject = function (pName, pType, pRating, pReview) {
    this.reviewID = Math.random().toString(16).slice(5) // tiny chance could get duplicates!
    this.Name = pName;
    this.Type = pType;
    this.Rating = pRating;
    this.Review = pReview;
}

document.addEventListener("DOMContentLoaded", function () {

    // page before show code *************************************************************************
    $(document).on("pagebeforeshow", "#ListAll", function (event) {
        FillGameArrayFromServer(),
            FillSystemArrayFromServer()
    });

    $(document).on("pagebeforeshow", "#ListSome", function (event) {
        FillGameArrayFromServer(),
            FillSystemArrayFromServer()
    });

    document.getElementById("buttonAdd").addEventListener("click", function () {
        //movieArray.push(
        let newReview = new GameSystemObject(document.getElementById("Name").value, document.getElementById("Type").value,
            document.getElementById("Rating").value, document.getElementById("Review").value);
        addNewReview(newReview);
        document.location.href = "index.html#ListAll";
        // also add the URL value
    });

    // end of page before show code *************************************************************************

});

//Sequence for showing a selected system review
$(document).on("pagebeforeshow", "#systemDetails", function (event) {
    if (document.getElementById("IDparmHere").innerHTML == "change1") {
        document.location.href = "index.html#ListAll";
    }
    // normal path
    else {
        let localID = document.getElementById("IDparmHere").innerHTML;
        let arrayPointer = GetArrayPointer(localID, systemArray);
        document.getElementById("oneSystemName").innerHTML = "Name: " + systemArray[arrayPointer].Name;
        document.getElementById("oneSystemType").innerHTML = "Type: " + systemArray[arrayPointer].Type;
        document.getElementById("oneSystemRating").innerHTML = "Rating: " + systemArray[arrayPointer].Rating;
        document.getElementById("oneSystemReview").innerHTML = "Review: " + systemArray[arrayPointer].Review;
        document.getElementById("oneSystemID").innerHTML = systemArray[arrayPointer].reviewID;

    }


});

//Sequence for showing a selected game review
$(document).on("pagebeforeshow", "#gameDetails", function (event) {
    if (document.getElementById("IDparmHere").innerHTML == "change1") {
        alert('sorry, temporary error, please try again');
        document.location.href = "index.html#ListAll";
    }
    // normal path
    else {
        let localID = document.getElementById("IDparmHere").innerHTML;
        let arrayPointer = GetArrayPointer(localID, gameArray);
        document.getElementById("oneGameName").innerHTML = "Name: " + gameArray[arrayPointer].Name;
        document.getElementById("oneGameType").innerHTML = "Type: " + gameArray[arrayPointer].Type;
        document.getElementById("oneGameRating").innerHTML = "Rating: " + gameArray[arrayPointer].Rating;
        document.getElementById("oneGameReview").innerHTML = "Review: " + gameArray[arrayPointer].Review;
        document.getElementById("oneGameID").innerHTML = gameArray[arrayPointer].reviewID;
    }


});
// end of wait until document has loaded event  *************************************************************************

//Game list assembly
function FillGameArrayFromServer() {
    // using fetch call to communicate with node server to get all data
    fetch('/gamelist')
        .then(function (theResonsePromise) { // wait for reply.  
            return theResonsePromise.json();
        })
        .then(function (serverData) { // now wait for the 2nd promise, which is when data has finished being returned to client
            gameArray.length = 0; // clear local array
            gameArray = serverData; // use our server json data which matches our objects in the array perfectly
            createGameList(); // placing this here will make it wait for data from server to be complete before re-doing the list
            getMostRecentGame();
        })
        .catch(function (err) {
            console.log(err);
        });

};

function createGameList() {
    // clear prior data
    var divGameList = document.getElementById("divGameList");
    while (divGameList.firstChild) { // remove any old data so don't get duplicates
        divGameList.removeChild(divGameList.firstChild);
    };
    // re-build the li's with fresh data
    var ul = document.createElement('ul');
    gameArray.forEach(function (element, ) { // use handy array forEach method
        var li = document.createElement('li');
        li.classList.add('oneGameReview');
        li.setAttribute("data-parm", element.reviewID);

        //Create item to be added to list and append to ul
        li.innerHTML = element.reviewID + ": " + element.Name + ", Rating:  " + element.Rating + " out of 10, Comments:  " + element.Review;
        ul.appendChild(li);
    });
    divGameList.appendChild(ul)

    var liArray = document.getElementsByClassName("oneGameReview");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {
            var parm = this.getAttribute("data-parm"); // passing in the record.Id
            document.getElementById("IDparmHere").innerHTML = parm;
            console.log(document.getElementById("IDparmHere").innerHTML);

            // Display to gameDetails "page"
            document.location.href = "index.html#gameDetails";
        });
    });
};

function getMostRecentGame() {
    // clear prior data
    var divMostRecentGame = document.getElementById("divMostRecentGame");
    while (divMostRecentGame.firstChild) { // remove any old data so don't get duplicates
        divMostRecentGame.removeChild(divMostRecentGame.firstChild);
    };
    // re-build the li's with fresh data
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    li.innerHTML = gameArray[gameArray.length - 1].Name + ", Rating:  " + gameArray[gameArray.length - 1].Rating + " out of 10, Comments:  " + gameArray[gameArray.length - 1].Review;
    ul.appendChild(li);

    divMostRecentGame.appendChild(ul)
};

//System list assembly
function FillSystemArrayFromServer() {
    // using fetch call to communicate with node server to get all data
    fetch('/systemlist')
        .then(function (theResonsePromise) { // wait for reply.  
            return theResonsePromise.json();
        })
        .then(function (serverData) { // now wait for the 2nd promise, which is when data has finished being returned to client
            systemArray.length = 0; // clear local array
            systemArray = serverData; // use our server json data which matches our objects in the array perfectly
            createSystemList(); // placing this here will make it wait for data from server to be complete before re-doing the list
            getMostRecentSystem();
        })
        .catch(function (err) {
            console.log(err);
        });
};

function createSystemList() {
    // clear prior data
    var divSystemList = document.getElementById("divSystemList");
    while (divSystemList.firstChild) { // remove any old data so don't get duplicates
        divSystemList.removeChild(divSystemList.firstChild);
    };
    // re-build the li's with fresh data
    var ul = document.createElement('ul');
    systemArray.forEach(function (element, ) { // use handy array forEach method
        var li = document.createElement('li');

        li.classList.add('oneSystemReview');
        li.setAttribute("data-parm", element.reviewID);

        li.innerHTML = element.reviewID + ": " + element.Name + ", Rating:  " + element.Rating + " out of 10, Comments:  " + element.Review;
        ul.appendChild(li);
    });
    divSystemList.appendChild(ul)



    // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var liArray = document.getElementsByClassName("oneSystemReview");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {
            var parm = this.getAttribute("data-parm"); // passing in the record.Id
            document.getElementById("IDparmHere").innerHTML = parm;
            console.log(document.getElementById("IDparmHere").innerHTML);

            // now jump to our page that will use that one item
            document.location.href = "index.html#systemDetails";
        });
    });


};

function getMostRecentSystem() {
    // clear prior data
    var divMostRecentSystem = document.getElementById("divMostRecentSystem");
    while (divMostRecentSystem.firstChild) { // remove any old data so don't get duplicates
        divMostRecentSystem.removeChild(divMostRecentSystem.firstChild);
    };
    // re-build the li's with fresh data
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    li.innerHTML = systemArray[systemArray.length - 1].Name + ", Rating:  " + systemArray[systemArray.length - 1].Rating + " out of 10, Comments:  " + systemArray[systemArray.length - 1].Review;
    ul.appendChild(li);

    divMostRecentSystem.appendChild(ul)
};

function addNewReview(newReview) {
    // the required post body data is our movie object passed into this function

    // create request object
    if (newReview.Type == 'game') {
        const request = new Request('/addGame', {
            method: 'POST',
            body: JSON.stringify(newReview),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
        // use that request object we just created for our fetch() call
        fetch(request)
            // wait for frist server promise response of "200" success 
            // (can name these returned promise objects anything you like)
            .then(function (theResonsePromise) { // the .json sets up 2nd promise
                return theResonsePromise.json()
            })
            // now wait for the 2nd promise, which is when data has finished being returned to client
            .then(function (theResonsePromiseJson) {
                console.log(theResonsePromiseJson.toString()),
                    document.location.href = "#ListAll"
            })
            // the client console log will write out the message I added to the Repsonse on the server
            .catch(function (err) {
                console.log(err);
            });
    } else {
        const request = new Request('/addSystem', {
            method: 'POST',
            body: JSON.stringify(newReview),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
        // use that request object we just created for our fetch() call
        fetch(request)
            // wait for frist server promise response of "200" success 
            // (can name these returned promise objects anything you like)
            .then(function (theResonsePromise) { // the .json sets up 2nd promise
                return theResonsePromise.json()
            })
            // now wait for the 2nd promise, which is when data has finished being returned to client
            .then(function (theResonsePromiseJson) {
                console.log(theResonsePromiseJson.toString()),
                    document.location.href = "#ListAll"
            })
            // the client console log will write out the message I added to the Repsonse on the server
            .catch(function (err) {
                console.log(err);
            });
    }
}; // end of addNewMovie

//Gets index of select item from given array
function GetArrayPointer(localID, arrayParam) {
    for (let i = 0; i < arrayParam.length; i++) {
        if (localID === arrayParam[i].reviewID) {
            return i;
        }
    }
}