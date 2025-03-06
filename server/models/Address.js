const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
	userAddress: {
		type: String,
		required: true
	},
	tokenAddress: {
		type: String
	},
	tokenName: {
		type: String
	},
	tokenSymbol: {
		type: String
	},
	tokenDecimal: {
		type: Number
	},
	tokenSupply: {
		type: Number
	},
	chainID: {
		type: Number
	},
	launchpadAddress: {
		type: String
	},
	logoUrl: {
		type: String
	},
	website: {
		type: String
	},
	facebook: {
		type: String
	},
	twitter: {
		type: String
	},
	github: {
		type: String
	},
	telegram: {
		type: String
	},
	instagram: {
		type: String
	},
	discord: {
		type: String
	},
	reddit: {
		type: String
	},
	youtube: {
		type: String
	},
	bannel: {
		type: String
	},
	description: {
		type: String
	},
	whiteListState: {
		type: Boolean
	},
	whiteList: [
		{
			whiteListAddress: {
				type: String
			}
		}
	],

	presaleRate: {
		type: String
	},
	presaleState: {
		type: String
	},
	saleCount: {
		type: Number,
		default: 0
	},
	minBuy: {
		type: String,
		default: '0'
	},
	maxBuy: {
		type: String,
		default: '0'
	},
	softCap: {
		type: String,
		default: '0'
	},
	hardCap: {
		type: String,
		default: '0'
	},
	from: {
		type: Date
	},
	to: {
		type: Date
	},
	kycState: {
		type: Boolean,
		default: false
	},
	auditState: {
		type: Boolean,
		default: false
	},
	safuState: {
		type: Boolean,
		default: false
	},
	premium: {
		type: Boolean,
		default: false
	},
	privateSale: {
		type: Boolean,
		default: false
	},
	pancakeswapLiquidity: {
		type: String
	},
	pancakeswapRate: {
		type: String
	},
	pancakeswapLockup: {
		type: String
	},
	withDrawBtnName: {
		type: Boolean,
		default: false
	},
	withDrawBtnToken: {
		type: Boolean,
		default: false
	},
	finalizeBtn: {
		type: Boolean,
		default: false
	},
	lockTimeState: {
		type: Boolean,
		default: false
	},
	ownerWithDrawBtn: {
		type: Boolean,
		default: false
	},
	lockTime: {
		type: Date,
		default: Date.now
	},
	FairState: {
		type: Boolean,
		default: false
	},
	advertise: {
		type: Boolean,
		default: false
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Address = mongoose.model('launchpad', AddressSchema);


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
