import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userLogin } from '../../actions/authActions';
import { useNavigate } from 'react-router-dom';
import TextInput from '../common/TextInput.jsx';
import PropTypes from 'prop-types';

// Wrapper component to provide navigation
const LoginWithNavigation = (props) => {
	const navigate = useNavigate();
	return <Login {...props} navigate={navigate} />;
};

export class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.onLogin = this.onLogin.bind(this);
	}

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.navigate('/authSetting');
		}
		window.scrollTo(0, 0);
	}

	componentDidUpdate(prevProps) {
		if (this.props.auth.isAuthenticated && !prevProps.auth.isAuthenticated) {
			this.props.navigate('/authSetting');
		}
		if (this.props.errors !== prevProps.errors) {
			this.setState({ errors: this.props.errors });
		}
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	onLogin = (e) => {
		e.preventDefault();
		const { password } = this.state;
		const userData = {
			password
		};
		console.log('login');
		this.props.userLogin(userData);
	};

	render() {
		const { errors } = this.state;
		return (
			<div className="py-6 container">
				<div style={{ height: '16px' }} />

				<div className="bg-dark  style-border ant-card ant-card-bordered">
					<form className="form" onSubmit={this.onLogin}>
						<div className="ant-card-body" id="createToken">
							<h1 className="socials text-center" style={{ fontSize: '40px' }}>
								Log In
							</h1>
							<br />
							<div className="form-group" style={{ marginTop: '80px' }}>
								<TextInput
									type="password"
									error={errors.password}
									placeholder="Password"
									name="password"
									value={this.state.password}
									onChange={this.onChange}
								/>
							</div>
						</div>
						<input
							type="submit"
							className="launch-button"
							value="Login"
							style={{ marginTop: '80px', border: 'solid 2px darkgoldenrod' }}
						/>
					</form>
				</div>
			</div>
		);
	}
}

Login.propTypes = {
	userLogin: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	navigate: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
		errors: state.errors
	};
};

export default connect(mapStateToProps, { userLogin })(LoginWithNavigation);
