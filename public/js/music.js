$(function() {
	setupDOM();
	run();
})

var URL = "https://soundcloud.com/lordemusic/bravado-fffrrannno-remix";
var song; //soundcloud object
var sound; //soundmanager2 object
var authenticated = false;
var user;

var tracksArray; //soundcloud song objects
var trackNum; //index
var trackOffset = 0;

function setupDOM() {
	$("#favorite").popover();
	$("#why_connect").tooltip();
	$(".song-controls").attr("disabled","disabled");
	
	try {
		SC.get('/me', function(me) {
			if(!me.errors) {
				user = me;
				$("#authenticator").html("<a id='connected_soundcloud' data-toggle='tooltip' data-placement='bottom' data-original-title='Hi "+me.username+"'>Connected to SoundCloud</a>");
				$("#connected_soundcloud").tooltip();
			}
		}); 
	}
	catch(ignore) {}
}

function run() {
	SC.initialize({
		client_id: "fac07a258929aa5be4d1010c4571d687",
		redirect_uri: "http://secret-tundra-2377.herokuapp.com/callback.html",
	});
	//resolve(URL);
	searchGenre();
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

function stream(id, callback) {
	SC.whenStreamingReady(function() {
		sound = SC.stream(id);
		sound.load({
			whileloading: function() { 
				console.log("loading next track");
				$("#status").html("Loading");
				$(".song-controls").attr("disabled", "disabled");
				setWaveformProgress(0, 1);
			},
			whileplaying: function() {
				setWaveformProgress(sound.position, sound.duration);
			},
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
		    		callback();
		    	})
		  	}
		});
	});
}

function streamCallback() {
	console.log('finished stream');
	playTracks();
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

function skip() {
	streamCallback();
}

function replay() {
	if(song) {
		sound.stop();
		$("#status").html("Reloading");
		$(".song-controls").attr("disabled","disabled");
		stream(song.id, streamCallback);
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
		SC.put('/me/favorites/'+song.id);
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
		whileloading: function() { 
			console.log("loading next track");
			$("#status").html("Loading");
			$(".song-controls").attr("disabled", "disabled");
			setWaveformProgress(0, 1);
		},
		whileplaying: function() {
			setWaveformProgress(sound.position, sound.duration);
		},
		onload: function() {
			$("#status").html("Playing");
			$(".song-controls").removeAttr("disabled");
			sound.play();
		}
	});
}

function playWholeTrack() {
	if(song) {
		sound.destruct();
		sound = null;
		streamRaw(song.id);
	}
}

function searchGenre() {
	var query = $("#genreSelect").val();

	//trackOffset = 201;
	trackOffset = Math.floor(Math.random()*101);
	console.log("THE OFFSET " + trackOffset);

	SC.get('/tracks', { genres: query, streamable: 'true', offset: trackOffset, duration: { from: 120000, to: 480000 } }, function(tracks) {
  		if(!tracks.errors) {
  			console.log(tracks);
	  		tracksArray = tracks;
	  		trackNum = 0;
	  		trackOffset = 50;
	  		playTracks();
  		}
  		else { console.log("ERROR IN REQ"); searchGenre(); }
	});
}

function searchTrack() {
	var query = $("#trackSearch").val();

	SC.get('/tracks', { q: query }, function(tracks) {
  		console.log(tracks);
	});
}

function getMoreTracks() {
	var query = $("#genreSelect").val();

	SC.get('/tracks', { genres: query, streamable: 'true', offset: trackOffset, duration: { from: 120000, to: 480000 } }, function(tracks) {
  		console.log(tracks);
  		console.log("getting more tracks starting at " + trackOffset);
  		tracksArray = tracks;
  		trackNum = 0;
  		trackOffset = trackOffset + 50;
  		if(trackOffset > 7900) {
  			trackOffset = 0;
  		}
	});
}

function playTracks() {
	if(trackNum < tracksArray.length-1) {
		trackNum++;
	}
	else {
		trackNum = 0;
		getMoreTracks();
	}
	//sound = null;
	cleanSound();
	while(tracksArray[trackNum].streamable == false) trackNum++;
	song = tracksArray[trackNum];
	stream(song.id, streamCallback);
	updateDOM();
	addToHeardList(song);
}

function cleanSound() {
	if(sound) {
		sound.destruct();
	}
}

var heardList = new Array();
function addToHeardList(thisSong) {
	if(localStorage.heardList) {
		if(JSON.parse(localStorage.heardList))  {
			heardList = JSON.parse(localStorage.heardList);
		}
	}
	heardList.push(thisSong);
	localStorage.heardList = JSON.stringify(heardList);
	var localList = JSON.parse(localStorage.heardList);
	$("#tracksHeard").html("");
	for(var i = 0; i < localList.length; i++) {
		$("#tracksHeard").append("<p><a href='"+localList[i].permalink_url+"'>"+localList[i].title+"</a> uploaded by <a href='"+localList[i].user.permalink_url+"'>"+localList[i].user.username+"</a></p>");
	}
	//$("#tracksHeard").append("<p><a href='"+thisSong.permalink_url+"'>"+thisSong.title+"</a> uploaded by <a href='"+thisSong.user.permalink_url+"'>"+thisSong.user.username+"</a></p>");
}

function clearHeardList() {
	if(confirm("Are you sure?")) {
		heardList = new Array();
		localStorage.heardList = null;
		$("#tracksHeard").html("");
	}
}









