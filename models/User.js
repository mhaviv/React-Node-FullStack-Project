const mongoose = require('mongoose');
// mongoose wants to know ahead of time what the Schema is so it take away schemsless ability of mongo db
const { Schema } = mongoose;

const UserSchema = new Schema({
	googleId: String
})


//telling mongoose we want to create a new collection of users
mongoose.model('users', UserSchema);