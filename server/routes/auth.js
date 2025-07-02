const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');

// load input validations
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateEscrowInput = require('../validation/escrow');

// loads User model
const User = require('../models/Auth');

router.get('/test', (req, res) =>
	res.json({
		msg: 'Users Works'
	})
);

// @route ---> POST api/auth/AuthRegister
// @desc  ---> Register auth user
// @access --> Public
router.post('/Authregister', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);
	// check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const nPass = req.body.nPassword;

	User.findOne()
		.then((data) => {
			if (data === null) {
				const newUser = new User({
					Authpassword: req.body.password
				});

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.Authpassword = hash;
						newUser
							.save()
							.then((user) => res.json('Auth Password set  Successfully'))
							.catch((err) => console.log(err));
					});
				});
			} else {
				// bcrypt.genSalt(10, (err, salt) => {
				// 	bcrypt.hash(nPass, salt, (err, hash) => {
				// 		if (err) throw err;
				// 		data.Authpassword = hash;
				// 		data
				// 			.save()
				// 			.then((user) => res.json('Password Changed Successfully'))
				// 			.catch((err) => console.log(err));
				// 	});
				// });

				bcrypt.compare(nPass, data.Authpassword).then((isMatch) => {
					if (isMatch) {
						bcrypt.genSalt(10, (err, salt) => {
							bcrypt.hash(req.body.password, salt, (err, hash) => {
								if (err) throw err;
								data.Authpassword = hash;
								data
									.save()
									.then((user) => res.json('Auth Password Changed Successfully'))
									.catch((err) => console.log(err));
							});
						});
					} else {
						errors.nPassword = 'Incorrect password';
						return res.status(400).json(errors);
					}
				});
			}
		})
		.catch((err) => res.status(404).json(err));
});

// @route ---> GET api/auth/Authlogin
// @desc  ---> Login user/returning JWT (Json webtoken)
// @access --> Public
router.post('/Authlogin', (req, res) => {
	const password = req.body.password;
	const { errors, isValid } = validateLoginInput(req.body);
	// validation check
	if (!isValid) {
		return res.status(400).json(errors);
	}
	User.findOne().then((user) => {
		if (!user) {
			errors.password = 'This User not found';
			return res.status(400).json(errors);
		}
		// check password
		bcrypt.compare(password, user.Authpassword).then((isMatch) => {
			if (isMatch) {
				// create JWT payload
				const payload = { id: user.id, name: user.escrowAddress };
				// Sign token
				jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
					res.json({
						success: true,
						token: 'Bearer ' + token
					});
				});
			} else {
				errors.password = 'Incorrect password';
				return res.status(400).json(errors);
			}
		});
	});
});

// @route ---> POST api/auth/register
// @desc  ---> Register user
// @access --> Public
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);
	// check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const nPass = req.body.nPassword;

	User.findOne()
		.then((data) => {
			if (data === null) {
				const newUser = new User({
					password: req.body.password
				});

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser
							.save()
							.then((user) => res.json('Password set Successfully'))
							.catch((err) => console.log(err));
					});
				});
			} else {
				bcrypt.compare(nPass, data.password).then((isMatch) => {
					if (isMatch) {
						bcrypt.genSalt(10, (err, salt) => {
							bcrypt.hash(req.body.password, salt, (err, hash) => {
								if (err) throw err;
								data.password = hash;
								data
									.save()
									.then((user) => res.json('Password Changed Successfully'))
									.catch((err) => console.log(err));
							});
						});
					} else {
						errors.nPassword = 'Incorrect password';
						return res.status(400).json(errors);
					}
				});
			}
		})
		.catch((err) => res.status(404).json(err));
});

// @route ---> GET api/auth/login
// @desc  ---> Login user/returning JWT (Json webtoken)
// @access --> Public
router.post('/login', (req, res) => {
	const password = req.body.password;

	const { errors, isValid } = validateLoginInput(req.body);

	// validation check
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne().then((user) => {
		if (!user) {
			errors.password = 'This User not found';
			return res.status(400).json(errors);
		}
		// check password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (isMatch) {
				// create JWT payload
				const payload = { id: user.id, name: user.escrowAddress };
				// Sign token
				jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
					res.json({
						success: true,
						token: 'Bearer ' + token
					});
				});
			} else {
				errors.password = 'Incorrect password';
				return res.status(400).json(errors);
			}
		});
	});
});

// @route ---> GET api/auth/current
// @desc  ---> Login current user
// @access --> Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json(req.user);
});

