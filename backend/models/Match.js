const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    // Pour les matches recruteur-candidat, on garde une trace du poste
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position'
    },
    // Statut du match
    status: {
        type: String,
        enum: ['active', 'archived', 'rejected'],
        default: 'active'
    },
    // Messages échangés
    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    // Dernière activité
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index pour les recherches rapides
matchSchema.index({ users: 1 });
matchSchema.index({ status: 1 });

const Match = mongoose.model('Match', matchSchema);
module.exports = Match; 