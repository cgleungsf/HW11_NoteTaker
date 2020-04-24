// require dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');

const uuid = require('uuid/v4');
const databasePath = path.join(__dirname, "/db/db.json");
const database = require("./db/db.json");
const app = express();

// Sets an initial port and connection for Heroku
const PORT = process.env.PORT || 3001;

// express middleware
app.use(express.urlencoded({ extended: true }));

//body parsing
app.use(express.json());
app.use(express.static("public"));

// set up for index.html
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// set up for notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// return all saved notes in database as JSON
// makes a GET request (placing all the parameters in the URL)
app.get("/api/notes", function (req, res) {
    res.json(database);
    // console.log(database);
});

//makes a POST request (placing all the parameters in the body)
app.post("/api/notes", function (req, res) {
    console.log("a note has been added");
    // using the unique id module
    const uniqueId = uuid();
    const note = req.body;
    note.id = uniqueId;
    database.push(note);
    fs.writeFile(databasePath, JSON.stringify(database), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    res.status(200).json(database);
    res.json(database);
});

app.delete("/api/notes/:id", function (req, res) {
    const deleteId = req.params.id;
    for (let i = 0; i < database.length; i++) {
        if (database[i].id === deleteId) {
            //splice() adds or removes items to or from an array to add -- splice (index, howmany, additem1, ....additemx), to remove splice (index, how many)
            database.splice(i, 1);
        }
    }
    res.json(database);
});

//takes in all the data to update array of values saved
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});