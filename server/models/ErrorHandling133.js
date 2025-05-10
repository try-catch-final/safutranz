const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ErrorHandling133Schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        index: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active',
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    metadata: {
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        shares: {
            type: Number,
            default: 0
        },
        lastViewed: {
            type: Date
        },
        featured: {
            type: Boolean,
            default: false
        }
    },
    settings: {
        isPublic: {
            type: Boolean,
            default: true
        },
        allowComments: {
            type: Boolean,
            default: true
        },
        notifications: {
            type: Boolean,
            default: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
ErrorHandling133Schema.index({ name: 'text', description: 'text' });
ErrorHandling133Schema.index({ user: 1, status: 1 });
ErrorHandling133Schema.index({ category: 1, priority: 1 });
ErrorHandling133Schema.index({ createdAt: -1 });

// Virtual fields
ErrorHandling133Schema.virtual('url').get(function() {
    return `/api/errorhandling133/${this._id}`;
});

ErrorHandling133Schema.virtual('isRecent').get(function() {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.createdAt > dayAgo;
});

ErrorHandling133Schema.virtual('priorityLevel').get(function() {
    const levels = { low: 1, medium: 2, high: 3 };
    return levels[this.priority] || 2;
});

// Pre-save middleware
ErrorHandling133Schema.pre('save', function(next) {
    if (this.isModified() && !this.isNew) {
        this.updatedAt = new Date();
    }
    next();
});

ErrorHandling133Schema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.name = this.name.trim();
    }
    next();
});

// Pre-remove middleware
ErrorHandling133Schema.pre('remove', function(next) {
    // Clean up related data
    const mongoose = require('mongoose');
    const Comment = mongoose.model('Comment');
    const Like = mongoose.model('Like');
    
    Comment.deleteMany({ errorhandling133: this._id }).exec();
    Like.deleteMany({ errorhandling133: this._id }).exec();
    
    next();
});

// Instance methods
ErrorHandling133Schema.methods.incrementViews = function() {
    this.metadata.views += 1;
    this.metadata.lastViewed = new Date();
    return this.save();
};

ErrorHandling133Schema.methods.toggleFeatured = function() {
    this.metadata.featured = !this.metadata.featured;
    return this.save();
};

ErrorHandling133Schema.methods.updateSettings = function(settings) {
    this.settings = { ...this.settings, ...settings };
    return this.save();
};

ErrorHandling133Schema.methods.addTag = function(tag) {
    if (!this.tags.includes(tag.toLowerCase())) {
        this.tags.push(tag.toLowerCase());
        return this.save();
    }
    return this;
};

ErrorHandling133Schema.methods.removeTag = function(tag) {
    this.tags = this.tags.filter(t => t !== tag.toLowerCase());
    return this.save();
};

// Static methods
ErrorHandling133Schema.statics.findByStatus = function(status) {
    return this.find({ status }).populate('user', 'name email');
};

ErrorHandling133Schema.statics.findByPriority = function(priority) {
    return this.find({ priority }).populate('user', 'name email');
};

ErrorHandling133Schema.statics.findByUser = function(userId) {
    return this.find({ user: userId }).populate('category', 'name');
};

ErrorHandling133Schema.statics.findRecent = function(days = 7) {
    const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.find({ createdAt: { $gte: dateThreshold } })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
};

ErrorHandling133Schema.statics.getStatistics = function() {
    return this.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
                inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
                pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
                totalViews: { $sum: '$metadata.views' },
                totalLikes: { $sum: '$metadata.likes' },
                featured: { $sum: { $cond: ['$metadata.featured', 1, 0] } }
            }
        }
    ]);
};

// Add pagination plugin
ErrorHandling133Schema.plugin(mongoosePaginate);

module.exports = mongoose.model('ErrorHandling133', ErrorHandling133Schema);
