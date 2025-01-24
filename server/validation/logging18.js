const { body } = require('express-validator');

const logging18Validation = {
    create: [
        body('name')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters')
            .custom(async (value) => {
                const existing = await Logging18Model.findOne({ name: value });
                if (existing) {
                    throw new Error('Name already exists');
                }
                return true;
            }),
        
        body('description')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Description must be less than 500 characters'),
        
        body('category')
            .optional()
            .isMongoId()
            .withMessage('Invalid category ID'),
        
        body('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array')
            .custom((value) => {
                if (value.length > 10) {
                    throw new Error('Maximum 10 tags allowed');
                }
                return true;
            }),
        
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
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters'),
        
        body('description')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Description must be less than 500 characters'),
        
        body('category')
            .optional()
            .isMongoId()
            .withMessage('Invalid category ID'),
        
        body('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array')
            .custom((value) => {
                if (value.length > 10) {
                    throw new Error('Maximum 10 tags allowed');
                }
                return true;
            }),
        
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
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        
        body('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
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
};

const logging18Sanitizer = {
    sanitizeInput: (data) => {
        const sanitized = {};
        
        if (data.name) {
            sanitized.name = data.name.trim();
        }
        
        if (data.description) {
            sanitized.description = data.description.trim();
        }
        
        if (data.tags && Array.isArray(data.tags)) {
            sanitized.tags = data.tags.map(tag => tag.trim().toLowerCase());
        }
        
        if (data.priority) {
            sanitized.priority = data.priority.toLowerCase();
        }
        
        if (data.status) {
            sanitized.status = data.status.toLowerCase();
        }
        
        return sanitized;
    },
    
    sanitizeQuery: (query) => {
        const sanitized = {};
        
        if (query.page) {
            sanitized.page = Math.max(1, parseInt(query.page) || 1);
        }
        
        if (query.limit) {
            sanitized.limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
        }
        
        if (query.sort) {
            sanitized.sort = query.sort.toLowerCase();
        }
        
        if (query.order) {
            sanitized.order = query.order.toLowerCase();
        }
        
        if (query.filter) {
            sanitized.filter = query.filter.trim();
        }
        
        return sanitized;
    }
};

module.exports = {
    logging18Validation,
    logging18Sanitizer
};
