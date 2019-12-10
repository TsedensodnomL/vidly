
const express = require('express');
const Joi = require('@hapi/joi');
const app = express();

app.use(express.json());

const genres = [
    { id: 1, name: 'Horror'},
    { id: 2, name: 'Thriller'},
    { id: 3, name: 'Funny'}
];

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre){
        return res.status(404).send('Not Found');
    }
    res.send(genre);
});

app.post('/api/genres/:id', (req, res) => {
    //Validation
    const {error} = validateInput(req.body);
    if (!error){
        return res.status(400).send(error.details[0].message);
    } 

    const genre = {
        id: genres.lenght+1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre){
        return res.status(404).send('Not Found');
    }
    //Validation
    const {error} = validateInput(req.body);
    if(!error){
        return res.status(400).send(error.details[0].message);
    }

    genres.name = req.body.name;
    res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre){
        return res.status(404).send('Not Found');
    }

    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
});

function validateInput(genre){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema) 
}

const port = process.env.PORT || 3000;
app.listen(port);