$(function(){setupDOM();run()});var song;var sound;var authenticated=false;var user;var tracksArray;var trackNum;var trackOffset=0;function setupDOM(){$("#favorite").tooltip();$("#why_connect").tooltip();$("#snapshot_length").tooltip();$("#loop_button").tooltip();$("#replay_button").tooltip();$(".song-controls").attr("disabled","disabled");$("#tracksHeardContainer").mCustomScrollbar({advanced:{updateOnContentResize:true},theme:"dark-thick"});$("#tracksLikedContainer").mCustomScrollbar({advanced:{updateOnContentResize:true},theme:"dark-thick"});initLikedList()}function run(){SC.initialize({client_id:"fac07a258929aa5be4d1010c4571d687",redirect_uri:"http://www.splicr.co/callback.html",});searchGenre()}function resolve(a){SC.get("/resolve",{url:a},function(b){song=b;stream(b.id);updateDOM()})}function updateDOM(){$("#song_image").attr("src",song.artwork_url);$("#waveform").css("background-image","url('"+song.waveform_url+"')");$("#title").html(song.title);$("#detail").html("Uploaded by <a target='_blank' href='"+song.user.permalink_url+"'>"+song.user.username+"</a>")}function setWaveformProgress(a,b){$("#waveform-progress").css("width",((a/b)*100)+"%")}function stream(b,c){var a=$("#intervalSelect").val();a=parseInt(a);a=a*1000;SC.whenStreamingReady(function(){sound=SC.stream(b.id);if(a!=0){sound.onPosition(b.duration*0+a,function(d){sound.setPosition(b.duration*0.16);setWaveformProgress(sound.position,b.duration);sound.clearOnPosition(b.duration*0+a)});sound.onPosition(b.duration*0.16+a,function(d){sound.setPosition(b.duration*0.32);setWaveformProgress(sound.position,b.duration);sound.clearOnPosition(b.duration*0.16+a)});sound.onPosition(b.duration*0.32+a,function(d){sound.setPosition(b.duration*0.48);setWaveformProgress(sound.position,b.duration);sound.clearOnPosition(b.duration*0.32+a)});sound.onPosition(b.duration*0.48+a,function(d){sound.setPosition(b.duration*0.64);setWaveformProgress(sound.position,b.duration);sound.clearOnPosition(b.duration*0.48+a)});sound.onPosition(b.duration*0.64+a,function(d){sound.setPosition(b.duration*0.8);setWaveformProgress(sound.position,b.duration);sound.clearOnPosition(b.duration*0.64+a)});sound.onPosition(b.duration*0.8+a,function(d){sound.stop();setWaveformProgress(b.duration,b.duration);sound.clearOnPosition(b.duration*0.8+a);c()});sound.setPosition(b.duration*0.16)}else{waveformDestroyClickForTooltip();$("#waveform").click(function(f){var h=$("#waveform").offset();var g=f.clientX-h.left;var d=$("#waveform").width();setWaveformProgress(g,d);sound.stop();sound.setPosition((g/d)*b.duration);sound.play({whileplaying:function(){setWaveformProgress(sound.position,b.duration)},onfinish:function(){c()}})})}sound.play({whileplaying:function(){setWaveformProgress(sound.position,b.duration)},onplay:function(){$("#status").html("Playing");$(".song-controls").removeAttr("disabled");setWaveformProgress(sound.position,b.duration)},onfinish:function(){if(a==0){c()}}})})}function streamCallback(){playTracks()}function play(){if(sound.paused){sound.resume()}else{if(sound.playState!=1){sound.play()}}}function pause(){if(!sound.paused){sound.pause()}}function stop(){sound.stop()}function skip(){streamCallback()}function replay(){if(song){sound.stop();$("#status").html("Reloading");$(".song-controls").attr("disabled","disabled");stream(song,streamCallback);$("#replay_button").tooltip("destroy")}}function loop(){$("#loop_button").tooltip("destroy")}function connect(){SC.connect(function(){SC.get("/me",function(a){user=a;$("#authenticator").html("<a id='connected_soundcloud' data-toggle='tooltip' data-placement='bottom' data-original-title='Hi "+a.username+"'>Connected to SoundCloud</a>");$("#connected_soundcloud").tooltip();$("#favorite").tooltip("destroy")})})}function favorite(){if(user){$("#favorite").tooltip("destroy");SC.put("/me/favorites/"+song.id)}else{}FB.getLoginStatus(function(a){if(a.status==="connected"){postLike("http://www.splicr.co/track?title="+song.title+"&image="+song.artwork_url)}else{}});addToLikedList(song)}function streamRaw(a){sound=SC.stream(a.id);sound.play({whileloading:function(){},whileplaying:function(){setWaveformProgress(sound.position,a.duration)},onplay:function(){$("#status").html("Playing");$(".song-controls").removeAttr("disabled");setWaveformProgress(sound.position,a.duration)},onfinish:function(){streamCallback()}})}function playWholeTrack(){if(song){sound.destruct();sound=null;streamRaw(song);waveformDestroyClickForTooltip();$("#waveform").click(function(b){var d=$("#waveform").offset();var c=b.clientX-d.left;var a=$("#waveform").width();setWaveformProgress(c,a);sound.stop();sound.setPosition((c/a)*song.duration);sound.play({whileplaying:function(){setWaveformProgress(sound.position,song.duration)},onfinish:function(){streamCallback()}})})}}function searchGenre(){var a=$("#genreSelect").val();trackOffset=Math.floor(Math.random()*1001);SC.get("/tracks",{genres:a,streamable:"true",offset:trackOffset,duration:{from:120000,to:300000}},function(b){if(!b.errors){tracksArray=b;trackNum=0;trackOffset=trackOffset+50;if(trackOffset>7900){trackOffset=0}playTracks()}else{searchGenre()}})}function getMoreTracks(){var a=$("#genreSelect").val();SC.get("/tracks",{genres:a,streamable:"true",offset:trackOffset,duration:{from:120000,to:300000}},function(b){tracksArray=b;trackNum=0;trackOffset=trackOffset+50;if(trackOffset>7900){trackOffset=0}})}function playTracks(){if(trackNum<tracksArray.length-1){trackNum++;if($("#loop_button").hasClass("active")){trackNum--}}else{trackNum=0;getMoreTracks()}cleanSound();while(tracksArray[trackNum].streamable==false){trackNum++}song=tracksArray[trackNum];stream(song,streamCallback);updateDOM();addToHeardList(song);var a=$("#intervalSelect").val();if(a!=0){$("#waveform").unbind("click");waveformClickForTooltip()}}function cleanSound(){if(sound){sound.destruct()}}var heardList=new Array();function addToHeardList(c){if(localStorage.heardList){try{if(JSON.parse(localStorage.heardList)){heardList=JSON.parse(localStorage.heardList)}}catch(a){heardList=new Array()}}heardList.push(c);localStorage.heardList=JSON.stringify(heardList);$("#tracksHeard").html("");for(var b=0;b<heardList.length;b++){$("#tracksHeard").append("<p><a onclick=\"playSong('"+heardList[b].permalink_url+"');\">"+heardList[b].title+'</a> uploaded by <a target="_blank" href="'+heardList[b].user.permalink_url+'">'+heardList[b].user.username+"</a></p>")}}function clearHeardList(){if(confirm("Are you sure?")){heardList=new Array();localStorage.removeItem("heardList");$("#tracksHeard").html("")}}var likedList=new Array();function addToLikedList(c){if(localStorage.likedList){try{if(JSON.parse(localStorage.likedList)){likedList=JSON.parse(localStorage.likedList)}}catch(a){likedList=new Array()}}likedList.push(c);localStorage.likedList=JSON.stringify(likedList);$("#tracksLiked").html("");for(var b=0;b<likedList.length;b++){$("#tracksLiked").append("<p><a onclick=\"playSong('"+likedList[b].permalink_url+"');\">"+likedList[b].title+'</a> uploaded by <a target="_blank" href="'+likedList[b].user.permalink_url+'">'+likedList[b].user.username+"</a></p>")}}function clearLikedList(){if(confirm("Are you sure?")){likedList=new Array();localStorage.removeItem("likedList");$("#tracksLiked").html("")}}function initLikedList(){if(localStorage.likedList){try{if(JSON.parse(localStorage.likedList)){likedList=JSON.parse(localStorage.likedList)}}catch(a){likedList=new Array()}}localStorage.likedList=JSON.stringify(likedList);$("#tracksLiked").html("");for(var b=0;b<likedList.length;b++){$("#tracksLiked").append("<p><a onclick=\"playSong('"+likedList[b].permalink_url+"');\">"+likedList[b].title+'</a> uploaded by <a target="_blank" href="'+likedList[b].user.permalink_url+'">'+likedList[b].user.username+"</a></p>")}}function waveformClickForTooltip(){$("#waveform").click(function(){$("#waveform").attr("data-toggle","tooltip");$("#waveform").attr("data-placement","right");$("#waveform").attr("data-original-title","To scroll the track, click Hear whole track or turn off splicing.");$("#waveform").tooltip()})}function waveformDestroyClickForTooltip(){$("#waveform").tooltip("destroy");$("#waveform").unbind("click")}function playSong(a){SC.get("/resolve",{url:a},function(b){tracksArray.push(b);trackNum=tracksArray.length-2;streamCallback()})};