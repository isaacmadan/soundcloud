var express = require('express');
var app = express();

app.get('/hello.txt', function(req, res){
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

/**
app.get('/', function(req, res){
  res.render('index', function(err, html){
  	// ...
	});
});
**/

app.use(express.static(__dirname + '/public'));

app.listen(3000);
console.log('Listening on port 3000');

//error handling - at the end of the file
app.use(errorHandler);
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}