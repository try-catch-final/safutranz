const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
	let errors = {};

	data.nPassword = !isEmpty(data.nPassword) ? data.nPassword : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.password2 = !isEmpty(data.password2) ? data.password2 : '';

	if (isEmpty(data.nPassword)) {
		errors.nPassword = 'Now password field is required';
	}

	if (isEmpty(data.password)) {
		errors.password = 'Password field is required';
	}
	if (
		!Validator.isLength(data.password, {
			min: 6,
			max: 50
		})
	) {
		errors.password = 'Password must be atleast 6 characters';
	}
	if (isEmpty(data.password2)) {
		errors.password2 = ' Confirm Password field is required';
	}
	if (!Validator.equals(data.password, data.password2)) {
		errors.password2 = ' Password must match';
	}
	return {
		errors,
		isValid: isEmpty(errors)
	};
};
