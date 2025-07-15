const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['candidate', 'recruiter'],
        required: true
    },
    // Informations de profil
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    // Champs spécifiques aux candidats
    candidateProfile: {
        skills: [String],
        experience: [{
            title: String,
            company: String,
            duration: String,
            description: String
        }],
        education: [{
            degree: String,
            school: String,
            year: Number
        }],
        desiredPosition: String,
        desiredSalary: Number
    },
    // Champs spécifiques aux recruteurs
    recruiterProfile: {
        company: String,
        position: String,
        industry: String,
        companySize: String,
        openPositions: [{
            title: String,
            description: String,
            requirements: [String],
            salary: {
                min: Number,
                max: Number
            }
        }]
    },
    // Photos de profil
    photos: [{
        url: String,
        isMain: Boolean
    }],
    // Localisation
    location: {
        city: String,
        country: String,
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    },
    // Préférences
    preferences: {
        maxDistance: Number,
        ageRange: {
            min: Number,
            max: Number
        }
    },
    // Statut du compte
    isActive: {
        type: Boolean,
        default: true
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User; 