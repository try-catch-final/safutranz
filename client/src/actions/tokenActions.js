import axios from 'axios';
import Web3 from 'web3';

import { GET_TOKEN, TOKEN_LOADING, SET_TOKEN, TOKEN_SIGN_DATA } from './types';

export const getTokenCurrent = () => (dispatch) => {
	dispatch(setTokenLoading());
	//   axios
	//     .get(`/api/getTokenContract`)
	//     .then(async (res) => {
	//       const bytecode = res.data.evm.bytecode.object;
	//       const abi = res.data.abi;
	//       const chainID = signer.provider._network.chainId; // TODO

	//       const web3 = new Web3(Web3.givenProvider);
	//       const deploy_contract = new web3.eth.Contract(abi);

	//       let payload = {
	//         data: "0x" + bytecode,
	//         arguments: [tokenName, symbol, decimals, totalSupply],
	//       };

	//       let parameter = {
	//         from: userAddress,
	//         gas: web3.utils.toHex(5000000),
	//         value: web3.utils.toWei("0.05", "ether"),
	//         gasPrice: web3.utils.toHex(web3.utils.toWei("50", "gwei")),
	//       };

	//       console.log(parameter);

	//       deploy_contract
	//         .deploy(payload)
	//         .send(parameter, (err, transactionHash) => {
	//           console.log("Transaction Hash :", transactionHash);
	//         })
	//         .on("confirmation", () => {})
	//         .then((newContractInstance) => {
	//           // console.log(newContractInstance);
	//           console.log(
	//             "Deployed Contract Address : ",
	//             newContractInstance.options.address
	//           );
	//           this.setState({
	//             tokenAddress: newContractInstance.options.address,
	//           });
	//           window.localStorage.setItem(
	//             "tokenAddress",
	//             newContractInstance.options.address
	//           );
	//           axios
	//             .post(`/api/addTokenAddress`, {
	//               userAddress: userAddress,
	//               tokenAddress: newContractInstance.options.address,
	//               chainID: chainID,
	//             })
	//             .then(() => {
	//               console.log("success");
	//               window.location.href = `/TokenRes`;
	//             })
	//             .catch((err) => console.log(err));
	//         });
	//     })
	//     .catch((err) => console.log(err));
};

export const getUserToken = (data) => (dispatch) => {
	console.log(data);
	dispatch({
		type: TOKEN_SIGN_DATA,
		payload: data
	});
};

export const setTokenLoading = () => {
	return {
		type: TOKEN_LOADING
	};
};


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
