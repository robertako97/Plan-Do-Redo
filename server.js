//REQUIRE EXPRESS
/////////////////
const express = require('express');
const app = express();
//const PORT = 3001; deleted to listen heroku port

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
app.use(express.static(path.join(__dirname, '/')));

                                            /////////////////
                                            //DEFINE ROUTES//
                                            /////////////////

// TO FETCH NOTES HTML
/////////////////
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
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

                                            /////////////////
                                            //     POST    //
                                            /////////////////

/////////////////
//DEFINE POSTING NOTES ROUTE TO WRITE ON DB
/////////////////
app.post('/api/notes', (req, res) => {
    const notesPath = path.join(__dirname, 'api', 'notes.json');
    fs.readFile(notesPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            const notes = JSON.parse(data); //PARSE THE NOTE INTO A JS OBJECT AFTER READING DB CONTENT
            const newNote = req.body;
            newNote.id = notes.length + 1; // ID FOR NOTES TO HANDLE SAVING/DELETING
            notes.push(newNote); // ADD NEW NOTE TO THE DB
            fs.writeFile(notesPath, JSON.stringify(notes), 'utf8', writeErr => {
                if (writeErr) {
                    console.error(writeErr);
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ message: 'Note saved' });
                }
            });
        }
    });
});

                                            /////////////////
                                            //    DELETE   //
                                            /////////////////
//PATH TO DELETE BY ID PER INDEX JS
app.delete('/api/notes/:id', (req, res) => {
    const notesFilePath = path.join(__dirname, 'api', 'notes.json');
    fs.readFile(notesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            const notes = JSON.parse(data);
            //REQUIRE THE NOTE ID PARAMETER
            const noteId = parseInt(req.params.id, 10);
            //REMOVE NOTE FILTERING ALL NOTES WITH A DIFFERENT ID THAN THE "noteID"
            const updatedNotes = notes.filter(note => note.id !== noteId);
            //WRITE UPDATED NOTES
            fs.writeFile(notesFilePath, JSON.stringify(updatedNotes), 'utf8', writeErr => {
                if (writeErr) {
                    console.error(writeErr);
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ message: 'Note deleted successfully' });
                }
            });
        }
    });
});



app.listen(process.env.PORT || 5000);
