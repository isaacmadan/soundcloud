$(function() {
	setupDOM();
	run();
})

var URL = "https://soundcloud.com/lordemusic/bravado-fffrrannno-remix";
var song;
var sound;
var authenticated = false;
var user;

function setupDOM() {
	$("#favorite").popover();
	if(user) {
		//alert("logged in");
	}
	else {
		//alert("not logged in");
	}
}

function run() {
	SC.initialize({
		client_id: "fac07a258929aa5be4d1010c4571d687",
		redirect_uri: "http://secret-tundra-2377.herokuapp.com/callback.html",
	});
	resolve(URL);
}

function resolve(thisUrl) {
	SC.get("/resolve", {url: thisUrl}, function(data) {
		song = data;
		stream(data.id);
		updateDOM();
	});
}

function updateDOM() {
	console.log(song);
	$("#song_image").attr("src", song.artwork_url);
	$("#waveform").css("background-image", "url('"+song.waveform_url+"')");
	$("#title").html(song.title);
	$("#detail").html("Uploaded by <a href='"+song.user.permalink_url+"'>"+song.user.username+"</a>");
}

function setWaveformProgress(position, duration) {
	$("#waveform-progress").css("width",((position/duration)*100)+"%");
}

function stream(id) {
	SC.whenStreamingReady(function() {
		sound = SC.stream(id);
		sound.load({
			onload: function() {
				$("#status").html("Playing");
		    	sound.setPosition(sound.duration * 0.16);
		  		setWaveformProgress(sound.position, sound.duration);
		    	console.log("Set intial to: " + sound.position);
		    	sound.play();

		    	sound.onPosition(sound.duration * 0.16 + 3000, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.setPosition(sound.duration * 0.32);
		    		setWaveformProgress(sound.position, sound.duration);
		    	});

		    	sound.onPosition(sound.duration * 0.32 + 3000, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.setPosition(sound.duration * 0.48);
		    		setWaveformProgress(sound.position, sound.duration);
		    	});

		    	sound.onPosition(sound.duration * 0.48 + 3000, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.setPosition(sound.duration * 0.64);
		    		setWaveformProgress(sound.position, sound.duration);
		    	});

				sound.onPosition(sound.duration * 0.64 + 5000, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.setPosition(sound.duration * 0.8);
		    		setWaveformProgress(sound.position, sound.duration);
		    	})

		    	sound.onPosition(sound.duration * 0.8 + 5000, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.stop();
		    		setWaveformProgress(sound.duration, sound.duration);
		    	})
		  	}
		});
	});
}

function play() {
	sound.play();
}

function pause() {
	sound.pause();
}

function stop() {
	sound.stop();
}

function connect() {
	SC.connect(function() {
		SC.get('/me', function(me) { 
    		user = me;
    		$("#authenticator").html(me.username);
  		});
	});
}

function favorite() {
	if(user) {
		$("#favorite").attr('data-original-title',"Added to your SoundCloud favorites");
		//$("#favorite").popover('destroy');
	}
	else {
	}
}



