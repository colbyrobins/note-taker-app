const fs = require('fs');
const path = require('path');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readAndAppend } = require('./helper/fsUtils.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => { 
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    });
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    
    if (title && text) {
        const newNote = { 
            title, 
            text,
            id: uuidv4()
        };
        readAndAppend(newNote, './db/db.json');
        res.json(newNote);
    } else {
        res.json("Error in posting new note.")
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});

