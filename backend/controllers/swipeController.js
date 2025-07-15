const Swipe = require('../models/Swipe');
const Match = require('../models/Match');

// @desc    Create a new swipe
// @route   POST /api/swipes
// @access  Private
const createSwipe = async (req, res) => {
    try {
        const { swipedId, action, positionId } = req.body;
        const swiperId = req.user._id;

        // Vérifier si un swipe existe déjà
        const existingSwipe = await Swipe.findOne({
            swiper: swiperId,
            swiped: swipedId
        });

        if (existingSwipe) {
            return res.status(400).json({ message: 'Swipe already exists' });
        }

        // Créer le swipe
        const swipe = await Swipe.create({
            swiper: swiperId,
            swiped: swipedId,
            action,
            position: positionId
        });

        // Si c'est un like, vérifier s'il y a un match
        if (action === 'like') {
            const reverseSwipe = await Swipe.findOne({
                swiper: swipedId,
                swiped: swiperId,
                action: 'like'
            });

            if (reverseSwipe) {
                // Créer un match
                await Match.create({
                    users: [swiperId, swipedId],
                    position: positionId
                });
            }
        }

        res.status(201).json(swipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's swipes
// @route   GET /api/swipes
// @access  Private
const getSwipes = async (req, res) => {
    try {
        const swipes = await Swipe.find({ swiper: req.user._id })
            .populate('swiped', 'firstName lastName photos')
            .populate('position', 'title company');
        res.json(swipes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createSwipe,
    getSwipes
}; 