const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

// fetching something from mongoose
const User = mongoose.model('users');

passport.serializeUser((user, done) => {

	// user.id is id in database from mongo (not related to google)
	// we use user.id because most chances in application we would have multiple strategies for passport
	done(null, user.id);
})

// want to searhc database for that user and after we find one call done
passport.deserializeUser((id, done) => {
	User.findById(id)
		.then (user => {
			done(null, user);
		})
})

// Telling passport to use new strategy
// new instance of the Google Passport Strategy
// need to give it client id and client secret - so google know which app this is for
// if callbackURL is a relative path, it causes on deployment to search for http and not https since there is heroku proxy before it goes to the browser
passport.use(new GoogleStrategy({
	clientID: keys.googleClientID,
	clientSecret: keys.googleClientSecret,
	callbackURL: '/auth/google/callback', // after person grants access this is url to redirect to site
	proxy: true //if request runs through any proxy, trust the proxy and calculate url correctly
},
(accessToken, refreshToken, profile, done) => {
	User.findOne({ googleId: profile.id })
		.then((existingUser) => {
			if(existingUser) {
				// we already have a given record with the give profile ID
				done(null, existingUser);
			} else {
				// we dont have a user record with this ID
				new User({ googleId: profile.id }) // new instance of user
					.save() // .save() saves it to database
					.then(user => done(null, existingUser));
			}
		})
})
);