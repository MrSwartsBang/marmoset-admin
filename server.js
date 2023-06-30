const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const carousel = require('./routes/api/carousel');
const admin = require('./routes/api/admin');
const about = require('./routes/api/about');
const staff = require('./routes/api/staff');
const users = require('./routes/api/users');
const morgan = require('morgan');
require('dotenv').config();


const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const db = process.env.mongoURI;
mongoose.connect(db, { useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false})
    .then(() =>
    console.log('MongoDB successfully connected.')
    ).catch(err => console.log(err));
    

    
    app.use(passport.initialize());
    app.use('/api',morgan('dev'));
    app.use('/api', admin);
    app.use('/api', users);
    app.use('/api', carousel);
    app.use('/api', about);
    app.use('/api', staff);
    
app.use('/admin', express.static(path.join(__dirname, 'client/build')));
app.get('/admin/*', function (req, res) {res.sendFile(path.join(__dirname, 'client/build', 'index.html'));});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/uploads/*', function (req, res) {res.sendFile(path.join(__dirname, 'uploads'));});
app.use(express.static(path.join(__dirname, 'user_build')));
app.get('/*', function (req, res) {res.sendFile(path.join(__dirname, 'user_build', 'index.html'));});


app.listen(process.env.PORT, () => console.log(`Server up and running on port ${process.env.PORT} !`));

// require("./utils/discordbot");
// require("./utils/telegrambot");
