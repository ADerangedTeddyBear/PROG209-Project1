var express = require('express');
var path = require('path');

//leaving in the bodyParser in case we ever send up form data and need to get data out of form
var bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('public'))

// insert our data code here
// start by creating data so we don't have to type it in each time
let serverGameArray = [];
let serverSystemArray = [];

// define a constructor to create movie objects
let GameSystemObject = function (pName, pType, pRating, pReview) {
    this.reviewID = Math.random().toString(16).slice(5) // tiny chance could get duplicates!
    this.Name = pName;
    this.Type = pType;
    this.Rating = pRating;
    this.Review = pReview;
}

//Sample data
serverGameArray.push(new GameSystemObject("Ride to Hell: Retribution", "game", 10, "This game is so bad that it's hilarious. Buy it! "));
serverGameArray.push(new GameSystemObject("Cyberpunk 2077", "game", 7, "Good game but buggy. "));
serverGameArray.push(new GameSystemObject("Red Dead Redemption 2", "game", 9, "Great game overall. "));

serverSystemArray.push(new GameSystemObject("Nintendo Switch", "system", 10, "Great console to bring on the go"));
serverSystemArray.push(new GameSystemObject("Playstation 5", "system", 8, "Nice console but it's too hard to find. "));
serverSystemArray.push(new GameSystemObject("Xbox Series S", "system", 6, "It's okay. But it's not that strong. "));

// index page , serve the HTML
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

/* GET movieList. */
app.get('/gamelist', function (req, res) {
    res.json(serverGameArray);
});

app.get('/systemlist', function (req, res) {
    res.json(serverSystemArray);
});

/* POST to addMovie */
app.post('/addGame', function (req, res) {
    serverGameArray.push(req.body);
    // set the res(ponse) object's status propery to a 200 code, which means success
    res.status(200).send(JSON.stringify('success'));
});

/* POST to addMovie */
app.post('/addSystem', function (req, res) {
    serverSystemArray.push(req.body);
    // set the res(ponse) object's status propery to a 200 code, which means success
    res.status(200).send(JSON.stringify('success'));
});

// error page 
app.get('/error', function (req, res) {
    // should get real data from some real operation, but instead ...
    let message = "some text from someplace";
    let errorObject = {
        status: "this is real bad",
        stack: "somebody called #$% somebody who called somebody <awful>"
    };
    res.render('pages/error', { // pass the data to the page renderer
        message: message,
        error: errorObject
    });
});



app.listen(3000); // setting port number 
console.log('3000 is the magic port');

module.exports = app;