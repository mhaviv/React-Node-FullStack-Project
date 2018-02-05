const passport = require('passport');

module.exports = app => {
	// Whenever a user comes to this route, we want to kick them into our oauth flow
	// (which is managed by passport)
	// internally GoogleStrategy has a little bit of code saying I am known as a little strategy called 'google'
	// this evidentally points to the whole strategy above using 'google' string
	// then we pass options object which has scope
	// scope identifes to google servers what access we want to have inside a users profile
	// so we have access to profile information and email address as well
	app.get('/auth/google', passport.authenticate('google', {
		scope: ['profile', 'email'] // these are scopes google allows (not made up - we can get contacts too or stuff like that)
	}))

	// passport is going to see the code is available in this route handler
	// google will now exchange the code for the user profile
	app.get('/auth/google/callback', passport.authenticate('google', {

	})
	);

	app.get('/api/logout', (req, res) => {
		req.logout();
		res.send(req.user);
	})

	app.get('/api/current_user', (req, res) => {
		res.send(req.user);
		// res.send(req.session);
	})
}