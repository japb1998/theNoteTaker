const express = require('express');
const fs = require('fs');
const path = require('path');
const {
    isObject
} = require('util');
const { type } = require('os');
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname,'db/db.json'),(err,data)=>{
        res.json(JSON.parse(data));
    })
   
});
app.post('/api/notes', (req, res) => {

    fs.readFile(path.join(__dirname, 'db/db.json'), (err, data) => {
        if (err) {
            return err
        }
        var arrayOfNotes = JSON.parse(data);
        if(typeof arrayOfNotes[0] === 'object'){
          let id = arrayOfNotes[arrayOfNotes.length - 1].id ;
          id++;
          req.body.id = id
        } else {
            req.body.id = 1;
        }
        
        arrayOfNotes.push(req.body);
        console.log(arrayOfNotes)
        fs.writeFileSync(path.join(__dirname, 'db/db.json'), JSON.stringify(arrayOfNotes), (err) => {
            console.log(arrayOfNotes);
        })

    });
})
app.listen(PORT, () => {
    console.log('Listening to port ' + PORT)
});