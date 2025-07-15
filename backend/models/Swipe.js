const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema({
    swiper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    swiped: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        enum: ['like', 'dislike'],
        required: true
    },
    // Si c'est un like pour un poste spécifique (cas du recruteur)
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position'
    }
}, {
    timestamps: true
});

// Index composé pour éviter les doublons
swipeSchema.index({ swiper: 1, swiped: 1 }, { unique: true });

const Swipe = mongoose.model('Swipe', swipeSchema);
module.exports = Swipe; 