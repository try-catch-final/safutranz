import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import classnames from 'classnames';
import isEmpty from '../../validation/isEmpty';
import { IconButton, ButtonToolbar } from 'rsuite';
import PauseIcon from '@rsuite/icons/PagePrevious';
import PlayIcon from '@rsuite/icons/PageNext';
import { setReduxValue1 } from '../../actions/padActions';
import PropTypes from 'prop-types';

class LaunchPad3 extends Component {
	constructor(props) {
		super(props);

		this.nextPage = this.nextPage.bind(this);
		this.state = {
			logoUrl: '',
			website: '',

			formErrors: { logoUrl: '', website: '' },
			logoUrlValid: false,
			websiteValid: false,
			formValid: false
		};
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}
	handleInput(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value }, () => {
			this.validateField(name, value);
		});
		// window.localStorage.setItem(name, value);
	}

	validateField(fieldName, value) {
		let fieldValidationErrors = this.state.formErrors;
		let logoUrlValid = this.state.logoUrlValid;
		let websiteValid = this.state.websiteValid;

		switch (fieldName) {
			case 'logoUrl':
				logoUrlValid = isEmpty(value) ? '' : 'have url';
				fieldValidationErrors.logoUrl = logoUrlValid ? '' : ' must input logo url.';
				logoUrlValid = value.match(/^((http|https):\/\/)/);
				fieldValidationErrors.logoUrl = logoUrlValid ? '' : ' is invalid';
				break;
			case 'website':
				websiteValid = isEmpty(value) ? '' : 'have url';
				logoUrlValid = value.match(/^((http|https):\/\/)/);
				fieldValidationErrors.website = websiteValid ? '' : 'must input website url.';
				break;
			default:
				break;
		}
		this.setState(
			{
				formErrors: fieldValidationErrors,
				logoUrlValid: logoUrlValid,
				websiteValid: websiteValid
			},
			this.validateForm
		);
	}

	validateForm() {
		this.setState({
			formValid: this.state.logoUrlValid && this.state.websiteValid
		});
	}

	nextPage() {
		const data = {
			logoUrl: this.state.logoUrl,
			website: this.state.website,
			facebook: this.state.facebook,
			twitter: this.state.twitter,
			github: this.state.github,
			telegram: this.state.telegram,
			instagram: this.state.instagram,
			discord: this.state.discord,
			reddit: this.state.reddit,
			description: this.state.description
		};

		this.props.setReduxValue1(data);
	}

	render() {
		return (
			<section className="ant-layout black-background">
				<main className="ant-layout-content MainLayout_content__2mZF9">
					<div className="py-6 container">
						<div style={{ height: '16px' }} />

						<div className="bg-dark style-border ant-card ant-card-bordered">
							<div className="ant-card-body">
								<h1 className="socials text-center" style={{ fontSize: '50px' }}>
									Additional Info
								</h1>
								<p className="lead text-center">
									<i style={{ fontSize: '20px', marginTop: '70px' }}>Let people know who you are</i>
								</p>
								<form>
									<div className="field">
										<label className="launch-label" htmlFor="logoUrl">
											Logo URL<sup className="has-text-danger">*</sup>
										</label>
										<div className="form-group">
											<input
												value={this.state.logoUrl}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.logoUrl
												})}
												type="text"
												placeholder="Ex: https://..."
												id="tokenAddress"
												name="logoUrl"
												autoComplete="off"
											/>

											<div className="invalid-feedback">{this.state.formErrors.logoUrl}</div>
											<p className="help is-info">
												URL must end with a supported image extension png, jpg, jpeg or gif.{' '}
											</p>
										</div>
									</div>
									<div className="field">
										<label className="launch-label" htmlFor="website">
											Website<sup className="has-text-danger">*</sup>
										</label>
										<div className="form-group">
											<input
												value={this.state.website}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.website
												})}
												type="text"
												placeholder="Ex: https://..."
												id="tokenAddress"
												name="website"
												autoComplete="off"
											/>

											<div className="invalid-feedback">{this.state.formErrors.website}</div>
										</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="facebook">
											Facebook
										</label>
										<div className="form-group">
											<input
												value={this.state.facebook}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.facebook
												})}
												type="text"
												placeholder="Ex: https://facebook.com/..."
												id="tokenAddress"
												name="facebook"
												autoComplete="off"
											/>
										</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="twitter">
											Twitter
										</label>
										<div className="form-group">
											<input
												value={this.state.twitter}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.twitter
												})}
												type="text"
												placeholder="Ex: https://twitter.com/..."
												id="tokenAddress"
												name="twitter"
												autoComplete="off"
											/>
										</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="github">
											Github
										</label>
										<div className="form-group">
											<input
												value={this.state.github}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.github
												})}
												type="text"
												placeholder="Ex: https://github.com/..."
												id="tokenAddress"
												name="github"
												autoComplete="off"
											/>
										</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="telegram">
											Telegram
										</label>
										<div className="form-group">
											<input
												value={this.state.telegram}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.telegram
												})}
												type="text"
												placeholder="Ex: https://t.me/..."
												id="tokenAddress"
												name="telegram"
												autoComplete="off"
											/>
										</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="instagram">
											Instagram
										</label>
										<div className="form-group">
											<input
												value={this.state.instagram}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.instagram
												})}
												type="text"
												placeholder="Ex: https://instagram.com/..."
												id="tokenAddress"
												name="instagram"
												autoComplete="off"
											/>
										</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="discord">
											Discord
										</label>
										<div className="form-group">
											<input
												value={this.state.discord}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.discord
												})}
												type="text"
												placeholder="Ex: https://t.me/..."
												id="tokenAddress"
												name="discord"
												autoComplete="off"
											/>
										</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="reddit">
											Reddit
										</label>
										<div className="form-group">
											<input
												value={this.state.reddit}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.reddit
												})}
												type="text"
												placeholder="Ex: https://reddit.com/..."
												id="tokenAddress"
												name="reddit"
												autoComplete="off"
											/>
										</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="description">
											Description
										</label>
										<div className="form-group">
											<textarea
												value={this.state.description}
												onChange={(event) => this.handleInput(event)}
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.descrition
												})}
												type="text"
												placeholder="Ex: This is the best project..."
												id="description"
												name="description"
											/>
										</div>
									</div>
									<p className="has-text-primary is-size-5">(*) is required field.</p>
									<ButtonToolbar>
										<Link to="/LaunchPad2">
											<IconButton
												icon={<PauseIcon className="icon" />}
												placement="left"
												id="launch-tool-button"
											>
												<strong>Back</strong>
											</IconButton>
										</Link>
										<Link to={this.state.formValid ? '/LaunchPad4' : '#'}>
											<IconButton
												icon={<PlayIcon className="icon" />}
												placement="right"
												id="launch-tool-button"
												onClick={this.nextPage}
											>
												<strong>Next</strong>
											</IconButton>
										</Link>
									</ButtonToolbar>
								</form>
							</div>
						</div>
					</div>
				</main>
			</section>
		);
	}
}
LaunchPad3.propTypes = {
	// profile: PropTypes.object.isRequired,
	// errors: PropTypes.object.isRequired
	setReduxValue1: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	//
});

