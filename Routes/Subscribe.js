const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Subscription = require('../Schemas/Subscription'); // Adjust the path as needed

// Create a new subscription
router.post('/subscriptions', async (req, res) => {
    try {
        const { subscriberId, subscribedToId } = req.body;

        const newSubscription = new Subscription({
            _id: uuidv4(),
            subscriberId,
            subscribedToId,
            createdAt: Date.now()
        });

        await newSubscription.save();
        res.status(201).json({ message: 'Subscription created successfully', data: newSubscription });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all subscriptions for a subscriber
router.get('/subscriptions/:subscriberId', async (req, res) => {
    try {
        const { subscriberId } = req.params;
        const subscriptions = await Subscription.scan('subscriberId').eq(subscriberId).exec();
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a subscription
router.delete('/subscriptions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Subscription.delete({ _id: id });
        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;