var express = require('express');
var app = express();
var fs = require('fs');
var PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.static('src/views'));

app.get('/', function (req, res) {
    res.render('index', data);
});
app.listen(PORT, function () {
    console.log('Running server on Port - ' + PORT);
});