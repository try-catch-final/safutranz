import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';

var buffer = {};
var alarmValue = [];

class Pads extends Component {
	componentDidMount() {
		window.scrollTo(0, 0);
	}
	render() {
		const { pads } = this.props;
		const test = this.props.alarm;

		return pads.map((pad) => {
			if (test !== null) {
				alarmValue = test.alarmValue;
				buffer = alarmValue.find((e) => e.tokenAddress === pad.tokenAddress);
			}
			return (
				<Card
					presaleAddress={pad.presaleAddress}
					tokenAddress={pad.tokenAddress}
					title={pad.title}
					symbol={pad.symbol}
					decimal={pad.decimal}
					total={pad.total}
					rate={pad.rate}
					softCap={pad.softCap}
					hardCap={pad.hardCap}
					minBuy={pad.minBuy}
					maxBuy={pad.maxBuy}
					from={pad.from}
					to={pad.to}
					whiteListState={pad.whiteListState}
					whitelist={pad.whitelist}
					user={pad.user}
					chainID={pad.chainID}
					chainName={pad.chainName}
					logoUrl={pad.logoUrl}
					website={pad.website}
					facebook={pad.facebook}
					twitter={pad.twitter}
					github={pad.github}
					telegram={pad.telegram}
					instagram={pad.instagram}
					discord={pad.discord}
					reddit={pad.reddit}
					description={pad.description}
					saleCount={pad.saleCount}
					kycState={pad.kycState}
					auditState={pad.auditState}
					safuState={pad.safuState}
					premium={pad.premium}
					privateSale={pad.privateSale}
					presaleState={pad.presaleState}
					pancakeswapLiquidity={pad.pancakeswapLiquidity}
					pancakeswapRate={pad.pancakeswapRate}
					pancakeswapLockup={pad.pancakeswapLockup}
					withDrawBtnName={pad.withDrawBtnName}
					withDrawBtnToken={pad.withDrawBtnToken}
					finalizeBtn={pad.finalizeBtn}
					FairState={pad.FairState}
					favorite={pad.favorite}
					startAlarmState={buffer ? buffer.startAlarmState : false}
					startAlarmTime5={buffer ? buffer.startAlarmTime5 : false}
					startAlarmTime15={buffer ? buffer.startAlarmTime15 : false}
					startAlarmTime30={buffer ? buffer.startAlarmTime30 : false}
					endAlarmState={buffer ? buffer.endAlarmState : false}
					endAlarmTime5={buffer ? buffer.endAlarmTime5 : false}
					endAlarmTime15={buffer ? buffer.endAlarmTime15 : false}
					endAlarmTime30={buffer ? buffer.endAlarmTime30 : false}
				/>
			);
		});
	}
}

Pads.propTypes = {
	pads: PropTypes.array.isRequired,
	alarm: PropTypes.object.isRequired
};

export default Pads;


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
