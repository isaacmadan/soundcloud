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

app.get('http://splicr.co/*',function(req,res){  
    //res.redirect('http://'+req.url)
    res.redirect('http://www.splicr.co');
});

app.get('/track', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	var title = req.query.title;
	var image = req.query.image;
	//res.send("<title>"+title+"</title>");

	var fbCallback = req.query.fb_action_ids;
	if(fbCallback) {
		res.writeHead(301,
	  		{Location: 'index.html'}
		);
		res.end();
	}
	else {
		res.send("<meta property='fb:app_id' content='528374303872869' />"+
			 "<meta property='og:type' content='og:article' />"+
			 //res.send("<meta property='og:type' content='cookbook:recipe' />");
			 "<meta property='og:url' content='http://www.splicr.co/track?title="+title+"&image="+image+"' />"+
			 "<meta property='og:title' content='"+title+"' />"+
			 "<meta property='og:image' content='"+image+"' />"+
			 "<meta property='cookbook:author' content='http://samples.ogp.me/390580850990722' />");
	}

});

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public')); //last line for uses

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

//error handling - at the end of the file
app.use(errorHandler);
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}