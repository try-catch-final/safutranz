import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { setCurrentUser, logoutUser } from './authActions';

// Action Types
export const WALLET_CONNECT_REQUEST = 'WALLET_CONNECT_REQUEST';
export const WALLET_CONNECT_SUCCESS = 'WALLET_CONNECT_SUCCESS';
export const WALLET_CONNECT_FAILURE = 'WALLET_CONNECT_FAILURE';
export const WALLET_DISCONNECT = 'WALLET_DISCONNECT';
export const WALLET_SIGNATURE_REQUEST = 'WALLET_SIGNATURE_REQUEST';
export const WALLET_SIGNATURE_SUCCESS = 'WALLET_SIGNATURE_SUCCESS';
export const WALLET_SIGNATURE_FAILURE = 'WALLET_SIGNATURE_FAILURE';

// Action Creators
export const walletConnectRequest = () => ({
    type: WALLET_CONNECT_REQUEST
});

export const walletConnectSuccess = (walletData) => ({
    type: WALLET_CONNECT_SUCCESS,
    payload: walletData
});

export const walletConnectFailure = (error) => ({
    type: WALLET_CONNECT_FAILURE,
    payload: error
});

export const walletDisconnect = () => ({
    type: WALLET_DISCONNECT
});

export const walletSignatureRequest = () => ({
    type: WALLET_SIGNATURE_REQUEST
});

export const walletSignatureSuccess = (signatureData) => ({
    type: WALLET_SIGNATURE_SUCCESS,
    payload: signatureData
});

export const walletSignatureFailure = (error) => ({
    type: WALLET_SIGNATURE_FAILURE,
    payload: error
});

// Thunk Actions
export const connectWallet = (walletData) => async (dispatch) => {
    dispatch(walletConnectRequest());

    try {
        const { walletAddress, chainId, walletType } = walletData;

        // Store wallet info in localStorage
        localStorage.setItem('walletAddress', walletAddress);
        localStorage.setItem('chainId', chainId);
        localStorage.setItem('walletType', walletType);

        dispatch(walletConnectSuccess({ walletAddress, chainId, walletType }));

        // Check if user exists in backend
        await dispatch(checkWalletUser(walletAddress));

    } catch (error) {
        dispatch(walletConnectFailure(error.message));
    }
};

export const checkWalletUser = (walletAddress) => async (dispatch) => {
    try {
        const response = await axios.get(`/api/auth/wallet/${walletAddress}`);

        if (response.data.exists) {
            // User exists, proceed with signature verification
            await dispatch(verifyWalletSignature(walletAddress));
        } else {
            // User doesn't exist, create new user
            await dispatch(createWalletUser(walletAddress));
        }
    } catch (error) {
        // If user doesn't exist, create new user
        if (error.response && error.response.status === 404) {
            await dispatch(createWalletUser(walletAddress));
        } else {
            throw error;
        }
    }
};

export const createWalletUser = (walletAddress) => async (dispatch) => {
    try {
        const response = await axios.post('/api/auth/wallet/register', {
            walletAddress,
            walletType: localStorage.getItem('walletType') || 'MetaMask'
        });

        if (response.data.success) {
            // User created successfully, proceed with signature verification
            await dispatch(verifyWalletSignature(walletAddress));
        }
    } catch (error) {
        throw new Error('Failed to create wallet user');
    }
};

export const verifyWalletSignature = (walletAddress) => async (dispatch) => {
    dispatch(walletSignatureRequest());

    try {
        // Get nonce from backend
        const nonceResponse = await axios.get(`/api/auth/wallet/nonce/${walletAddress}`);
        const nonce = nonceResponse.data.nonce;

        // Create message to sign
        const message = `Login to SafuTranz\n\nNonce: ${nonce}\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`;

        // Request signature from wallet
        if (!window.ethereum) {
            throw new Error('No wallet provider found');
        }

        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, walletAddress]
        });

        // Verify signature with backend
        const verifyResponse = await axios.post('/api/auth/wallet/verify', {
            walletAddress,
            signature,
            message,
            nonce
        });

        if (verifyResponse.data.success) {
            const { token } = verifyResponse.data;

            // Set auth token
            localStorage.setItem('jwtToken', token);
            setAuthToken(token);

            // Decode token and set current user
            const decoded = jwtDecode(token);
            dispatch(setCurrentUser(decoded));

            dispatch(walletSignatureSuccess({ signature, token }));
        } else {
            throw new Error('Signature verification failed');
        }

    } catch (error) {
        dispatch(walletSignatureFailure(error.message));
    }
};

export const disconnectWallet = () => (dispatch) => {
    // Clear localStorage
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('chainId');
    localStorage.removeItem('walletType');
    localStorage.removeItem('jwtToken');

    // Clear auth token
    setAuthToken(false);

    // Logout user
    dispatch(logoutUser());
    dispatch(walletDisconnect());
};

// Reducer
const initialState = {
    walletAddress: null,
    chainId: null,
    walletType: null,
    isConnected: false,
    isConnecting: false,
    isSigning: false,
    error: null
};

export const walletAuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case WALLET_CONNECT_REQUEST:
            return {
                ...state,
                isConnecting: true,
                error: null
            };

        case WALLET_CONNECT_SUCCESS:
            return {
                ...state,
                walletAddress: action.payload.walletAddress,
                chainId: action.payload.chainId,
                walletType: action.payload.walletType,
                isConnected: true,
                isConnecting: false,
                error: null
            };

        case WALLET_CONNECT_FAILURE:
            return {
                ...state,
                isConnecting: false,
                error: action.payload
            };

        case WALLET_DISCONNECT:
            return {
                ...initialState
            };

        case WALLET_SIGNATURE_REQUEST:
            return {
                ...state,
                isSigning: true,
                error: null
            };

        case WALLET_SIGNATURE_SUCCESS:
            return {
                ...state,
                isSigning: false,
                error: null
            };

        case WALLET_SIGNATURE_FAILURE:
            return {
                ...state,
                isSigning: false,
                error: action.payload
            };

        default:
            return state;
    }
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
