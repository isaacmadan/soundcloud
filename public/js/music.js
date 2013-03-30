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
	$("#loop_button").tooltip();
	$("#replay_button").tooltip();
	$(".song-controls").attr("disabled","disabled");
	//$("#skip_button").attr("disabled", "disabled");
	$("#tracksHeardContainer").mCustomScrollbar({
	    advanced:{
	        updateOnContentResize: true
	    },
	    theme: "dark-thick"
	});
	$("#tracksLikedContainer").mCustomScrollbar({
	    advanced:{
	        updateOnContentResize: true
	    },
	    theme: "dark-thick"
	});
	initLikedList();
	
	/**
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
	**/
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
	//console.log(song);
	$("#song_image").attr("src", song.artwork_url);
	$("#waveform").css("background-image", "url('"+song.waveform_url+"')");
	$("#title").html(song.title);
	$("#detail").html("Uploaded by <a href='"+song.user.permalink_url+"'>"+song.user.username+"</a>");
	//$("#skip_button").removeAttr("disabled");
}

function setWaveformProgress(position, duration) {
	$("#waveform-progress").css("width",((position/duration)*100)+"%");
}

function stream(thisSong, callback) {
	var interval = $("#intervalSelect").val();
	interval = parseInt(interval);
	interval = interval * 1000;

	SC.whenStreamingReady(function() {
		sound = SC.stream(thisSong.id);

		if(interval != 0) {
		sound.onPosition(thisSong.duration * 0 + interval, function(eventPosition) {
    		//console.log("Waited three seconds: " + sound.position);
    		sound.setPosition(thisSong.duration * 0.16);
    		setWaveformProgress(sound.position, thisSong.duration);
    		sound.clearOnPosition(thisSong.duration * 0 + interval);
    	});

		sound.onPosition(thisSong.duration * 0.16 + interval, function(eventPosition) {
    		//console.log("Waited three seconds: " + sound.position);
    		sound.setPosition(thisSong.duration * 0.32);
    		setWaveformProgress(sound.position, thisSong.duration);
    		sound.clearOnPosition(thisSong.duration * 0.16 + interval);
    	});

    	sound.onPosition(thisSong.duration * 0.32 + interval, function(eventPosition) {
    		//console.log("Waited three seconds: " + sound.position);
    		sound.setPosition(thisSong.duration * 0.48);
    		setWaveformProgress(sound.position, thisSong.duration);
    		sound.clearOnPosition(thisSong.duration * 0.32 + interval);
    	});

    	sound.onPosition(thisSong.duration * 0.48 + interval, function(eventPosition) {
    		//console.log("Waited three seconds: " + sound.position);
    		sound.setPosition(thisSong.duration * 0.64);
    		setWaveformProgress(sound.position, thisSong.duration);
    		sound.clearOnPosition(thisSong.duration * 0.48 + interval);
    	});

		sound.onPosition(thisSong.duration * 0.64 + interval, function(eventPosition) {
    		//console.log("Waited three seconds: " + sound.position);
    		sound.setPosition(thisSong.duration * 0.8);
    		setWaveformProgress(sound.position, thisSong.duration);
    		sound.clearOnPosition(thisSong.duration * 0.64 + interval);
    	});

    	sound.onPosition(thisSong.duration * 0.8 + interval, function(eventPosition) {
    		//console.log("Waited three seconds: " + sound.position);
    		sound.stop();
    		setWaveformProgress(thisSong.duration, thisSong.duration);
    		sound.clearOnPosition(thisSong.duration * 0.8 + interval);
    		callback();
    	});

    	sound.setPosition(thisSong.duration * 0.16);
    	}
    	else {
    		waveformDestroyClickForTooltip();
    		$("#waveform").click(function(e) {
				var offset = $("#waveform").offset();
				var newX = e.clientX - offset.left;
				var width = $("#waveform").width();
				setWaveformProgress(newX, width);
				sound.stop();
				sound.setPosition((newX/width)*thisSong.duration);
				sound.play({
					whileplaying: function() {
						setWaveformProgress(sound.position, thisSong.duration);
					},
					onfinish: function() {
						callback();
					}
				});
			});
    	}
		
		sound.play({
			//stream: true,
			//from: thisSong.duration * 0.16,
			whileplaying: function() {
				setWaveformProgress(sound.position, thisSong.duration);
				//console.log("going");
			},
			//onload: function() {
			onplay: function() {
				$("#status").html("Playing");
				$(".song-controls").removeAttr("disabled");
		    	//sound.setPosition(thisSong.duration * 0.16);
		  		setWaveformProgress(sound.position, thisSong.duration);
		    	//console.log("Set intial to: " + thisSong.duration);
		    	//sound.play();
		  	},
		  	onfinish: function() {
		  		if(interval == 0) {
		  			callback();
		  		}
		  	}
		});
	});
}


