var Instagram = require('instagram-node-lib'),
	config = require('../config');
	passport = require('passport')

Instagram.set('client_id', config.secrets.clientId);
Instagram.set('client_secret', config.secrets.clientSecret);
Instagram.set('redirect_uri', 'http://stalkergram.herokuapp.com/auth/instagram/callback');

module.exports = function (app) {
	
	function containsObject(obj, list, meta) {
	    var i;
	    for (i = 0; i < list.length; i++) {
	        if (list[i].username === obj) {
	            list[i][meta]++
	            return true;
	        }
	    }
	    return false;
	}	


	app.get('/', function(req, res) {
		res.render('index', {title:'StalkerGram'})
	})

	app.get('/stalkers', function(req, res) {
		res.render('stalkers', {title:'StalkerGram'})
	})


	app.get('/mystalkers', function(req, res) {
		console.log(req)
		Instagram.users.recent({ 
	    user_id: req.user.id,
	    count: -1
	    , complete: function(data, pagination){
	    	var users = [];
		    	for(var i =0; i< data.length; i++){
		    		var like = data[i].likes.data
		    		var comment = data[i].comments.data
		    		for(var j = 0; j<like.length; j++){
		    			var username = like[j].username;
		    			var fullname = like[j].full_name;
		    			if(containsObject(username, users, 'likes')){
		    			} else {
		    				var profile_picture = like[j].profile_picture;
		    				var id = like[j].id;
		    				var user = {'username': username, 'full_name': fullname, 'likes':1, 'comments':0, 'profile_picture': profile_picture, 'id': id};
		    				users.push(user);
		    			}
		    		}
		    		for(var k = 0; k<comment.length; k++){
		    			var username = comment[k].from.username;
		    			var fullname = comment[k].from.full_name;
		    			if(containsObject(username, users, 'comments')){
		    			} else {
		    				var profile_picture = comment[k].from.profile_picture;
		    				var id = comment[k].from.id;
		    				var user = {'username': username, 'likes':0, 'full_name': fullname, 'comments':1, 'profile_picture': profile_picture, 'id': id};
		    				users.push(user);
		    			}
		    		}
				}
				console.log(users)
				res.send({users: users})
			}
		});
	})


	app.get('/auth/instagram',
	  passport.authenticate('instagram'),
	  function(req, res){
	    // The request will be redirected to Instagram for authentication, so this
	    // function will not be called.
	});

	app.get('/auth/instagram/callback', 
	  passport.authenticate('instagram', { failureRedirect: '/' }),
	  function(req, res) {
	    res.redirect('/stalkers');
	});


}