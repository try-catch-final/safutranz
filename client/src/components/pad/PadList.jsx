import React, { Component } from 'react';
import Pads from './Pads.jsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPads } from '../../actions/padActions';
import { setAlaramData, getAlaramData } from '../../actions/alarmActions';
import { FlexboxGrid, Col, Row } from 'rsuite';
import SearchInput, { createFilter } from 'react-search-input';
import Spinner from '../common/Spinner.jsx';
import launchHeaderImg from '../assets/img/back/lauchpad-img.jfif';
import roketImg from '../assets/img/back/roket.jpg';
import '../assets/css/dashboard.css';

const KEYS_TO_FILTERS = ['title', 'symbol'];
var items = [];

class PadList extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.onChange = this.onChange.bind(this);
		this.state = {
			kycState: false,
			adtState: false,
			safuState: false,
			prmState: false,
			pvtState: false,
			whiteListState: false,
			currentState: false,
			searchTerm: '',
			isInitialLoad: true
		};
		this.intervalId = null;
	}

	onChange(e) {
		if (e.target.value === 'All status') {
			this.setState({
				kycState: false,
				adtState: false,
				safuState: false,
				prmState: false,
				pvtState: false,
				whiteListState: false,
				currentState: false
			});
		} else {
			this.setState({ [e.target.value]: true });
		}
	}

	componentDidMount() {
		window.scrollTo(0, 0);

		// Initial load
		this.props.getPads();
		this.props.getAlaramData({ userAddress: localStorage.getItem('userAddress') });

		// Set up interval for periodic updates (every 2 minutes instead of 30 seconds)
		// This reduces server load and prevents unnecessary reloads
		this.intervalId = setInterval(() => {
			// Only update if the component is still mounted and visible
			if (document.visibilityState === 'visible') {
				this.props.getPads();
				this.props.getAlaramData({ userAddress: localStorage.getItem('userAddress') });
			}
		}, 120000); // 2 minutes instead of 30 seconds

		// Add visibility change listener to pause polling when tab is not visible
		this.handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				// Refresh data when tab becomes visible again
				this.props.getPads();
				this.props.getAlaramData({ userAddress: localStorage.getItem('userAddress') });
			}
		};
		document.addEventListener('visibilitychange', this.handleVisibilityChange);

		// Mark initial load as complete after a short delay
		setTimeout(() => {
			this.setState({ isInitialLoad: false });
		}, 5000);
	}

	componentWillUnmount() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
		if (this.handleVisibilityChange) {
			document.removeEventListener('visibilitychange', this.handleVisibilityChange);
		}
	}

	handleChange = (event) => {
		this.setState({
			searchTerm: event
		});
	};

	render() {
		const { pads, loading } = this.props.pad;
		const { alarmData } = this.props.alarm;
		var buffer = [];
		let postContent;

		items = pads || [];

		// Show loading state during initial load or when actively loading
		if ((loading && this.state.isInitialLoad) || (loading && items.length === 0)) {
			postContent = (
				<div className="loading-container">
					<div className="loading-spinner"></div>
					<h3 style={{ color: '#fff', marginBottom: '10px', fontSize: '24px' }}>Loading Presales...</h3>
					<p style={{ color: '#ccc', fontSize: '16px', margin: '0' }}>
						Fetching the latest presale opportunities for you
					</p>
				</div>
			);
		} else if (items.length > 0) {
			const alarmValue = alarmData?.data || [];
			const filteredItems = items.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));

			if (
				this.state.kycState ||
				this.state.adtState ||
				this.state.whiteListState ||
				this.state.safuState ||
				this.state.prmState ||
				this.state.pvtState ||
				this.state.currentState
			) {
				// Reset buffer for each render
				buffer = [];
				filteredItems.forEach((item) => {
					if (
						(this.state.kycState && item.kycState) ||
						(this.state.adtState && item.auditState) ||
						(this.state.whiteListState && item.whiteListState) ||
						(this.state.safuState && item.safuState) ||
						(this.state.prmState && item.premium) ||
						(this.state.pvtState && item.privateSale) ||
						(this.state.currentState && Number(item.user) === Number(window.localStorage.getItem('userAddress')))
					) {
						buffer.push(item);
					}
				});

				postContent = buffer.length > 0 ? (
					<Pads pads={buffer} alarm={alarmValue} />
				) : (
					<div className="no-data-container" style={{ border: '2px solid #ffc107' }}>
						<div style={{
							fontSize: '48px',
							color: '#ffc107',
							marginBottom: '20px'
						}}>🔍</div>
						<h3 style={{ color: '#fff', marginBottom: '10px', fontSize: '24px' }}>No Matching Presales</h3>
						<p style={{ color: '#ccc', fontSize: '16px', margin: '0' }}>
							No presales match your current filter criteria. Try adjusting your filters.
						</p>
					</div>
				);
			} else {
				postContent = filteredItems.length > 0 ? (
					<Pads pads={filteredItems} alarm={alarmValue} />
				) : (
					<div className="no-data-container" style={{ border: '2px solid #ffc107' }}>
						<div style={{
							fontSize: '48px',
							color: '#ffc107',
							marginBottom: '20px'
						}}>🔍</div>
						<h3 style={{ color: '#fff', marginBottom: '10px', fontSize: '24px' }}>No Results Found</h3>
						<p style={{ color: '#ccc', fontSize: '16px', margin: '0' }}>
							No presales match your search term. Try a different search.
						</p>
					</div>
				);
			}
		} else {
			// No pads available and not loading
			postContent = (
				<div className="no-data-container" style={{ border: '2px solid #6c757d' }}>
					<div style={{
						fontSize: '48px',
						color: '#6c757d',
						marginBottom: '20px'
					}}>📭</div>
					<h3 style={{ color: '#fff', marginBottom: '10px', fontSize: '24px' }}>No Presales Available</h3>
					<p style={{ color: '#ccc', fontSize: '16px', margin: '0' }}>
						There are currently no presales available. Check back later!
					</p>
				</div>
			);
		}

		return (
			<section className="pt-4">
				<div className="pad-list-main">
					<img
						src={launchHeaderImg}
						alt="launch header image"
						style={{
							width: '100%',
							maxWidth: '800px',
							height: '20rem',
							borderRadius: '1rem',
							objectFit: 'cover'
						}}
					/>
					<div className="bg-dark p-4 p-lg-5  white-font rounded-3 text-center">
						<div className="m-4 m-lg-5 ">
							<div className="lead2">
								<div
									className=" fw-bold"
									style={{ fontSize: '45px', marginBottom: '20px', marginTop: '100px' }}
								>
									CURRENT PRESALE
								</div>

								<p className="fs-4 socials" style={{ fontSize: '20px' }}>
									Presale Are Usually Sold In A Separate Allocation Of Sit
								</p>

								<img
									src={roketImg}
									alt="roket image"
									style={{
										width: '200px',
										height: '200px',
										marginTop: '60px',
										maxWidth: '100%',
										objectFit: 'contain'
									}}
								/>
							</div>

							<div className="input-group mb-3" style={{ marginTop: '50px', marginBottom: '180px' }}>
								<Row>
									<Col md={14} xs={24}>
										<SearchInput
											className="search-input"
											placeholder="Enter token name or token symbol."
											value={this.state.searchTerm}
											onChange={this.handleChange}
										/>
									</Col>
									<Col md={6} xs={24}>
										<button className="list-button-left">My Contribute</button>
										<button className="list-button-right">My Favorite</button>
									</Col>
									<Col md={4} xs={24}>
										<select id="state" className="padlist-select" onChange={this.onChange}>
											<option value="All status">All Status</option>
											<option value="kycState">KYC</option>
											<option value="adtState">ADT</option>
											<option value="whiteListState">WHT</option>
											<option value="safuState">SAFU</option>
											<option value="pvtState">PVT</option>
											<option value="prmState">PRM</option>
										</select>
									</Col>
								</Row>
							</div>
						</div>
					</div>
				</div>
				<FlexboxGrid justify="space-around">{postContent}</FlexboxGrid>
			</section>
		);
	}
}

PadList.propTypes = {
	getPads: PropTypes.func.isRequired,
	pad: PropTypes.object.isRequired,
	alarm: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	pad: state.pad,
	alarm: state.alarm
});

export default connect(mapStateToProps, { getPads, setAlaramData, getAlaramData })(PadList);


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
