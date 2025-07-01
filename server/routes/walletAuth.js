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