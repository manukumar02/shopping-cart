var express = require('express');
var app = express();
var fs = require('fs');
var PORT = process.env.PORT || 3000;

// app.use(express.static(__dirname + '/src'));
app.use(express.static('public'));
app.use(express.static('src/views'));

// var handlebars = require('express-handlebars');
// app.engine('.hbs', handlebars({extname: '.hbs'}));
//
// app.set('view engine', '.hbs');
//
// app.all('*', function(req, res, next){
//     fs.readFile('products.json', function(err, data){
//         res.locals.products = JSON.parse(data);
//         next();
//     });
// });


app.get('/', function (req, res) {
    res.render('index', data);
});
app.listen(PORT, function () {
    console.log('Running server on Port - ' + PORT);
});