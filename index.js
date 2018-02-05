const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session'); // give access to cookies
const passport = require('passport'); // tell passport to make use of them
const keys = require('./config/keys');

// because we are not assigning anything to it we dont assign a variable to it just requiring it to be executed on startup
require('./models/User');
require('./services/passport')

mongoose.connect(keys.mongoURI)

const app = express();

// Cookie-session vs Express-session
// Cookie-session: cookie is the session (contains actual user id and data - limited to 4kb of what you can store in cookie)
// express-session: cookie references a session (contains a refence to a session inside the cookie - we can store as much data as we want to inside the cookie because it is a reference to database)

// app.use calls are wiring up what we call middleware
// middleware - small functions that can be used to modify an incoming request to our app before they are sent off to route handlers
// they take incoming requests and make minor adjustments to it
app.use(
	// pulls some data out of the cookie
	// it extracts it in req.session - it contains the data that passport is trying to store inside of the cookie
	cookieSession({
		// how long can this cookie exist inside browser before it expires
		// 30 days, 24 hrs in a day, 60 min in hour, 60 sec in min, 1000 milsec in sec
		maxAge: 30 * 24 * 60 * 60 * 1000,
		//used to encrypt cookie
		keys: [keys.cookieKey]
	})
);
// passport pulls the userid out of the cookie (actually req.session)
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app); //importing routes to use it with express in this file. We dont need to give it a variable we can use this method to import what we need

// process.env.PORT is for production and 5000 is for development
// This is called Dynamic Port Binding
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server ${PORT} is running!`));