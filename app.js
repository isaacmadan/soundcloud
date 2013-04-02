var express = require('express');
var app = express();

app.get('/hello.txt', function(req, res){
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
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
		res.send(
			 "<head prefix='og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# music: http://ogp.me/ns/music#'>"+
			 "<meta property='fb:app_id' content='528374303872869' />"+
			 "<meta property='og:type' content='music.song' />"+
			 //res.send("<meta property='og:type' content='cookbook:recipe' />");
			 "<meta property='og:url' content='http://www.splicr.co/track?title="+title+"&image="+image+"' />"+
			 "<meta property='og:title' content='"+title+"' />"+
			 "<meta property='og:image' content='"+image+"' />"+
			 "<meta property='music:album:url' content='http://www.splicr.co/track?title="+title+"&image="+image+"&fb_action_ids="+"1' />"+ 
			 "<meta property='cookbook:author' content='http://samples.ogp.me/390580850990722' />");
	}

});

//minify
var compressor = require('node-minify');
new compressor.minify({
	type: 'yui-js',
	fileIn: 'public/js/music.js',
	fileOut: 'public/js/music-min.js',
	callback: function(err){
	}
});
new compressor.minify({
	type: 'yui-js',
	fileIn: 'public/js/facebook.js',
	fileOut: 'public/js/facebook-min.js',
	callback: function(err){
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