import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import classnames from 'classnames';
import isEmpty from '../../validation/isEmpty';
import { IconButton, ButtonToolbar, Checkbox } from 'rsuite';
import PauseIcon from '@rsuite/icons/PagePrevious';
import PlayIcon from '@rsuite/icons/PageNext';
import { setWhiteListData, setReduxValue } from '../../actions/padActions';
import PropTypes from 'prop-types';

var valNetState = '';
class LaunchPad2 extends Component {
	constructor(props) {
		super(props);

		this.changeWhitelise = this.changeWhitelise.bind(this);
		this.nextPage = this.nextPage.bind(this);

		this.state = {
			presaleRate: undefined,
			softCap: undefined,
			hardCap: undefined,
			minBuy: undefined,
			maxBuy: undefined,
			from: '',
			to: '',
			formErrors: {
				presaleRate: '',
				softCap: '',
				hardCap: '',
				minBuy: '',
				maxBuy: '',
				from: '',
				to: '',
				pancakeswapLiquidity: '',
				pancakeswapRate: '',
				pancakeswapLockup: ''
			},
			presaleRateValid: false,
			softCapValid: false,
			hardCapValid: false,
			minBuyValid: false,
			maxBuyValid: false,
			fromValid: false,
			pancakeswapLiquidity: undefined,
			pancakeswapRate: undefined,
			pancakeswapLockup: undefined,
			toValid: false,
			formValid: false,
			isChecked: false
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
		if (e.target.name == 'to' || e.target.name == 'from') {
			const dateX = new Date(e.target.value);
			window.localStorage.setItem(name + 'TS', dateX.getTime() / 1000);
		}
		// window.localStorage.setItem(name, value);
	}

	validateField(fieldName, value) {
		let fieldValidationErrors = this.state.formErrors;

		let presaleRateValid = this.state.presaleRateValid;
		let softCapValid = this.state.softCapValid;
		let hardCapValid = this.state.hardCapValid;
		let minBuyValid = this.state.minBuyValid;
		let maxBuyValid = this.state.maxBuyValid;
		let fromValid = this.state.fromValid;
		let toValid = this.state.toValid;
		let pancakeswapLiquidity = this.state.pancakeswapLiquidity;
		let pancakeswapRate = this.state.pancakeswapRate;
		let pancakeswapLockup = this.state.pancakeswapLockup;

		switch (fieldName) {
			case 'presaleRate':
				presaleRateValid = value > 0;
				fieldValidationErrors.presaleRate = presaleRateValid ? '' : ' is invalid';
				break;
			case 'softCap':
				softCapValid =
					Number(value) >= Number(this.state.hardCap) * 0.4 && Number(value) < Number(this.state.hardCap);
				fieldValidationErrors.softCap = softCapValid ? '' : ' is invalid';
				break;
			case 'hardCap':
				hardCapValid = value > 0;
				fieldValidationErrors.hardCap = hardCapValid ? '' : ' is invalid';
				break;
			case 'minBuy':
				minBuyValid = value > 0;
				fieldValidationErrors.minBuy = minBuyValid ? '' : ' is invalid';
				break;
			case 'maxBuy':
				maxBuyValid = value > 0;
				fieldValidationErrors.maxBuy = maxBuyValid ? '' : ' is invalid';
				break;
			case 'from':
				fromValid = isEmpty(value) ? '' : 'have value';
				fieldValidationErrors.from = fromValid ? '' : 'must have start time.';
				break;
			case 'to':
				toValid = isEmpty(value) ? '' : 'have value';
				fieldValidationErrors.to = toValid ? '' : 'must have end time.';
				fieldValidationErrors.to = this.state.to > this.state.from ? '' : 'end time must be after start time.';
				break;
			case 'pancakeswapLiquidity':
				pancakeswapLiquidity = Number(value) >= 40;
				fieldValidationErrors.pancakeswapLiquidity = pancakeswapLiquidity ? '' : ' is invalid';
				break;
			case 'pancakeswapRate':
				pancakeswapRate = value > 0;
				fieldValidationErrors.pancakeswapRate = pancakeswapRate ? '' : ' is invalid';
				break;
			case 'pancakeswapLockup':
				pancakeswapLockup = value > 0;
				fieldValidationErrors.pancakeswapLockup = pancakeswapLockup ? '' : ' is invalid';
				break;
			default:
				break;
		}
		this.setState(
			{
				formErrors: fieldValidationErrors,
				presaleRateValid: presaleRateValid,
				softCapValid: softCapValid,
				hardCapValid: hardCapValid,
				minBuyValid: minBuyValid,
				maxBuyValid: maxBuyValid,
				fromValid: fromValid,
				toValid: toValid
			},
			this.validateForm
		);
	}

	validateForm() {
		this.setState({
			formValid:
				this.state.presaleRateValid &&
				this.state.softCapValid &&
				this.state.hardCapValid &&
				this.state.minBuyValid &&
				this.state.maxBuyValid
		});
	}

	changeWhitelise() {
		this.setState({
			isChecked: !this.state.isChecked
		});

		const data = {
			whiteListState: this.state.isChecked,
			tokenAddress: window.localStorage.getItem('tokenAddress')
		};
		this.props.setWhiteListData(data);
	}

	nextPage() {
		const data = {
			presaleRate: this.state.presaleRate,
			softCap: this.state.softCap,
			hardCap: this.state.hardCap,
			minBuy: this.state.minBuy,
			maxBuy: this.state.maxBuy,
			from: this.state.from,
			to: this.state.to,
			pancakeswapLiquidity: this.state.pancakeswapLiquidity,
			pancakeswapRate: this.state.pancakeswapRate,
			pancakeswapLockup: this.state.pancakeswapLockup,
			whiteListState: this.state.isChecked
		};

		this.props.setReduxValue(data);
	}

	render() {
		switch (window.localStorage.getItem('chainId')) {
			case '1':
				valNetState = 'ETH';
				break;
			case '3':
				valNetState = 'ETH';
				break;
			case '56':
				valNetState = 'BNB';
				break;
			case '97':
				valNetState = 'tBNB';
				break;
			case '43114':
				valNetState = 'AVAX';
				break;
			case '43113':
				valNetState = 'AVAX';
				break;
			case '941':
				valNetState = 'tPLS';
				break;
			case '25':
				valNetState = 'CRO';
				break;
			case '137':
				valNetState = 'MATIC';
				break;
			default:
				valNetState = 'BNB';
				break;
		}

		return (
			<section className="ant-layout  black-background">
				<main className="ant-layout-content MainLayout_content__2mZF9">
					<div className="py-6 container">
						<div style={{ height: '16px' }} />
						<div className="bg-dark style-border  ant-card ant-card-bordered">
							<div className="ant-card-body">
								<h1 className="socials text-center" style={{ fontSize: '40px' }}>
									Launchpad Info
								</h1>
								<p className="lead text-center" style={{ marginTop: '40px', fontSize: '20px' }}>
									<i>
										Enter the launchpad information that you want to raise , that should be enter
										all details about your presale
									</i>
								</p>

								<form>
									<div className="field">
										<label className="launch-label" htmlFor="presaleRate">
											Presale rate
										</label>
										<div className="control">
											<input
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.presaleRate
												})}
												type="number"
												placeholder="100"
												id="tokenAddress"
												name="presaleRate"
												autoComplete="on"
												value={this.state.presaleRate}
												onChange={(event) => this.handleInput(event)}
											/>
											<div className="invalid-feedback">{this.state.formErrors.presaleRate}</div>

