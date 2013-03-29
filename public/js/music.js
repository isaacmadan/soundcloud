$(function() {
	setupDOM();
	run();
})

//var URL = "https://soundcloud.com/lordemusic/bravado-fffrrannno-remix";
var song; //soundcloud object
var sound; //soundmanager2 object
var authenticated = false;
var user;

var tracksArray; //soundcloud song objects
var trackNum; //index
var trackOffset = 0;

function setupDOM() {
	$("#favorite").tooltip();
	//$("#favorite").popover({ animation: 'true', delay: { show: 10, hide: 10 }});
	$("#why_connect").tooltip();
	$("#snapshot_length").tooltip();
	$(".song-controls").attr("disabled","disabled");
	initLikedList();
	
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
		redirect_uri: "http://www.splicr.co/callback.html",
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

/**
function stream(id, callback) {
	var interval = $("#intervalSelect").val();
	interval = parseInt(interval);
	interval = interval * 1000;

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

		    	sound.onPosition(sound.duration * 0.16 + interval, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.setPosition(sound.duration * 0.32);
		    		setWaveformProgress(sound.position, sound.duration);
		    		sound.clearOnPosition(sound.duration * 0.16 + interval);
		    	});

		    	sound.onPosition(sound.duration * 0.32 + interval, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.setPosition(sound.duration * 0.48);
		    		setWaveformProgress(sound.position, sound.duration);
		    		sound.clearOnPosition(sound.duration * 0.32 + interval);
		    	});

		    	sound.onPosition(sound.duration * 0.48 + interval, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.setPosition(sound.duration * 0.64);
		    		setWaveformProgress(sound.position, sound.duration);
		    		sound.clearOnPosition(sound.duration * 0.48 + interval);
		    	});

				sound.onPosition(sound.duration * 0.64 + interval, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.setPosition(sound.duration * 0.8);
		    		setWaveformProgress(sound.position, sound.duration);
		    		sound.clearOnPosition(sound.duration * 0.64 + interval);
		    	})

		    	sound.onPosition(sound.duration * 0.8 + interval, function(eventPosition) {
		    		console.log("Waited three seconds: " + sound.position);
		    		sound.stop();
		    		setWaveformProgress(sound.duration, sound.duration);
		    		sound.clearOnPosition(sound.duration * 0.8 + interval);
		    		callback();
		    	})
		  	}
		});
	});
}**/

function stream(thisSong, callback) {
	var interval = $("#intervalSelect").val();
	interval = parseInt(interval);
	interval = interval * 1000;

	SC.whenStreamingReady(function() {
		sound = SC.stream(thisSong.id);

		sound.onPosition(thisSong.duration * 0 + interval, function(eventPosition) {
    		console.log("Waited three seconds: " + sound.position);
    		sound.setPosition(thisSong.duration * 0.16);
    		setWaveformProgress(sound.position, thisSong.duration);
    		sound.clearOnPosition(thisSong.duration * 0 + interval);
    	});

		sound.onPosition(thisSong.duration * 0.16 + interval, function(eventPosition) {
    		console.log("Waited three seconds: " + sound.position);
    		sound.setPosition(thisSong.duration * 0.32);
    		setWaveformProgress(sound.position, thisSong.duration);
    		sound.clearOnPosition(thisSong.duration * 0.16 + interval);
    	});

    	sound.onPosition(thisSong.duration * 0.32 + interval, function(eventPosition) {
    		console.log("Waited three seconds: " + sound.position);
    		sound.setPosition(thisSong.duration * 0.48);
    		setWaveformProgress(sound.position, thisSong.duration);
    		sound.clearOnPosition(thisSong.duration * 0.32 + interval);
    	});

    	sound.onPosition(thisSong.duration * 0.48 + interval, function(eventPosition) {
    		console.log("Waited three seconds: " + sound.position);
    		sound.setPosition(thisSong.duration * 0.64);
    		setWaveformProgress(sound.position, thisSong.duration);
    		sound.clearOnPosition(thisSong.duration * 0.48 + interval);
    	});

		sound.onPosition(thisSong.duration * 0.64 + interval, function(eventPosition) {
    		console.log("Waited three seconds: " + sound.position);
    		sound.setPosition(thisSong.duration * 0.8);
    		setWaveformProgress(sound.position, thisSong.duration);
    		sound.clearOnPosition(thisSong.duration * 0.64 + interval);
    	});

    	sound.onPosition(thisSong.duration * 0.8 + interval, function(eventPosition) {
    		console.log("Waited three seconds: " + sound.position);
    		sound.stop();
    		setWaveformProgress(thisSong.duration, thisSong.duration);
    		sound.clearOnPosition(thisSong.duration * 0.8 + interval);
    		callback();
    	});

    	sound.setPosition(thisSong.duration * 0.16);

		sound.play({
			//stream: true,
			from: thisSong.duration * 0.16,
			whileloading: function() { 
				console.log("loading next track");
				//$("#status").html("Loading");
				//$(".song-controls").attr("disabled", "disabled");
				//setWaveformProgress(0, 1);
			},
			whileplaying: function() {
				setWaveformProgress(sound.position, thisSong.duration);
				console.log("going");
			},
			//onload: function() {
			onplay: function() {
				$("#status").html("Playing");
				$(".song-controls").removeAttr("disabled");
		    	//sound.setPosition(thisSong.duration * 0.16);
		  		setWaveformProgress(sound.position, thisSong.duration);
		    	console.log("Set intial to: " + thisSong.duration);
		    	//sound.play();
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
		stream(song, streamCallback);
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
		//$("#favorite").attr('data-original-title',"Added to your SoundCloud favorites.");
		$("#favorite").tooltip("destroy");
		SC.put('/me/favorites/'+song.id);
	}
	else {
	}

	FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
			postLike("http://www.splicr.co/track?title="+song.title+"&image="+song.artwork_url);
		}
		else {
		}
	});

	addToLikedList(song);

}

/** unclear how to get this to work **/
/**
function clearOnPositionCallbacks() {
	sound.clearOnPosition(sound.duration*0.16+interval);
	sound.clearOnPosition(sound.duration*0.32+interval);
	sound.clearOnPosition(sound.duration*0.48+interval);
	sound.clearOnPosition(sound.duration*0.64+interval);
	sound.clearOnPosition(sound.duration*0.8+interval);
}
**/

function streamRaw(thisSong) {
	sound = SC.stream(thisSong.id);
	/**
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
	**/

	sound.play({
		//stream: true,
		whileloading: function() { 
			console.log("loading next track");
		},
		whileplaying: function() {
			setWaveformProgress(sound.position, thisSong.duration);
		},
		onplay: function() {
			$("#status").html("Playing");
			$(".song-controls").removeAttr("disabled");
	  		setWaveformProgress(sound.position, thisSong.duration);
	  	}
	});

}

function playWholeTrack() {
	if(song) {
		sound.destruct();
		sound = null;
		streamRaw(song);
	}
}

function searchGenre() {
	var query = $("#genreSelect").val();

	//trackOffset = 201;
	trackOffset = Math.floor(Math.random()*101);
	console.log("THE OFFSET " + trackOffset);

	SC.get('/tracks', { genres: query, streamable: 'true', offset: trackOffset, duration: { from: 120000, to: 300000 } }, function(tracks) { //use 480000 for 8 minutes; currently 5 min is for optimal non lag
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

/**
function searchTrack() {
	var query = $("#trackSearch").val();

	SC.get('/tracks', { q: query }, function(tracks) {
  		console.log(tracks);
	});
}
**/

function getMoreTracks() {
	var query = $("#genreSelect").val();

	SC.get('/tracks', { genres: query, streamable: 'true', offset: trackOffset, duration: { from: 120000, to: 300000 } }, function(tracks) {
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
	stream(song, streamCallback);
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
		try {
			if(JSON.parse(localStorage.heardList))  {
				heardList = JSON.parse(localStorage.heardList);
			}
		}
		catch(error) {
			heardList = new Array();
		}
	}

	heardList.push(thisSong);
	localStorage.heardList = JSON.stringify(heardList);

	$("#tracksHeard").html("");
	for(var i = 0; i < heardList.length; i++) {
		$("#tracksHeard").append("<p><a href='"+heardList[i].permalink_url+"'>"+heardList[i].title+"</a> uploaded by <a href='"+heardList[i].user.permalink_url+"'>"+heardList[i].user.username+"</a></p>");
	}
}

function clearHeardList() {
	if(confirm("Are you sure?")) {
		heardList = new Array();
		localStorage.removeItem("heardList");
		$("#tracksHeard").html("");
	}
}

var likedList = new Array();
function addToLikedList(thisSong) {
	if(localStorage.likedList) {
		try {
			if(JSON.parse(localStorage.likedList))  {
				likedList = JSON.parse(localStorage.likedList);
			}
		}
		catch(error) {
			likedList = new Array();
		}
	}

	likedList.push(thisSong);
	localStorage.likedList = JSON.stringify(likedList);

	$("#tracksLiked").html("");
	for(var i = 0; i < likedList.length; i++) {
		$("#tracksLiked").append("<p><a href='"+likedList[i].permalink_url+"'>"+likedList[i].title+"</a> uploaded by <a href='"+likedList[i].user.permalink_url+"'>"+likedList[i].user.username+"</a></p>");
	}
}

function clearLikedList() {
	if(confirm("Are you sure?")) {
		likedList = new Array();
		localStorage.removeItem("likedList");
		$("#tracksLiked").html("");
	}
}

function initLikedList() {
	if(localStorage.likedList) {
		try {
			if(JSON.parse(localStorage.likedList))  {
				likedList = JSON.parse(localStorage.likedList);
			}
		}
		catch(error) {
			likedList = new Array();
		}
	}

	localStorage.likedList = JSON.stringify(likedList);

	$("#tracksLiked").html("");
	for(var i = 0; i < likedList.length; i++) {
		$("#tracksLiked").append("<p><a href='"+likedList[i].permalink_url+"'>"+likedList[i].title+"</a> uploaded by <a href='"+likedList[i].user.permalink_url+"'>"+likedList[i].user.username+"</a></p>");
	}
}








