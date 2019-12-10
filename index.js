const express = require('express');
const config = require('config');
const suDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const Joi = require('@hapi/joi');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger');

const app = express();
app.set('view engine', 'pug');
app.set('views', './views'); //default store views

app.use(express.json());
app.use(helmet());
//if it's in development stage
if(app.get('env') === 'development'){ 
    app.use(morgan('tiny'));    
}
app.use(express.urlencoded({extended: true}));
app.use(express.static('public')); //static files like html 
app.use(logger); //custom middleware

//Config 
suDebugger('Name ' + config.get('name')); //DEBUG=app:startup nodemon index.js
//console.log('Name ' + config.get('mail.password'));


const genres = [
    { id: 1, name: 'Horror'},
    { id: 2, name: 'Thriller'},
    { id: 3, name: 'Funny'}
];

app.get('/api/genres', (req, res) => {
    res.render('index', {title: 'Vidly', h1: 'Hello'});
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