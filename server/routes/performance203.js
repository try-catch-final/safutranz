const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Performance203Model = require('../models/Performance203');
const logger = require('../utils/logger');

// @route   GET /api/performance203
// @desc    Get all performance203 items
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
        
        const result = await Performance203Model.paginate(query, options);
        
        logger.info(`Retrieved ${result.docs.length} performance203 items for user ${req.user.id}`);
        
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
        logger.error(`Error retrieving performance203 items: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving performance203 items',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/performance203/:id
// @desc    Get performance203 item by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const item = await Performance203Model.findById(req.params.id)
            .populate('user', 'name email')
            .populate('category', 'name');
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Performance203 item not found'
            });
        }
        
        logger.info(`Retrieved performance203 item ${req.params.id} for user ${req.user.id}`);
        
        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        logger.error(`Error retrieving performance203 item: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving performance203 item',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/performance203
// @desc    Create new performance203 item
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
        
        const newItem = new Performance203Model({
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
        
        logger.info(`Created new performance203 item ${savedItem._id} for user ${req.user.id}`);
        
        res.status(201).json({
            success: true,
            message: 'Performance203 item created successfully',
            data: savedItem
        });
    } catch (error) {
        logger.error(`Error creating performance203 item: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error while creating performance203 item',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   PUT /api/performance203/:id
// @desc    Update performance203 item
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
        
        const updatedItem = await Performance203Model.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('user', 'name email');
        
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: 'Performance203 item not found'
            });
        }
        
        logger.info(`Updated performance203 item ${req.params.id} for user ${req.user.id}`);
        
        res.json({
            success: true,
            message: 'Performance203 item updated successfully',
            data: updatedItem
        });
    } catch (error) {
        logger.error(`Error updating performance203 item: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error while updating performance203 item',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   DELETE /api/performance203/:id
// @desc    Delete performance203 item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Performance203Model.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Performance203 item not found'
            });
        }
        
        await Performance203Model.findByIdAndDelete(req.params.id);
        
        logger.info(`Deleted performance203 item ${req.params.id} for user ${req.user.id}`);
        
        res.json({
            success: true,
            message: 'Performance203 item deleted successfully'
        });
    } catch (error) {
        logger.error(`Error deleting performance203 item: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting performance203 item',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
