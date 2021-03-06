$(function() {

	// Additional JS functions here
	window.fbAsyncInit = function() {
		FB.init({
			  appId      : '528374303872869', // App ID
			  channelUrl : '//www.splicr.co/channel.html', // Channel File
			  status     : true, // check login status
			  cookie     : true, // enable cookies to allow the server to access the session
			  xfbml      : true  // parse XFBML
		});

		// Additional init code here
		FB.getLoginStatus(function(response) {
			  if (response.status === 'connected') {
			    // connected
			    FB.api('/me', function(response) {
        			$("#facebook").html("<a id='connected_facebook' data-toggle='tooltip' data-placement='bottom' data-original-title='Hi "+response.name+"'>Connected to Facebook</a>");
					$("#connected_facebook").tooltip();
    			});
			    
			  } else if (response.status === 'not_authorized') {
			    // not_authorized
			    //login();
			  } else {
			    // not_logged_in
			    //login();
			  }
		});
	};
	// Load the SDK Asynchronously
	(function(d){
		 var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
		 if (d.getElementById(id)) {return;}
		 js = d.createElement('script'); js.id = id; js.async = true;
		 js.src = "//connect.facebook.net/en_US/all.js";
		 ref.parentNode.insertBefore(js, ref);
	}(document));
});

function launchLogin() {
	FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
			// connected
		} else if (response.status === 'not_authorized') {
			// not_authorized
			login();
		} else {
			// not_logged_in
			login();
		}
	});
}

function login() {
    FB.login(function(response) {
        if (response.authResponse) {
            // connected
            //testAPI();
            //postToTimeline("fb api test");
            //postLike(song.permalink_url);
            //console.log(response);
            //postLike("http://secret-tundra-2377.herokuapp.com/track?title="+song.title+"&image="+song.artwork_url);
            FB.api('/me', function(response) {
            	$("#facebook").html("<a id='connected_facebook' data-toggle='tooltip' data-placement='bottom' data-original-title='Hi "+response.name+"'>Connected to Facebook</a>");
				$("#connected_facebook").tooltip();
			});
        } else {
            // cancelled
        }
    }, {scope:'publish_actions'});
}

function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log('Good to see you, ' + response.name + '.');
    });
}

function postToTimeline(body) {
	FB.api('/me/feed', 'post', { message: body }, function(response) {
	  if (!response || response.error) {
	    //alert('Error occured');
	  } else {
	    //alert('Post ID: ' + response.id);
	  }
	});
}

function postLike(objectToLike) {
	FB.api(
	   'https://graph.facebook.com/me/og.likes',
	   'post',
	   { object: objectToLike },
	   function(response) {
	     if (!response) {
	       //alert('Error occurred.');
	     } else if (response.error) {
	     	//console.log(response);
	     } else {
	     	//console.log('Facebook post success');
	     }
	   }
	);

	/**
	FB.api(
	  'me/splicrco:discover',
	  'post',
	  {
	    song: objectToLike
	  },
	  function(response) {
	    // handle the response
	    if(!response) {
	    	console.log(response);
	    }
	    else if(response.error) {
	    	console.log(response);
	    }
	    else {
	    	console.log(response);
	    }
	  }
	);
	**/
}


