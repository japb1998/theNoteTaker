const express = require('express');
const fs = require('fs');
const path = require('path');
const { type } = require('os');
const PORT = process.env.PORT || 3000;
const app = express();
const { v4: uuidv4 } = require('uuid')
app.use(express.urlencoded({
    extended: true
}))
//static file and express.json
app.use(express.json())
app.use(express.static('public'));
//request handlers
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
        let arrayOfNotes = JSON.parse(data);
  
        const note = {
            id:uuidv4(),
           title: req.body.title,
           text: req.body.text
        }
       
        arrayOfNotes.push(note);
        console.log(arrayOfNotes)
        fs.writeFileSync(path.join(__dirname, 'db/db.json'), JSON.stringify(arrayOfNotes), (err) => {
            if(err){ return err}
            console.log(arrayOfNotes);
            
        })
        res.send('success');
    });
    
});
app.delete('/api/notes/:id',(req,res)=>{
    let deletedItem = req.params.id;

    fs.readFile(path.join(__dirname,'db/db.json'),(err,data)=>{
         let arrayOfNotes = JSON.parse(data);
         for(var i=0; i < arrayOfNotes.length; i++){
if(arrayOfNotes[i].id === deletedItem){
    arrayOfNotes.splice(i,1);
    fs.writeFileSync(path.join(__dirname,'db/db.json'),JSON.stringify(arrayOfNotes))
    return res.send('sucess')
} else (console.log(i))
    }}) 
    
})
app.listen(PORT, () => {
    console.log('Listening to port ' + PORT)
});