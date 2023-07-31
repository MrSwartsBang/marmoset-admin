const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require("fs");
require('dotenv').config();

mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, 
                                        useUnifiedTopology: true,
                                        useFindAndModify: false})
    .then(() =>console.log('MongoDB successfully connected.'))
    .catch(err => console.log(err));

const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
if(!process.env.Production)
app.use('/api',morgan('dev'));

[
    "admin","about","staff",
    "users","roadmap","carousel"
].map(apiItem =>app.use("/api",require(`./routes/api/${apiItem}`)));

app.use('/admin', express.static(path.join(__dirname, 'client/build')));
app.get('/admin/*', function (req, res) {res.sendFile(path.join(__dirname, 'client/build', 'index.html'));});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/uploads/*', function (req, res) {res.sendFile(path.join(__dirname, 'uploads'));});
app.use(express.static(path.join(__dirname, 'user_build/build')));
app.get('/*', function (req, res) {res.sendFile(path.join(__dirname, 'user_build/build', 'index.html'));});


app.listen(process.env.PORT, () => console.log(`Server up and running on port ${process.env.PORT} !`));

if(process.env.Production){
require("./utils/discordbot");
require("./utils/telegrambot");
}