											<p className="help">
												If I spend 1 {valNetState} how many tokens will I receive?
											</p>
										</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="softCap">
											Softcap ({valNetState})
										</label>
										<div className="control">
											<input
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.softCap
												})}
												type="number"
												placeholder="Ex: 10"
												id="tokenAddress"
												name="softCap"
												autoComplete="on"
												value={this.state.softCap}
												onChange={(event) => this.handleInput(event)}
											/>
											<div className="invalid-feedback">{this.state.formErrors.softCap}</div>
											<p className="help">Softcap must be &gt;= 40% of Hardcap!</p>
										</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="hardCap">
											HardCap ({valNetState})
										</label>
										<div className="control">
											<input
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.hardCap
												})}
												type="number"
												placeholder="Ex: 10"
												id="tokenAddress"
												name="hardCap"
												autoComplete="on"
												value={this.state.hardCap}
												onChange={(event) => this.handleInput(event)}
											/>
											<div className="invalid-feedback">{this.state.formErrors.hardCap}</div>
										</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="minBuy">
											Minimum buy ({valNetState})
										</label>
										<div className="control">
											<input
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.minBuy
												})}
												type="number"
												placeholder={valNetState}
												id="tokenAddress"
												name="minBuy"
												autoComplete="on"
												value={this.state.minBuy}
												onChange={(event) => this.handleInput(event)}
											/>
										</div>
										<div className="invalid-feedback">{this.state.formErrors.minBuy}</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="maxBuy">
											Maximum buy ({valNetState})
										</label>
										<div className="control">
											<input
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.maxBuy
												})}
												type="number"
												placeholder={valNetState}
												id="tokenAddress"
												name="maxBuy"
												autoComplete="on"
												value={this.state.maxBuy}
												onChange={(event) => this.handleInput(event)}
											/>
											<div className="invalid-feedback">{this.state.formErrors.maxBuy}</div>
										</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="pancakeswapLiquidity">
											Liquidity (%)
										</label>
										<div className="control">
											<input
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.pancakeswapLiquidity
												})}
												type="number"
												placeholder="Ex:10"
												id="tokenAddress"
												name="pancakeswapLiquidity"
												autoComplete="on"
												value={this.state.pancakeswapLiquidity}
												onChange={(event) => this.handleInput(event)}
											/>
											<div className="invalid-feedback">
												{this.state.formErrors.pancakeswapLiquidity}
											</div>
											<p className="help">Liquidity must be equal to or greater than 40%</p>
										</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="pancakeswapRate">
											Swap Listing Rate
										</label>
										<div className="control">
											<input
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.pancakeswapRate
												})}
												type="number"
												placeholder="Ex:10"
												id="tokenAddress"
												name="pancakeswapRate"
												autoComplete="on"
												value={this.state.pancakeswapRate}
												onChange={(event) => this.handleInput(event)}
											/>
											<div className="invalid-feedback">
												{this.state.formErrors.pancakeswapRate}
											</div>
										</div>
									</div>

									<div className="field">
										<label className="launch-label" htmlFor="pancakeswapLockup">
											Presale Token Lockup (minutes)
										</label>
										<div className="control">
											<input
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.pancakeswapLockup
												})}
												type="number"
												placeholder="Ex:10"
												id="tokenAddress"
												name="pancakeswapLockup"
												autoComplete="on"
												value={this.state.pancakeswapLockup}
												onChange={(event) => this.handleInput(event)}
											/>
											<div className="invalid-feedback">
												{this.state.formErrors.pancakeswapLockup}
											</div>
										</div>
									</div>

									<Checkbox
										className="launch-label"
										style={{ marginTop: '70px', marginLeft: '-45%' }}
										defaultChecked={this.state.isChecked}
										onChange={this.changeWhitelise}
									>
										Whitelist
									</Checkbox>

									<div className="field" style={{ marginTop: '70px' }}>
										<label className="launch-label" htmlFor="startTime">
											Start time (Your Local Time)
										</label>
										<div>
											<input
												id="launch-month"
												type="datetime-local"
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.from
												})}
												name="from"
												value={this.state.from}
												onChange={(event) => this.handleInput(event)}
											/>
											<div className="invalid-feedback">{this.state.formErrors.from}</div>
										</div>
									</div>
									<div className="field" style={{ marginTop: '70px' }}>
										<label className="launch-label" htmlFor="endTime">
											End time (Your Local Time)
										</label>
										<div>
											<input
												id="launch-month"
												className={classnames('form-control form-control-lg', {
													'is-invalid': this.state.formErrors.to
												})}
												name="to"
												type="datetime-local"
												value={this.state.to}
												onChange={(event) => this.handleInput(event)}
											/>
											<div className="invalid-feedback">{this.state.formErrors.to}</div>
										</div>
									</div>
									<div className="has-text-centered">
										<div className="has-text-info p-4">
											Need {this.state.hardCap * this.state.presaleRate}{' '}
											{window.localStorage.getItem('tokenSymbol')} to create launchpad.
										</div>
										<ButtonToolbar>
											<Link to="/LaunchPad1">
												<IconButton
													icon={<PauseIcon className="icon" />}
													placement="left"
													id="launch-tool-button"
												>
													<strong>Back</strong>
												</IconButton>
											</Link>
											<Link to={this.state.formValid ? '/LaunchPad3' : '#'}>
												<IconButton
													disabled={!this.state.formValid}
													icon={<PlayIcon className="icon" />}
													placement="right"
													id="launch-tool-button"
													onClick={this.nextPage}
												>
													<strong>Next</strong>
												</IconButton>
											</Link>
										</ButtonToolbar>
									</div>
								</form>
							</div>
						</div>
					</div>
				</main>
			</section>
		);
	}
}

LaunchPad2.propTypes = {
	tokenAddress: PropTypes.object.isRequired,
	setWhiteListData: PropTypes.func.isRequired,
	setReduxValue: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
	return {
		tokenAddress: state.verify.tokenAddress
	};
};

export default connect(mapStateToProps, { setWhiteListData, setReduxValue })(LaunchPad2);


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