export default connect(mapStateToProps, { setReduxValue1 })(withRouter(LaunchPad3));


// Enhanced functionality added in update
const enhancedFeatures = {
    analytics: {
        trackEvent: (eventName, properties = {}) => {
            console.log(`Tracking event: ${eventName}`, properties);
        },
        
        trackPageView: (pageName) => {
            console.log(`Page view: ${pageName}`);
        },
        
        trackUserAction: (action, category = 'user') => {
            console.log(`User action: ${action} in category: ${category}`);
        }
    },
    
    performance: {
        measureExecutionTime: (fn, name = 'operation') => {
            return async (...args) => {
                const start = performance.now();
                const result = await fn(...args);
                const end = performance.now();
                console.log(`${name} took ${end - start} milliseconds`);
                return result;
            };
        },
        
        debounce: (func, wait, immediate = false) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func(...args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func(...args);
            };
        },
        
        throttle: (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    },
    
    security: {
        sanitizeInput: (input) => {
            if (typeof input !== 'string') return input;
            return input
                .replace(/[<>]/g, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+=/gi, '')
                .trim();
        },
        
        validateEmail: (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        generateSecureToken: (length = 32) => {
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            return result;
        }
    },
    
    storage: {
        setItem: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                return false;
            }
        },
        
        getItem: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                return defaultValue;
            }
        },
        
        removeItem: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing from localStorage:', error);
                return false;
            }
        }
    },
    
    api: {
        createHttpClient: (baseURL, defaultHeaders = {}) => {
            return {
                get: async (url, options = {}) => {
                    const response = await fetch(`${baseURL}${url}`, {
                        method: 'GET',
                        headers: { ...defaultHeaders, ...options.headers },
                        ...options
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    return response.json();
                },
                
                post: async (url, data, options = {}) => {
                    const response = await fetch(`${baseURL}${url}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...defaultHeaders,
                            ...options.headers
                        },
                        body: JSON.stringify(data),
                        ...options
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    return response.json();
                },
                
                put: async (url, data, options = {}) => {
                    const response = await fetch(`${baseURL}${url}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            ...defaultHeaders,
                            ...options.headers
                        },
                        body: JSON.stringify(data),
                        ...options
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    return response.json();
                },
                
                delete: async (url, options = {}) => {
                    const response = await fetch(`${baseURL}${url}`, {
                        method: 'DELETE',
                        headers: { ...defaultHeaders, ...options.headers },
                        ...options
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    return response.json();
                }
            };
        },
        
        handleApiError: (error) => {
            console.error('API Error:', error);
            
            if (error.response) {
                return {
                    message: error.response.data?.message || 'Server error',
                    status: error.response.status,
                    data: error.response.data
                };
            } else if (error.request) {
                return {
                    message: 'Network error - please check your connection',
                    status: 0,
                    data: null
                };
            } else {
                return {
                    message: error.message || 'An unexpected error occurred',
                    status: -1,
                    data: null
                };
            }
        }
    }
};

// Export enhanced features
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ...module.exports, enhancedFeatures };
} else if (typeof window !== 'undefined') {
    window.enhancedFeatures = enhancedFeatures;
}
