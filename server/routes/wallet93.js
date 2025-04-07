const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Wallet93Model = require('../models/Wallet93');
const logger = require('../utils/logger');

// @route   GET /api/wallet93
// @desc    Get all wallet93 items
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', filter } = req.query;
        
        const query = {};
        if (filter) {
            query.$or = [
                { name: { $regex: filter, $options: 'i' } },
                { description: { $regex: filter, $options: 'i' } }
            ];
        }
        
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { [sort]: order === 'desc' ? -1 : 1 },
            populate: ['user', 'category']
        };
        
        const result = await Wallet93Model.paginate(query, options);
        
        logger.info(`Retrieved ${result.docs.length} wallet93 items for user ${req.user.id}`);
        
        res.json({
            success: true,
            data: result.docs,
            pagination: {
                page: result.page,
                pages: result.totalPages,
                total: result.totalDocs,
                limit: result.limit
            }
        });
    } catch (error) {
        logger.error(`Error retrieving wallet93 items: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving wallet93 items',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/wallet93/:id
// @desc    Get wallet93 item by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const item = await Wallet93Model.findById(req.params.id)
            .populate('user', 'name email')
            .populate('category', 'name');
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Wallet93 item not found'
            });
        }
        
        logger.info(`Retrieved wallet93 item ${req.params.id} for user ${req.user.id}`);
        
        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        logger.error(`Error retrieving wallet93 item: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving wallet93 item',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/wallet93
// @desc    Create new wallet93 item
// @access  Private
router.post('/', [
    auth,
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
    body('category').optional().isMongoId().withMessage('Invalid category ID'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
    body('status').optional().isIn(['active', 'inactive', 'pending']).withMessage('Invalid status')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }
        
        const { name, description, category, tags, priority, status } = req.body;
        
        const newItem = new Wallet93Model({
            name,
            description,
            category,
            tags: tags || [],
            priority: priority || 'medium',
            status: status || 'active',
            user: req.user.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        const savedItem = await newItem.save();
        await savedItem.populate('user', 'name email');
        
        logger.info(`Created new wallet93 item ${savedItem._id} for user ${req.user.id}`);
        
        res.status(201).json({
            success: true,
            message: 'Wallet93 item created successfully',
            data: savedItem
        });
    } catch (error) {
        logger.error(`Error creating wallet93 item: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error while creating wallet93 item',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   PUT /api/wallet93/:id
// @desc    Update wallet93 item
// @access  Private
router.put('/:id', [
    auth,
    body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
    body('category').optional().isMongoId().withMessage('Invalid category ID'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
    body('status').optional().isIn(['active', 'inactive', 'pending']).withMessage('Invalid status')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }
        
        const updateData = { ...req.body, updatedAt: new Date() };
        
        const updatedItem = await Wallet93Model.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('user', 'name email');
        
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: 'Wallet93 item not found'
            });
        }
        
        logger.info(`Updated wallet93 item ${req.params.id} for user ${req.user.id}`);
        
        res.json({
            success: true,
            message: 'Wallet93 item updated successfully',
            data: updatedItem
        });
    } catch (error) {
        logger.error(`Error updating wallet93 item: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error while updating wallet93 item',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   DELETE /api/wallet93/:id
// @desc    Delete wallet93 item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Wallet93Model.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Wallet93 item not found'
            });
        }
        
        await Wallet93Model.findByIdAndDelete(req.params.id);
        
        logger.info(`Deleted wallet93 item ${req.params.id} for user ${req.user.id}`);
        
        res.json({
            success: true,
            message: 'Wallet93 item deleted successfully'
        });
    } catch (error) {
        logger.error(`Error deleting wallet93 item: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting wallet93 item',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
