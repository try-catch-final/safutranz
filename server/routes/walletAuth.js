const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');
const { ethers } = require('ethers');

// Load User model
const User = require('../models/Auth');

// @route   GET api/auth/wallet/:address
// @desc    Check if wallet user exists
// @access  Public
router.get('/:address', async (req, res) => {
    try {
        const { address } = req.params;

        // Validate Ethereum address
        if (!ethers.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid Ethereum address' });
        }

        // Check if user exists
        const user = await User.findOne({ walletAddress: address.toLowerCase() });

        res.json({
            exists: !!user,
            user: user ? {
                id: user.id,
                walletAddress: user.walletAddress,
                walletType: user.walletType,
                createdAt: user.createdAt
            } : null
        });
    } catch (error) {
        console.error('Error checking wallet user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST api/auth/wallet/register
// @desc    Register new wallet user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { walletAddress, walletType = 'MetaMask' } = req.body;

        // Validate Ethereum address
        if (!ethers.isAddress(walletAddress)) {
            return res.status(400).json({ error: 'Invalid Ethereum address' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user
        const newUser = new User({
            walletAddress: walletAddress.toLowerCase(),
            walletType,
            nonce: Math.floor(Math.random() * 1000000).toString()
        });

        await newUser.save();

        res.json({
            success: true,
            message: 'Wallet user registered successfully',
            user: {
                id: newUser.id,
                walletAddress: newUser.walletAddress,
                walletType: newUser.walletType
            }
        });
    } catch (error) {
        console.error('Error registering wallet user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET api/auth/wallet/nonce/:address
// @desc    Get nonce for signature verification
// @access  Public
router.get('/nonce/:address', async (req, res) => {
    try {
        const { address } = req.params;

        // Validate Ethereum address
        if (!ethers.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid Ethereum address' });
        }

        // Find user
        const user = await User.findOne({ walletAddress: address.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate new nonce
        const newNonce = Math.floor(Math.random() * 1000000).toString();
        user.nonce = newNonce;
        await user.save();

        res.json({ nonce: newNonce });
    } catch (error) {
        console.error('Error getting nonce:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST api/auth/wallet/verify
// @desc    Verify wallet signature and authenticate user
// @access  Public
router.post('/verify', async (req, res) => {
    try {
        const { walletAddress, signature, message, nonce } = req.body;

        // Validate inputs
        if (!walletAddress || !signature || !message || !nonce) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate Ethereum address
        if (!ethers.isAddress(walletAddress)) {
            return res.status(400).json({ error: 'Invalid Ethereum address' });
        }

        // Find user
        const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify nonce
        if (user.nonce !== nonce) {
            return res.status(400).json({ error: 'Invalid nonce' });
        }

        // Recover address from signature
        const recoveredAddress = ethers.verifyMessage(message, signature);

        // Check if recovered address matches
        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(400).json({ error: 'Invalid signature' });
        }

        // Generate new nonce for next login
        const newNonce = Math.floor(Math.random() * 1000000).toString();
        user.nonce = newNonce;
        await user.save();

        // Create JWT payload
        const payload = {
            id: user.id,
            walletAddress: user.walletAddress,
            walletType: user.walletType
        };

        // Sign token
        jwt.sign(
            payload,
            keys.secret,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err);
                    return res.status(500).json({ error: 'Token generation failed' });
                }

                res.json({
                    success: true,
                    token: 'Bearer ' + token,
                    user: {
                        id: user.id,
                        walletAddress: user.walletAddress,
                        walletType: user.walletType
                    }
                });
            }
        );

    } catch (error) {
        console.error('Error verifying signature:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET api/auth/wallet/profile
// @desc    Get wallet user profile (protected route)
// @access  Private
router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-nonce');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            walletAddress: user.walletAddress,
            walletType: user.walletType,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT api/auth/wallet/profile
// @desc    Update wallet user profile (protected route)
// @access  Private
router.put('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { walletType } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update fields
        if (walletType) {
            user.walletType = walletType;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                walletAddress: user.walletAddress,
                walletType: user.walletType,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 

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
