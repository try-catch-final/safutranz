import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { adminAddress, authAddress } from '../../config';

const PrivateRouter = ({ children, auth }) => {
	// Check if user is authenticated and has proper address
	const isAuthorized = auth.isAuthenticated === true &&
		(Number(authAddress) === Number(window.localStorage.getItem('userAddress')) ||
			Number(adminAddress) === Number(window.localStorage.getItem('userAddress')));

	if (isAuthorized) {
		return children;
	} else {
		return <Navigate to="/login" replace />;
	}
};

PrivateRouter.propTypes = {
	children: PropTypes.node.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps)(PrivateRouter);
