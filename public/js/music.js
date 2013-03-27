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
	$("#why_connect").tooltip();
	$(".song-controls").attr("disabled","disabled");
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
				$(".song-controls").removeAttr("disabled");
		    	sound.setPosition(sound.duration * 0.16);
		  		setWaveformProgress(sound.position, sound.duration);
		    	console.log("Set intial to: " + sound.position);
		    	sound.play();

		    	sound.onPosition(sound.duration * 0.16 + 3000, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.setPosition(sound.duration * 0.32);
		    		setWaveformProgress(sound.position, sound.duration);
		    		sound.clearOnPosition(sound.duration * 0.16 + 3000);
		    	});

		    	sound.onPosition(sound.duration * 0.32 + 3000, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.setPosition(sound.duration * 0.48);
		    		setWaveformProgress(sound.position, sound.duration);
		    		sound.clearOnPosition(sound.duration * 0.32 + 3000);
		    	});

		    	sound.onPosition(sound.duration * 0.48 + 3000, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.setPosition(sound.duration * 0.64);
		    		setWaveformProgress(sound.position, sound.duration);
		    		sound.clearOnPosition(sound.duration * 0.48 + 3000);
		    	});

				sound.onPosition(sound.duration * 0.64 + 3000, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.setPosition(sound.duration * 0.8);
		    		setWaveformProgress(sound.position, sound.duration);
		    		sound.clearOnPosition(sound.duration * 0.64 + 3000);
		    	})

		    	sound.onPosition(sound.duration * 0.8 + 3000, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.stop();
		    		setWaveformProgress(sound.duration, sound.duration);
		    		sound.clearOnPosition(sound.duration * 0.8 + 3000);
		    	})
		  	}
		});
	});
}

function play() {
	if(sound.paused) {
		sound.resume();
	}
	else {
		if(sound.playState != 1) {
			sound.play();
		}
	}
}

function pause() {
	if(!sound.paused) {
		sound.pause();
	}
}

function stop() {
	sound.stop();
}

function replay() {
	if(song) {
		sound.stop();
		$("#status").html("Reloading");
		$(".song-controls").attr("disabled","disabled");
		stream(song.id);
	}
}

function connect() {
	SC.connect(function() {
		SC.get('/me', function(me) { 
    		user = me;
    		$("#authenticator").html("<a id='connected_soundcloud' data-toggle='tooltip' data-placement='bottom' data-original-title='Hi "+me.username+"'>Connected to SoundCloud</a>");
			$("#connected_soundcloud").tooltip();
  		});
	});
}

function favorite() {
	if(user) {
		$("#favorite").attr('data-original-title',"Added to your SoundCloud favorites");
	}
	else {
	}
}

/** unclear how to get this to work **/
function clearOnPositionCallbacks() {
	sound.clearOnPosition(sound.duration*0.16+3000);
	sound.clearOnPosition(sound.duration*0.32+3000);
	sound.clearOnPosition(sound.duration*0.48+3000);
	sound.clearOnPosition(sound.duration*0.64+3000);
	sound.clearOnPosition(sound.duration*0.8+3000);
}

function streamRaw(id) {
	sound = SC.stream(id);
	sound.load({
		onload: function() {
			sound.play();
		}
	});
}

function playWholeTrack() {
	if(song) {
		sound.stop();
		sound = null;
		streamRaw(song.id);
	}
}



