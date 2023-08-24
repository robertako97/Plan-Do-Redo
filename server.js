//REQUIRE EXPRESS
/////////////////
const express = require('express');
const app = express();
const PORT = 3001;

//REQUIRE PATH MODULE TO CALL FILES & FS FOR SYSTEM INTERACTION
/////////////////
const path = require('path');
const fs = require('fs');

//USING PARSER TO HANDLES " NOTES " REQUESTS THAT WILL BE FETCHED/POSTED
/////////////////
const bodyParser = require('body-parser'); // Add this line
app.use(bodyParser.json());

// PATH TO FILES IN THE PUBLIC FOLDER CALLING THE INDEX/NOTES HTML
/////////////////
app.use(express.static(path.join(__dirname, 'public')));

                                            /////////////////
                                            //DEFINE ROUTES//
                                            /////////////////

// TO FETCH NOTES HTML
/////////////////
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});
// TO FETCH NOTES FROM DB
/////////////////
app.get('/api/notes', (req, res) => {
    // CONSTRUCT PATH TO FILE
    const notesFilePath = path.join(__dirname, 'api', 'notes.json');
    // READ FILE CONTENT AS UTF8 (TEXT ASCII CODE)
    fs.readFile(notesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            const notes = JSON.parse(data);
            res.json(notes);
        }
    });
});


app.listen(PORT, () => {
    console.log('Server is running on port 3001');
});