// @route ---> POST api/auth/escrow
// @desc  ---> Escrow address input
// @access --> Public
router.post('/escrow', (req, res) => {
	const { errors, isValid } = validateEscrowInput(req.body);
	// check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne().then((data) => {
		data.escrowAddress = req.body.escrowAddress;
		data.save().then((data) => res.json('Address set Successfully')).catch((err) => console.log(err));
	});
});

// @route ---> GET api/auth/escrow
// @desc  ---> Escrow address input
// @access --> Public
router.get('/escrow', (req, res) => {
	User.findOne()
		.then((data) => {
			if (data) {
				res.json(data);
			} else {
				// Return null if no user exists
				res.json(null);
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(404).json(err);
		});
});

// @route ---> SET api/auth/setNetFeeValueToken
// @desc  ---> set net fee input
// @access --> Public
router.post('/setNetFeeValueToken', (req, res) => {
	User.findOne()
		.then((dat) => {
			if (!dat) {
				// Create new user if none exists
				const newUser = new User({
					netFeeValueToken: {
						BSC: req.body.BSC || 0.15,
						BSCTest: req.body.BSCTest || 0.02,
						ETH: req.body.ETH || 0.03,
						Ropsten: req.body.Ropsten || 0.005,
						Cronos: req.body.Cronos || 80,
						PulseTest: req.body.PulseTest || 0.1,
						Avalanche: req.body.Avalanche || 0.8,
						AvalancheTest: req.body.AvalancheTest || 0.1,
						Polygon: req.body.Polygon || 30
					}
				});
				newUser.save()
					.then((user) => res.json(user))
					.catch((err) => {
						console.log(err);
						res.status(500).json(err);
					});
			} else {
				// Update existing user
				var netFee = dat.netFeeValueToken || {};

				if (req.body.BSC !== undefined) netFee.BSC = Number(req.body.BSC);
				if (req.body.BSCTest !== undefined) netFee.BSCTest = Number(req.body.BSCTest);
				if (req.body.ETH !== undefined) netFee.ETH = Number(req.body.ETH);
				if (req.body.Ropsten !== undefined) netFee.Ropsten = Number(req.body.Ropsten);
				if (req.body.Cronos !== undefined) netFee.Cronos = Number(req.body.Cronos);
				if (req.body.PulseTest !== undefined) netFee.PulseTest = Number(req.body.PulseTest);
				if (req.body.Avalanche !== undefined) netFee.Avalanche = Number(req.body.Avalanche);
				if (req.body.AvalancheTest !== undefined) netFee.AvalancheTest = Number(req.body.AvalancheTest);
				if (req.body.Polygon !== undefined) netFee.Polygon = Number(req.body.Polygon);

				dat.netFeeValueToken = netFee;
				dat.save()
					.then((user) => res.json(user))
					.catch((err) => {
						console.log(err);
						res.status(500).json(err);
					});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(404).json(err);
		});
});

// @route ---> GET api/auth/getNetFeeValueToken
// @desc  ---> get net fee input
// @access --> Public
router.get('/getNetFeeValueToken', (req, res) => {
	User.findOne()
		.then((dat) => {
			if (dat && dat.netFeeValueToken) {
				res.json(dat.netFeeValueToken);
			} else {
				// Create default user with default fee values if none exists
				const defaultNetFeeValueToken = {
					BSC: 0.15,
					BSCTest: 0.02,
					ETH: 0.03,
					Ropsten: 0.005,
					Cronos: 80,
					PulseTest: 0.1,
					Avalanche: 0.8,
					AvalancheTest: 0.1,
					Polygon: 30
				};

				if (!dat) {
					// Create new user with default values
					const newUser = new User({
						netFeeValueToken: defaultNetFeeValueToken,
						netFeeValueLaunch: {
							BSC: 0.7,
							BSCTest: 0.3,
							ETH: 0.13,
							Ropsten: 0.02,
							Cronos: 800,
							PulseTest: 0.2,
							Avalanche: 8,
							AvalancheTest: 0.3,
							Polygon: 85
						},
						raisedFee: 17
					});

					newUser.save()
						.then(() => res.json(defaultNetFeeValueToken))
						.catch((err) => {
							console.log(err);
							res.json(defaultNetFeeValueToken);
						});
				} else {
					// Update existing user with default fee values
					dat.netFeeValueToken = defaultNetFeeValueToken;
					dat.save()
						.then(() => res.json(defaultNetFeeValueToken))
						.catch((err) => {
							console.log(err);
							res.json(defaultNetFeeValueToken);
						});
				}
			}
		})
		.catch((err) => {
			console.log(err);
			// Return default values even if database error occurs
			res.json({
				BSC: 0.15,
				BSCTest: 0.02,
				ETH: 0.03,
				Ropsten: 0.005,
				Cronos: 80,
				PulseTest: 0.1,
				Avalanche: 0.8,
				AvalancheTest: 0.1,
				Polygon: 30
			});
		});
});

// @route ---> SET api/auth/setNetFeeValueLaunch
// @desc  ---> set net fee input from launch
// @access --> Public
router.post('/setNetFeeValueLaunch', (req, res) => {
	var netFee = {};
	User.findOne()
		.then((dat) => {
			netFee = dat.netFeeValueLaunch;

			if (req.body.BSC !== undefined) netFee.BSC = Number(req.body.BSC);
			if (req.body.BSCTest !== undefined) netFee.BSCTest = Number(req.body.BSCTest);
			if (req.body.ETH !== undefined) netFee.ETH = Number(req.body.ETH);
			if (req.body.Ropsten !== undefined) netFee.Ropsten = Number(req.body.Ropsten);
			if (req.body.Cronos !== undefined) netFee.Cronos = Number(req.body.Cronos);
			if (req.body.PulseTest !== undefined) netFee.PulseTest = Number(req.body.PulseTest);
			if (req.body.Avalanche !== undefined) netFee.Avalanche = Number(req.body.Avalanche);
			if (req.body.Polygon !== undefined) netFee.Polygon = Number(req.body.Polygon);

			dat.netFeeValueLaunch = netFee;

			dat.save().catch((err) => console.log(err));
			res.json(dat);
		})
		.catch((err) => res.status(404).json(err));
});

// @route ---> GET api/auth/getNetFeeValueLaunch
// @desc  ---> get net fee input from launch
// @access --> Public
router.get('/getNetFeeValueLaunch', (req, res) => {
	User.findOne()
		.then((dat) => {
			if (dat && dat.netFeeValueLaunch) {
				res.json(dat.netFeeValueLaunch);
			} else {
				// Return default launch fee values if none exists
				const defaultNetFeeValueLaunch = {
					BSC: 0.7,
					BSCTest: 0.3,
					ETH: 0.13,
					Ropsten: 0.02,
					Cronos: 800,
					PulseTest: 0.2,
					Avalanche: 8,
					AvalancheTest: 0.3,
					Polygon: 85
				};
				res.json(defaultNetFeeValueLaunch);
			}
		})
		.catch((err) => {
			console.log(err);
			// Return default values even if database error occurs
			res.json({
				BSC: 0.7,
				BSCTest: 0.3,
				ETH: 0.13,
				Ropsten: 0.02,
				Cronos: 800,
				PulseTest: 0.2,
				Avalanche: 8,
				AvalancheTest: 0.3,
				Polygon: 85
			});
		});
});

// @route ---> SET api/auth/setRaisedFee
// @desc  ---> set raised Fee
// @access --> Public
router.post('/setRaisedFee', (req, res) => {
	User.findOne()
		.then((dat) => {
			if (req.body.raisedFee !== undefined) dat.raisedFee = Number(req.body.raisedFee);
			dat.save().then(res.json(req.body.raisedFeed)).catch((err) => res.status(404).json(err));
		})
		.catch((err) => res.status(404).json(err));
});

// @route ---> GET api/auth/getRaisedFee
// @desc  ---> get raised Fee
// @access --> Public
router.get('/getRaisedFee', (req, res) => {
	User.findOne()
		.then((dat) => {
			res.json(dat.raisedFee);
		})
		.catch((err) => res.status(404).json(err));
});

// @route ---> GET api/auth/setUserAddress
// @desc  ---> set subscriber address
// @access --> Public
router.post('/setSubscribeAddress', (req, res) => {
	const list = {};
	list.url = req.body.url;

	User.findOne()
		.then((dat) => {
			var data = [...dat.subcriberAddress];
			let buf = data.find((el) => el.url === req.body.url);
			if (buf !== undefined) {
				res.json(buf);
			} else {
				dat.subcriberAddress.push(list);
				dat.save().then((data) => res.json(data)).catch((err) => res.status(400).json(err));
			}
		})
		.catch((err) => res.status(404).json(err));
});

// @route ---> GET api/auth/removeUserAddress
// @desc  ---> remove subscriber address
// @access --> Public
router.post('/removeSubscribeAddress', (req, res) => {
	User.findOne()
		.then((dat) => {
			dat.subcriberAddress = dat.subcriberAddress.filter((exp) => exp.url !== req.body.url);
			dat.save().catch((err) => console.log(err));
			res.json(dat);
		})
		.catch((err) => res.status(404).json(err));
});

module.exports = router;
