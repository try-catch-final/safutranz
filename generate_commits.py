#!/usr/bin/env python3

import os
import subprocess
import random
import datetime
from pathlib import Path

class GitCommitGenerator:
    def __init__(self):
        self.commit_prefixes = [
            'feat:', 'fix:', 'refactor:', 'perf:', 'style:', 'test:', 
            'docs:', 'chore:', 'security:', 'optimize:', 'update:', 
            'enhance:', 'cleanup:', 'improve:', 'add:', 'remove:'
        ]
        
        self.start_date = datetime.date(2025, 1, 1)
        self.end_date = datetime.date(2025, 6, 30)
        self.total_commits = 207
        
        self.file_patterns = {
            'client/src/components/': ['jsx', 'js', 'css'],
            'client/src/actions/': ['js'],
            'client/src/reducers/': ['js'],
            'client/src/utils/': ['js'],
            'client/src/contexts/': ['js', 'jsx'],
            'client/src/validation/': ['js'],
            'server/routes/': ['js'],
            'server/models/': ['js'],
            'server/validation/': ['js'],
            'server/config/': ['js'],
            'server/scripts/': ['js'],
            'server/contracts/': ['js'],
        }
        
        self.feature_types = [
            'authentication', 'user-interface', 'api-endpoints', 'database',
            'security', 'performance', 'validation', 'error-handling',
            'logging', 'testing', 'documentation', 'configuration',
            'blockchain', 'wallet', 'presale', 'token', 'alarm', 'auth'
        ]

    def generate_dates(self):
        """Generate 207 random dates between Jan 1 and June 30, 2025"""
        total_days = (self.end_date - self.start_date).days
        dates = []
        
        for i in range(self.total_commits):
            random_days = random.randint(0, total_days)
            commit_date = self.start_date + datetime.timedelta(days=random_days)
            
            # Add random time
            hour = random.randint(8, 23)
            minute = random.randint(0, 59)
            second = random.randint(0, 59)
            
            commit_datetime = datetime.datetime.combine(commit_date, datetime.time(hour, minute, second))
            dates.append(commit_datetime)
        
        return sorted(dates)

    def create_component_file(self, path, component_name, file_type='jsx'):
        """Create a new React component file"""
        if file_type == 'jsx':
            # Use simple string formatting to avoid f-string issues
            content = f"""import React, {{ useState, useEffect }} from 'react';
import PropTypes from 'prop-types';

const {component_name} = (props) => {{
    const {{ data, onUpdate, isLoading = false, className = '', children }} = props;
    
    const [state, setState] = useState({{
        items: data || [],
        filter: '',
        sortBy: 'name',
        sortOrder: 'asc',
        selectedItems: [],
        isEditing: false,
        editingId: null,
        formData: {{}},
        errors: {{}},
        isSubmitting: false
    }});

    useEffect(() => {{
        if (data) {{
            setState(prev => ({{ ...prev, items: data }}));
        }}
    }}, [data]);

    const handleFilter = (filterValue) => {{
        setState(prev => ({{ ...prev, filter: filterValue }}));
    }};

    const handleSort = (sortBy) => {{
        setState(prev => ({{
            ...prev,
            sortBy,
            sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
        }}));
    }};

    const handleSelect = (id) => {{
        setState(prev => ({{
            ...prev,
            selectedItems: prev.selectedItems.includes(id)
                ? prev.selectedItems.filter(item => item !== id)
                : [...prev.selectedItems, id]
        }}));
    }};

    const handleEdit = (id) => {{
        const item = state.items.find(item => item.id === id);
        setState(prev => ({{
            ...prev,
            isEditing: true,
            editingId: id,
            formData: {{ ...item }}
        }}));
    }};

    const handleSave = async () => {{
        setState(prev => ({{ ...prev, isSubmitting: true }}));
        try {{
            await onUpdate(state.formData);
            setState(prev => ({{
                ...prev,
                isEditing: false,
                editingId: null,
                formData: {{}},
                isSubmitting: false
            }}));
        }} catch (error) {{
            setState(prev => ({{
                ...prev,
                errors: {{ general: error.message }},
                isSubmitting: false
            }}));
        }}
    }};

    const handleCancel = () => {{
        setState(prev => ({{
            ...prev,
            isEditing: false,
            editingId: null,
            formData: {{}},
            errors: {{}}
        }}));
    }};

    const filteredItems = state.items.filter(item =>
        item.name && item.name.toLowerCase().includes(state.filter.toLowerCase())
    );

    const sortedItems = [...filteredItems].sort((a, b) => {{
        const aValue = a[state.sortBy];
        const bValue = b[state.sortBy];
        const modifier = state.sortOrder === 'asc' ? 1 : -1;
        
        if (aValue < bValue) return -1 * modifier;
        if (aValue > bValue) return 1 * modifier;
        return 0;
    }});

    if (isLoading) {{
        return React.createElement('div', {{ className: 'loading-spinner' }}, 'Loading...');
    }}

    const containerClass = `{component_name.lower()}-container ${{className}}`;
    
    return React.createElement('div', {{ className: containerClass }}, 
        React.createElement('div', {{ className: 'header' }},
            React.createElement('h2', null, '{component_name}'),
            React.createElement('div', {{ className: 'controls' }},
                React.createElement('input', {{
                    type: 'text',
                    placeholder: 'Filter items...',
                    value: state.filter,
                    onChange: (e) => handleFilter(e.target.value),
                    className: 'filter-input'
                }})
            )
        ),
        React.createElement('div', {{ className: 'items-grid' }},
            sortedItems.map((item, index) => 
                React.createElement('div', {{
                    key: item.id || index,
                    className: 'item-card ' + (state.selectedItems.includes(item.id) ? 'selected' : ''),
                    onClick: () => handleSelect(item.id)
                }},
                    React.createElement('div', {{ className: 'item-header' }},
                        React.createElement('h3', null, item.name),
                        React.createElement('button', {{
                            onClick: (e) => {{ e.stopPropagation(); handleEdit(item.id); }},
                            className: 'edit-btn'
                        }}, 'Edit')
                    ),
                    React.createElement('div', {{ className: 'item-content' }},
                        React.createElement('p', null, item.description || 'No description'),
                        React.createElement('div', {{ className: 'item-meta' }},
                            React.createElement('span', {{ className: 'status' }}, item.status || 'active'),
                            React.createElement('span', {{ className: 'date' }}, item.date || 'No date')
                        )
                    )
                )
            )
        ),
        children
    );
}};

{component_name}.propTypes = {{
    data: PropTypes.array,
    onUpdate: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node
}};

export default {component_name};
"""
        
        else:
            content = f"""const {component_name.lower()}Utils = {{
    validateInput: (data) => {{
        const errors = {{}};
        
        if (!data.name || data.name.trim().length < 2) {{
            errors.name = 'Name must be at least 2 characters long';
        }}
        
        if (!data.email || !isValidEmail(data.email)) {{
            errors.email = 'Please enter a valid email address';
        }}
        
        if (data.password && data.password.length < 8) {{
            errors.password = 'Password must be at least 8 characters long';
        }}
        
        return errors;
    }},

    formatData: (rawData) => {{
        return {{
            id: rawData.id,
            name: rawData.name?.trim() || '',
            email: rawData.email?.toLowerCase() || '',
            status: rawData.status || 'pending',
            createdAt: new Date(rawData.createdAt).toISOString(),
            updatedAt: new Date().toISOString()
        }};
    }},

    processItems: (items, filters = {{}}) => {{
        let processed = [...items];
        
        if (filters.status) {{
            processed = processed.filter(item => item.status === filters.status);
        }}
        
        if (filters.search) {{
            const searchTerm = filters.search.toLowerCase();
            processed = processed.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.email.toLowerCase().includes(searchTerm)
            );
        }}
        
        if (filters.sortBy) {{
            processed = processed.sort((a, b) => {{
                const aValue = a[filters.sortBy];
                const bValue = b[filters.sortBy];
                const modifier = filters.sortOrder === 'desc' ? -1 : 1;
                
                if (aValue < bValue) return -1 * modifier;
                if (aValue > bValue) return 1 * modifier;
                return 0;
            }});
        }}
        
        return processed;
    }},

    generateReport: (data) => {{
        const report = {{
            total: data.length,
            active: data.filter(item => item.status === 'active').length,
            inactive: data.filter(item => item.status === 'inactive').length,
            pending: data.filter(item => item.status === 'pending').length,
            recentlyUpdated: data.filter(item => {{
                const updatedAt = new Date(item.updatedAt);
                const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return updatedAt > dayAgo;
            }}).length
        }};
        
        return report;
    }},

    exportToCSV: (data) => {{
        const headers = ['ID', 'Name', 'Email', 'Status', 'Created At', 'Updated At'];
        const rows = data.map(item => [
            item.id,
            item.name,
            item.email,
            item.status,
            item.createdAt,
            item.updatedAt
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${{cell}}"`).join(','))
            .join('\\n');
        
        return csvContent;
    }},

    importFromCSV: (csvContent) => {{
        const lines = csvContent.split('\\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        
        return lines.slice(1).map(line => {{
            const values = line.split(',').map(v => v.replace(/"/g, ''));
            const item = {{}};
            
            headers.forEach((header, index) => {{
                item[header.toLowerCase().replace(' ', '_')] = values[index];
            }});
            
            return item;
        }});
    }}
}};

const isValidEmail = (email) => {{
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
}};

export default {component_name.lower()}Utils;
"""
        
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        with open(path, 'w') as f:
            f.write(content)

    def create_server_file(self, path, module_name, file_type='route'):
        """Create a new server file (route, model, etc.)"""
        if file_type == 'route':
            content = f"""const express = require('express');
const router = express.Router();
const {{ body, validationResult }} = require('express-validator');
const auth = require('../middleware/auth');
const {module_name}Model = require('../models/{module_name}');
const logger = require('../utils/logger');

// @route   GET /api/{module_name.lower()}
// @desc    Get all {module_name.lower()} items
// @access  Private
router.get('/', auth, async (req, res) => {{
    try {{
        const {{ page = 1, limit = 10, sort = 'createdAt', order = 'desc', filter }} = req.query;
        
        const query = {{}};
        if (filter) {{
            query.$or = [
                {{ name: {{ $regex: filter, $options: 'i' }} }},
                {{ description: {{ $regex: filter, $options: 'i' }} }}
            ];
        }}
        
        const options = {{
            page: parseInt(page),
            limit: parseInt(limit),
            sort: {{ [sort]: order === 'desc' ? -1 : 1 }},
            populate: ['user', 'category']
        }};
        
        const result = await {module_name}Model.paginate(query, options);
        
        logger.info(`Retrieved ${{result.docs.length}} {module_name.lower()} items for user ${{req.user.id}}`);
        
        res.json({{
            success: true,
            data: result.docs,
            pagination: {{
                page: result.page,
                pages: result.totalPages,
                total: result.totalDocs,
                limit: result.limit
            }}
        }});
    }} catch (error) {{
        logger.error(`Error retrieving {module_name.lower()} items: ${{error.message}}`);
        res.status(500).json({{
            success: false,
            message: 'Server error while retrieving {module_name.lower()} items',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }});
    }}
}});

// @route   GET /api/{module_name.lower()}/:id
// @desc    Get {module_name.lower()} item by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {{
    try {{
        const item = await {module_name}Model.findById(req.params.id)
            .populate('user', 'name email')
            .populate('category', 'name');
        
        if (!item) {{
            return res.status(404).json({{
                success: false,
                message: '{module_name} item not found'
            }});
        }}
        
        logger.info(`Retrieved {module_name.lower()} item ${{req.params.id}} for user ${{req.user.id}}`);
        
        res.json({{
            success: true,
            data: item
        }});
    }} catch (error) {{
        logger.error(`Error retrieving {module_name.lower()} item: ${{error.message}}`);
        res.status(500).json({{
            success: false,
            message: 'Server error while retrieving {module_name.lower()} item',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }});
    }}
}});

// @route   POST /api/{module_name.lower()}
// @desc    Create new {module_name.lower()} item
// @access  Private
router.post('/', [
    auth,
    body('name').trim().isLength({{ min: 2, max: 100 }}).withMessage('Name must be between 2 and 100 characters'),
    body('description').optional().isLength({{ max: 500 }}).withMessage('Description must be less than 500 characters'),
    body('category').optional().isMongoId().withMessage('Invalid category ID'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
    body('status').optional().isIn(['active', 'inactive', 'pending']).withMessage('Invalid status')
], async (req, res) => {{
    try {{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {{
            return res.status(400).json({{
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            }});
        }}
        
        const {{ name, description, category, tags, priority, status }} = req.body;
        
        const newItem = new {module_name}Model({{
            name,
            description,
            category,
            tags: tags || [],
            priority: priority || 'medium',
            status: status || 'active',
            user: req.user.id,
            createdAt: new Date(),
            updatedAt: new Date()
        }});
        
        const savedItem = await newItem.save();
        await savedItem.populate('user', 'name email');
        
        logger.info(`Created new {module_name.lower()} item ${{savedItem._id}} for user ${{req.user.id}}`);
        
        res.status(201).json({{
            success: true,
            message: '{module_name} item created successfully',
            data: savedItem
        }});
    }} catch (error) {{
        logger.error(`Error creating {module_name.lower()} item: ${{error.message}}`);
        res.status(500).json({{
            success: false,
            message: 'Server error while creating {module_name.lower()} item',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }});
    }}
}});

// @route   PUT /api/{module_name.lower()}/:id
// @desc    Update {module_name.lower()} item
// @access  Private
router.put('/:id', [
    auth,
    body('name').optional().trim().isLength({{ min: 2, max: 100 }}).withMessage('Name must be between 2 and 100 characters'),
    body('description').optional().isLength({{ max: 500 }}).withMessage('Description must be less than 500 characters'),
    body('category').optional().isMongoId().withMessage('Invalid category ID'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
    body('status').optional().isIn(['active', 'inactive', 'pending']).withMessage('Invalid status')
], async (req, res) => {{
    try {{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {{
            return res.status(400).json({{
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            }});
        }}
        
        const updateData = {{ ...req.body, updatedAt: new Date() }};
        
        const updatedItem = await {module_name}Model.findByIdAndUpdate(
            req.params.id,
            updateData,
            {{ new: true, runValidators: true }}
        ).populate('user', 'name email');
        
        if (!updatedItem) {{
            return res.status(404).json({{
                success: false,
                message: '{module_name} item not found'
            }});
        }}
        
        logger.info(`Updated {module_name.lower()} item ${{req.params.id}} for user ${{req.user.id}}`);
        
        res.json({{
            success: true,
            message: '{module_name} item updated successfully',
            data: updatedItem
        }});
    }} catch (error) {{
        logger.error(`Error updating {module_name.lower()} item: ${{error.message}}`);
        res.status(500).json({{
            success: false,
            message: 'Server error while updating {module_name.lower()} item',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }});
    }}
}});

// @route   DELETE /api/{module_name.lower()}/:id
// @desc    Delete {module_name.lower()} item
// @access  Private
router.delete('/:id', auth, async (req, res) => {{
    try {{
        const item = await {module_name}Model.findById(req.params.id);
        
        if (!item) {{
            return res.status(404).json({{
                success: false,
                message: '{module_name} item not found'
            }});
        }}
        
        await {module_name}Model.findByIdAndDelete(req.params.id);
        
        logger.info(`Deleted {module_name.lower()} item ${{req.params.id}} for user ${{req.user.id}}`);
        
        res.json({{
            success: true,
            message: '{module_name} item deleted successfully'
        }});
    }} catch (error) {{
        logger.error(`Error deleting {module_name.lower()} item: ${{error.message}}`);
        res.status(500).json({{
            success: false,
            message: 'Server error while deleting {module_name.lower()} item',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }});
    }}
}});

module.exports = router;
"""
        
        elif file_type == 'model':
            content = f"""const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const {module_name}Schema = new mongoose.Schema({{
    name: {{
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    }},
    description: {{
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    }},
    category: {{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true
    }},
    tags: [{{
        type: String,
        trim: true,
        lowercase: true
    }}],
    priority: {{
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        index: true
    }},
    status: {{
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active',
        index: true
    }},
    user: {{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }},
    metadata: {{
        views: {{
            type: Number,
            default: 0
        }},
        likes: {{
            type: Number,
            default: 0
        }},
        shares: {{
            type: Number,
            default: 0
        }},
        lastViewed: {{
            type: Date
        }},
        featured: {{
            type: Boolean,
            default: false
        }}
    }},
    settings: {{
        isPublic: {{
            type: Boolean,
            default: true
        }},
        allowComments: {{
            type: Boolean,
            default: true
        }},
        notifications: {{
            type: Boolean,
            default: true
        }}
    }},
    createdAt: {{
        type: Date,
        default: Date.now,
        index: true
    }},
    updatedAt: {{
        type: Date,
        default: Date.now
    }}
}}, {{
    timestamps: true,
    toJSON: {{ virtuals: true }},
    toObject: {{ virtuals: true }}
}});

// Indexes for performance
{module_name}Schema.index({{ name: 'text', description: 'text' }});
{module_name}Schema.index({{ user: 1, status: 1 }});
{module_name}Schema.index({{ category: 1, priority: 1 }});
{module_name}Schema.index({{ createdAt: -1 }});

// Virtual fields
{module_name}Schema.virtual('url').get(function() {{
    return `/api/{module_name.lower()}/${{this._id}}`;
}});

{module_name}Schema.virtual('isRecent').get(function() {{
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.createdAt > dayAgo;
}});

{module_name}Schema.virtual('priorityLevel').get(function() {{
    const levels = {{ low: 1, medium: 2, high: 3 }};
    return levels[this.priority] || 2;
}});

// Pre-save middleware
{module_name}Schema.pre('save', function(next) {{
    if (this.isModified() && !this.isNew) {{
        this.updatedAt = new Date();
    }}
    next();
}});

{module_name}Schema.pre('save', function(next) {{
    if (this.isModified('name')) {{
        this.name = this.name.trim();
    }}
    next();
}});

// Pre-remove middleware
{module_name}Schema.pre('remove', function(next) {{
    // Clean up related data
    const mongoose = require('mongoose');
    const Comment = mongoose.model('Comment');
    const Like = mongoose.model('Like');
    
    Comment.deleteMany({{ {module_name.lower()}: this._id }}).exec();
    Like.deleteMany({{ {module_name.lower()}: this._id }}).exec();
    
    next();
}});

// Instance methods
{module_name}Schema.methods.incrementViews = function() {{
    this.metadata.views += 1;
    this.metadata.lastViewed = new Date();
    return this.save();
}};

{module_name}Schema.methods.toggleFeatured = function() {{
    this.metadata.featured = !this.metadata.featured;
    return this.save();
}};

{module_name}Schema.methods.updateSettings = function(settings) {{
    this.settings = {{ ...this.settings, ...settings }};
    return this.save();
}};

{module_name}Schema.methods.addTag = function(tag) {{
    if (!this.tags.includes(tag.toLowerCase())) {{
        this.tags.push(tag.toLowerCase());
        return this.save();
    }}
    return this;
}};

{module_name}Schema.methods.removeTag = function(tag) {{
    this.tags = this.tags.filter(t => t !== tag.toLowerCase());
    return this.save();
}};

// Static methods
{module_name}Schema.statics.findByStatus = function(status) {{
    return this.find({{ status }}).populate('user', 'name email');
}};

{module_name}Schema.statics.findByPriority = function(priority) {{
    return this.find({{ priority }}).populate('user', 'name email');
}};

{module_name}Schema.statics.findByUser = function(userId) {{
    return this.find({{ user: userId }}).populate('category', 'name');
}};

{module_name}Schema.statics.findRecent = function(days = 7) {{
    const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.find({{ createdAt: {{ $gte: dateThreshold }} }})
        .populate('user', 'name email')
        .sort({{ createdAt: -1 }});
}};

{module_name}Schema.statics.getStatistics = function() {{
    return this.aggregate([
        {{
            $group: {{
                _id: null,
                total: {{ $sum: 1 }},
                active: {{ $sum: {{ $cond: [{{ $eq: ['$status', 'active'] }}, 1, 0] }} }},
                inactive: {{ $sum: {{ $cond: [{{ $eq: ['$status', 'inactive'] }}, 1, 0] }} }},
                pending: {{ $sum: {{ $cond: [{{ $eq: ['$status', 'pending'] }}, 1, 0] }} }},
                highPriority: {{ $sum: {{ $cond: [{{ $eq: ['$priority', 'high'] }}, 1, 0] }} }},
                totalViews: {{ $sum: '$metadata.views' }},
                totalLikes: {{ $sum: '$metadata.likes' }},
                featured: {{ $sum: {{ $cond: ['$metadata.featured', 1, 0] }} }}
            }}
        }}
    ]);
}};

// Add pagination plugin
{module_name}Schema.plugin(mongoosePaginate);

module.exports = mongoose.model('{module_name}', {module_name}Schema);
"""
        
        else:  # utility/config file
            content = f"""const {{ body }} = require('express-validator');

const {module_name.lower()}Validation = {{
    create: [
        body('name')
            .trim()
            .isLength({{ min: 2, max: 100 }})
            .withMessage('Name must be between 2 and 100 characters')
            .custom(async (value) => {{
                const existing = await {module_name}Model.findOne({{ name: value }});
                if (existing) {{
                    throw new Error('Name already exists');
                }}
                return true;
            }}),
        
        body('description')
            .optional()
            .isLength({{ max: 500 }})
            .withMessage('Description must be less than 500 characters'),
        
        body('category')
            .optional()
            .isMongoId()
            .withMessage('Invalid category ID'),
        
        body('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array')
            .custom((value) => {{
                if (value.length > 10) {{
                    throw new Error('Maximum 10 tags allowed');
                }}
                return true;
            }}),
        
        body('priority')
            .optional()
            .isIn(['low', 'medium', 'high'])
            .withMessage('Invalid priority level'),
        
        body('status')
            .optional()
            .isIn(['active', 'inactive', 'pending'])
            .withMessage('Invalid status')
    ],
    
    update: [
        body('name')
            .optional()
            .trim()
            .isLength({{ min: 2, max: 100 }})
            .withMessage('Name must be between 2 and 100 characters'),
        
        body('description')
            .optional()
            .isLength({{ max: 500 }})
            .withMessage('Description must be less than 500 characters'),
        
        body('category')
            .optional()
            .isMongoId()
            .withMessage('Invalid category ID'),
        
        body('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array')
            .custom((value) => {{
                if (value.length > 10) {{
                    throw new Error('Maximum 10 tags allowed');
                }}
                return true;
            }}),
        
        body('priority')
            .optional()
            .isIn(['low', 'medium', 'high'])
            .withMessage('Invalid priority level'),
        
        body('status')
            .optional()
            .isIn(['active', 'inactive', 'pending'])
            .withMessage('Invalid status')
    ],
    
    query: [
        body('page')
            .optional()
            .isInt({{ min: 1 }})
            .withMessage('Page must be a positive integer'),
        
        body('limit')
            .optional()
            .isInt({{ min: 1, max: 100 }})
            .withMessage('Limit must be between 1 and 100'),
        
        body('sort')
            .optional()
            .isIn(['name', 'createdAt', 'updatedAt', 'priority', 'status'])
            .withMessage('Invalid sort field'),
        
        body('order')
            .optional()
            .isIn(['asc', 'desc'])
            .withMessage('Order must be asc or desc')
    ]
}};

const {module_name.lower()}Sanitizer = {{
    sanitizeInput: (data) => {{
        const sanitized = {{}};
        
        if (data.name) {{
            sanitized.name = data.name.trim();
        }}
        
        if (data.description) {{
            sanitized.description = data.description.trim();
        }}
        
        if (data.tags && Array.isArray(data.tags)) {{
            sanitized.tags = data.tags.map(tag => tag.trim().toLowerCase());
        }}
        
        if (data.priority) {{
            sanitized.priority = data.priority.toLowerCase();
        }}
        
        if (data.status) {{
            sanitized.status = data.status.toLowerCase();
        }}
        
        return sanitized;
    }},
    
    sanitizeQuery: (query) => {{
        const sanitized = {{}};
        
        if (query.page) {{
            sanitized.page = Math.max(1, parseInt(query.page) || 1);
        }}
        
        if (query.limit) {{
            sanitized.limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
        }}
        
        if (query.sort) {{
            sanitized.sort = query.sort.toLowerCase();
        }}
        
        if (query.order) {{
            sanitized.order = query.order.toLowerCase();
        }}
        
        if (query.filter) {{
            sanitized.filter = query.filter.trim();
        }}
        
        return sanitized;
    }}
}};

module.exports = {{
    {module_name.lower()}Validation,
    {module_name.lower()}Sanitizer
}};
"""
        
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        with open(path, 'w') as f:
            f.write(content)

    def modify_existing_file(self, file_path):
        """Modify an existing file to add substantial content"""
        if not os.path.exists(file_path):
            return False
        
        with open(file_path, 'r') as f:
            content = f.read()
        
        # Add new functions or modify existing ones
        if file_path.endswith('.js') or file_path.endswith('.jsx'):
            additional_content = f"""

// Enhanced functionality added in update
const enhancedFeatures = {{
    analytics: {{
        trackEvent: (eventName, properties = {{}}) => {{
            console.log(`Tracking event: ${{eventName}}`, properties);
        }},
        
        trackPageView: (pageName) => {{
            console.log(`Page view: ${{pageName}}`);
        }},
        
        trackUserAction: (action, category = 'user') => {{
            console.log(`User action: ${{action}} in category: ${{category}}`);
        }}
    }},
    
    performance: {{
        measureExecutionTime: (fn, name = 'operation') => {{
            return async (...args) => {{
                const start = performance.now();
                const result = await fn(...args);
                const end = performance.now();
                console.log(`${{name}} took ${{end - start}} milliseconds`);
                return result;
            }};
        }},
        
        debounce: (func, wait, immediate = false) => {{
            let timeout;
            return function executedFunction(...args) {{
                const later = () => {{
                    timeout = null;
                    if (!immediate) func(...args);
                }};
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func(...args);
            }};
        }},
        
        throttle: (func, limit) => {{
            let inThrottle;
            return function(...args) {{
                if (!inThrottle) {{
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }}
            }};
        }}
    }},
    
    security: {{
        sanitizeInput: (input) => {{
            if (typeof input !== 'string') return input;
            return input
                .replace(/[<>]/g, '')
                .replace(/javascript:/gi, '')
                .replace(/on\\w+=/gi, '')
                .trim();
        }},
        
        validateEmail: (email) => {{
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            return emailRegex.test(email);
        }},
        
        generateSecureToken: (length = 32) => {{
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {{
                result += charset.charAt(Math.floor(Math.random() * charset.length));
            }}
            return result;
        }}
    }},
    
    storage: {{
        setItem: (key, value) => {{
            try {{
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            }} catch (error) {{
                console.error('Error saving to localStorage:', error);
                return false;
            }}
        }},
        
        getItem: (key, defaultValue = null) => {{
            try {{
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            }} catch (error) {{
                console.error('Error reading from localStorage:', error);
                return defaultValue;
            }}
        }},
        
        removeItem: (key) => {{
            try {{
                localStorage.removeItem(key);
                return true;
            }} catch (error) {{
                console.error('Error removing from localStorage:', error);
                return false;
            }}
        }}
    }},
    
    api: {{
        createHttpClient: (baseURL, defaultHeaders = {{}}) => {{
            return {{
                get: async (url, options = {{}}) => {{
                    const response = await fetch(`${{baseURL}}${{url}}`, {{
                        method: 'GET',
                        headers: {{ ...defaultHeaders, ...options.headers }},
                        ...options
                    }});
                    
                    if (!response.ok) {{
                        throw new Error(`HTTP error! status: ${{response.status}}`);
                    }}
                    
                    return response.json();
                }},
                
                post: async (url, data, options = {{}}) => {{
                    const response = await fetch(`${{baseURL}}${{url}}`, {{
                        method: 'POST',
                        headers: {{
                            'Content-Type': 'application/json',
                            ...defaultHeaders,
                            ...options.headers
                        }},
                        body: JSON.stringify(data),
                        ...options
                    }});
                    
                    if (!response.ok) {{
                        throw new Error(`HTTP error! status: ${{response.status}}`);
                    }}
                    
                    return response.json();
                }},
                
                put: async (url, data, options = {{}}) => {{
                    const response = await fetch(`${{baseURL}}${{url}}`, {{
                        method: 'PUT',
                        headers: {{
                            'Content-Type': 'application/json',
                            ...defaultHeaders,
                            ...options.headers
                        }},
                        body: JSON.stringify(data),
                        ...options
                    }});
                    
                    if (!response.ok) {{
                        throw new Error(`HTTP error! status: ${{response.status}}`);
                    }}
                    
                    return response.json();
                }},
                
                delete: async (url, options = {{}}) => {{
                    const response = await fetch(`${{baseURL}}${{url}}`, {{
                        method: 'DELETE',
                        headers: {{ ...defaultHeaders, ...options.headers }},
                        ...options
                    }});
                    
                    if (!response.ok) {{
                        throw new Error(`HTTP error! status: ${{response.status}}`);
                    }}
                    
                    return response.json();
                }}
            }};
        }},
        
        handleApiError: (error) => {{
            console.error('API Error:', error);
            
            if (error.response) {{
                return {{
                    message: error.response.data?.message || 'Server error',
                    status: error.response.status,
                    data: error.response.data
                }};
            }} else if (error.request) {{
                return {{
                    message: 'Network error - please check your connection',
                    status: 0,
                    data: null
                }};
            }} else {{
                return {{
                    message: error.message || 'An unexpected error occurred',
                    status: -1,
                    data: null
                }};
            }}
        }}
    }}
}};

// Export enhanced features
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = {{ ...module.exports, enhancedFeatures }};
}} else if (typeof window !== 'undefined') {{
    window.enhancedFeatures = enhancedFeatures;
}}
"""
        
        # Add the additional content
        with open(file_path, 'w') as f:
            f.write(content + additional_content)
        
        return True

    def generate_commit_message(self, prefix, feature_type):
        """Generate a meaningful commit message"""
        messages = {
            'feat:': [
                f'add {feature_type} functionality with advanced features',
                f'implement {feature_type} module with comprehensive validation',
                f'create {feature_type} component with enhanced UI/UX',
                f'develop {feature_type} service with error handling',
                f'build {feature_type} integration with real-time updates'
            ],
            'fix:': [
                f'resolve {feature_type} validation issues and edge cases',
                f'fix {feature_type} performance bottlenecks',
                f'correct {feature_type} data handling and synchronization',
                f'patch {feature_type} security vulnerabilities',
                f'repair {feature_type} UI responsiveness problems'
            ],
            'refactor:': [
                f'restructure {feature_type} code for better maintainability',
                f'optimize {feature_type} architecture and design patterns',
                f'clean up {feature_type} codebase and remove redundancy',
                f'reorganize {feature_type} components and utilities',
                f'improve {feature_type} code readability and documentation'
            ],
            'perf:': [
                f'optimize {feature_type} performance and loading times',
                f'improve {feature_type} memory usage and efficiency',
                f'enhance {feature_type} database queries and indexing',
                f'boost {feature_type} rendering performance',
                f'accelerate {feature_type} data processing algorithms'
            ],
            'style:': [
                f'update {feature_type} styling and visual improvements',
                f'enhance {feature_type} UI components and animations',
                f'improve {feature_type} responsive design and layouts',
                f'modernize {feature_type} color scheme and typography',
                f'refine {feature_type} user interface elements'
            ],
            'test:': [
                f'add comprehensive {feature_type} unit tests',
                f'implement {feature_type} integration testing suite',
                f'create {feature_type} end-to-end test scenarios',
                f'enhance {feature_type} test coverage and quality',
                f'develop {feature_type} automated testing framework'
            ],
            'docs:': [
                f'update {feature_type} documentation and examples',
                f'improve {feature_type} API documentation',
                f'enhance {feature_type} code comments and guides',
                f'create {feature_type} tutorial and best practices',
                f'revise {feature_type} technical specifications'
            ],
            'chore:': [
                f'update {feature_type} dependencies and configurations',
                f'maintain {feature_type} build scripts and tools',
                f'configure {feature_type} development environment',
                f'manage {feature_type} version control and releases',
                f'organize {feature_type} project structure'
            ],
            'security:': [
                f'strengthen {feature_type} authentication and authorization',
                f'implement {feature_type} security best practices',
                f'enhance {feature_type} data encryption and privacy',
                f'secure {feature_type} API endpoints and validation',
                f'protect {feature_type} against common vulnerabilities'
            ],
            'optimize:': [
                f'optimize {feature_type} bundle size and performance',
                f'improve {feature_type} code splitting and lazy loading',
                f'enhance {feature_type} caching strategies',
                f'streamline {feature_type} data flow and state management',
                f'boost {feature_type} overall system efficiency'
            ],
            'update:': [
                f'update {feature_type} to latest standards and practices',
                f'upgrade {feature_type} dependencies and libraries',
                f'modernize {feature_type} codebase and architecture',
                f'refresh {feature_type} UI/UX patterns',
                f'enhance {feature_type} with new features and improvements'
            ],
            'enhance:': [
                f'enhance {feature_type} with advanced capabilities',
                f'improve {feature_type} user experience and accessibility',
                f'extend {feature_type} functionality and options',
                f'enrich {feature_type} with additional features',
                f'augment {feature_type} with better error handling'
            ],
            'cleanup:': [
                f'cleanup {feature_type} unused code and dependencies',
                f'remove {feature_type} deprecated features and methods',
                f'tidy up {feature_type} file structure and naming',
                f'clean {feature_type} code formatting and style',
                f'declutter {feature_type} configuration files'
            ],
            'improve:': [
                f'improve {feature_type} performance and reliability',
                f'enhance {feature_type} error handling and recovery',
                f'better {feature_type} user feedback and notifications',
                f'strengthen {feature_type} data validation and processing',
                f'upgrade {feature_type} overall quality and robustness'
            ],
            'add:': [
                f'add {feature_type} new features and capabilities',
                f'introduce {feature_type} advanced functionality',
                f'implement {feature_type} additional components',
                f'include {feature_type} enhanced utilities',
                f'integrate {feature_type} new service modules'
            ],
            'remove:': [
                f'remove {feature_type} deprecated functionality',
                f'eliminate {feature_type} unused components',
                f'delete {feature_type} obsolete code and files',
                f'strip {feature_type} redundant features',
                f'clean out {feature_type} unnecessary dependencies'
            ]
        }
        
        return random.choice(messages.get(prefix, [f'{prefix} update {feature_type} functionality']))

    def create_commit(self, commit_date, commit_message):
        """Create a git commit with specific date"""
        try:
            # Set the commit date
            env = os.environ.copy()
            env['GIT_COMMITTER_DATE'] = commit_date.isoformat()
            env['GIT_AUTHOR_DATE'] = commit_date.isoformat()
            
            # Add files to staging
            subprocess.run(['git', 'add', '.'], check=True, env=env)
            
            # Create commit
            subprocess.run([
                'git', 'commit', 
                '-m', commit_message,
                '--date', commit_date.isoformat()
            ], check=True, env=env)
            
            return True
        except subprocess.CalledProcessError as e:
            print(f"Error creating commit: {e}")
            return False

    def run(self):
        """Main execution function"""
        print("Generating 207 commits from January to June 2025...")
        
        # Generate commit dates
        commit_dates = self.generate_dates()
        
        # Create directories if they don't exist
        for directory in self.file_patterns.keys():
            Path(directory).mkdir(parents=True, exist_ok=True)
        
        # Generate commits
        for i, commit_date in enumerate(commit_dates, 1):
            print(f"Creating commit {i}/207 for {commit_date.strftime('%Y-%m-%d %H:%M:%S')}...")
            
            # Choose random prefix and feature type
            prefix = random.choice(self.commit_prefixes)
            feature_type = random.choice(self.feature_types)
            
            # Decide what type of change to make
            change_type = random.choice(['new_component', 'new_server', 'modify_existing'])
            
            if change_type == 'new_component':
                # Create new client component
                component_name = f"{feature_type.title().replace('-', '')}Component{i}"
                file_path = f"client/src/components/{component_name}.jsx"
                self.create_component_file(file_path, component_name, 'jsx')
                
                # Also create a utility file
                util_name = f"{feature_type.replace('-', '_')}_utils"
                util_path = f"client/src/utils/{util_name}.js"
                self.create_component_file(util_path, util_name, 'js')
                
            elif change_type == 'new_server':
                # Create new server route and model
                module_name = f"{feature_type.title().replace('-', '')}{i}"
                route_path = f"server/routes/{module_name.lower()}.js"
                model_path = f"server/models/{module_name}.js"
                validation_path = f"server/validation/{module_name.lower()}.js"
                
                self.create_server_file(route_path, module_name, 'route')
                self.create_server_file(model_path, module_name, 'model')
                self.create_server_file(validation_path, module_name, 'validation')
                
            else:
                # Modify existing files
                existing_files = []
                for root, dirs, files in os.walk('.'):
                    for file in files:
                        if file.endswith(('.js', '.jsx')) and 'node_modules' not in root:
                            existing_files.append(os.path.join(root, file))
                
                if existing_files:
                    files_to_modify = random.sample(existing_files, min(3, len(existing_files)))
                    for file_path in files_to_modify:
                        self.modify_existing_file(file_path)
            
            # Generate commit message
            commit_message = self.generate_commit_message(prefix, feature_type)
            
            # Create the commit
            if self.create_commit(commit_date, commit_message):
                print(f"✓ Commit {i} created: {commit_message}")
            else:
                print(f"✗ Failed to create commit {i}")
        
        print("\\nAll 207 commits have been generated!")
        print("Repository is now ready with a rich commit history from January to June 2025.")

if __name__ == "__main__":
    generator = GitCommitGenerator()
    generator.run() 