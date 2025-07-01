require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const api = require('./routes/api.js');
const auth = require('./routes/auth');
const alarm = require('./routes/alarm');
const walletAuth = require('./routes/walletAuth');

const db = require('./config/keys.js').mongoURI;

// Updated Mongoose connection for v8.x with better error handling
mongoose.connect(db, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverSelectionTimeoutMS: 5000,
	connectTimeoutMS: 10000,
})
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => {
		console.error('MongoDB connection error:', err.message);
		process.exit(1);
	});

const app = express();

// Passport Middleware
app.use(passport.initialize());

// app.use(cors());
// Passport Strategy
require('./config/passport')(passport);

// Body Parser Middleware
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(bodyParser.json());

app.use('/api', api);
app.use('/api/auth', auth);
app.use('/api/auth/wallet', walletAuth);
app.use('/api/alarm', alarm);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