function streamCallback() {
	//console.log('finished stream');
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
		$("#replay_button").tooltip("destroy");
	}
}

function loop() {
	$("#loop_button").tooltip("destroy");
	//trackNum--;
	//streamCallback();
}

function connect() {
	SC.connect(function() {
		SC.get('/me', function(me) { 
    		user = me;
    		$("#authenticator").html("<a id='connected_soundcloud' data-toggle='tooltip' data-placement='bottom' data-original-title='Hi "+me.username+"'>Connected to SoundCloud</a>");
			$("#connected_soundcloud").tooltip();
			$("#favorite").tooltip("destroy");
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

function streamRaw(thisSong) {
	sound = SC.stream(thisSong.id);

	sound.play({
		//stream: true,
		whileloading: function() { 
			//console.log("loading next track");
		},
		whileplaying: function() {
			setWaveformProgress(sound.position, thisSong.duration);
		},
		onplay: function() {
			$("#status").html("Playing");
			$(".song-controls").removeAttr("disabled");
	  		setWaveformProgress(sound.position, thisSong.duration);
	  	},
	  	onfinish: function() {
	  		streamCallback();
	  	}
	});

}

function playWholeTrack() {
	if(song) {
		sound.destruct();
		sound = null;
		streamRaw(song);

		waveformDestroyClickForTooltip();
		$("#waveform").click(function(e) {
			var offset = $("#waveform").offset();
			var newX = e.clientX - offset.left;
			var width = $("#waveform").width();
			setWaveformProgress(newX, width);
			sound.stop();
			sound.setPosition((newX/width)*song.duration);
			sound.play({
				whileplaying: function() {
					setWaveformProgress(sound.position, song.duration);
				},
				onfinish: function() {
					streamCallback();
				}
			});
		});
	}
}

function searchGenre() {
	var query = $("#genreSelect").val();

	//trackOffset = 201;
	trackOffset = Math.floor(Math.random()*101);

	SC.get('/tracks', { genres: query, streamable: 'true', offset: trackOffset, duration: { from: 120000, to: 300000 } }, function(tracks) { //use 480000 for 8 minutes; currently 5 min is for optimal non lag
  		if(!tracks.errors) {
  			//console.log(tracks);
	  		tracksArray = tracks;
	  		trackNum = 0;
	  		trackOffset = 50;
	  		playTracks();
  		}
  		else { searchGenre(); }
	});
}

function getMoreTracks() {
	var query = $("#genreSelect").val();

	SC.get('/tracks', { genres: query, streamable: 'true', offset: trackOffset, duration: { from: 120000, to: 300000 } }, function(tracks) {
  		//console.log(tracks);
  		//console.log("getting more tracks starting at " + trackOffset);
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
		if($("#loop_button").hasClass("active")) { //loop
			trackNum--;
		}
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
	var interval = $("#intervalSelect").val();
	if(interval != 0) {
		$("#waveform").unbind("click");
		waveformClickForTooltip();
	}
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

function waveformClickForTooltip() {
	$("#waveform").click(function() {
		$("#waveform").attr("data-toggle", "tooltip");
		$("#waveform").attr("data-placement", "right");
		$("#waveform").attr("data-original-title", "To scroll the track, click Hear whole track or turn off splicing.");
		$("#waveform").tooltip();
	});
}

function waveformDestroyClickForTooltip() {
	$("#waveform").tooltip("destroy");
	$("#waveform").unbind("click");
}







