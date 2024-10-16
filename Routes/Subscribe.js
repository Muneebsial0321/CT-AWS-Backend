const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Subscription = require('../Schemas/Subscription'); // Adjust the path as needed
const User = require('../Schemas/User'); // Adjust the path as needed

// Create a new subscription
router.post('/', async (req, res) => {
    try {
        const { subscriberId, subscribedToId } = req.body;
        const results = await Subscription.scan("subscriberId")
        .eq(subscriberId) // Query based on subscriberId
        .where("subscribedToId")
        .eq(subscribedToId) // Query based on subscribedToId
        .exec();
        if(results.length==0){

            const newSubscription = new Subscription({
                _id: uuidv4(),
                subscriberId,
                subscribedToId,
                createdAt: Date.now()
            });
            
            await newSubscription.save();
            res.status(201).json({ message: 'Subscription created successfully', data: newSubscription });
        }
        else{
            res.json({message:"already subscribed"})
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all subscriptions
router.get('/', async (req, res) => {
    try {
        const subscriptions = await Subscription.scan().exec();
        res.status(200).json({count:subscriptions.length,data:subscriptions});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// gets my subscribers
router.get('/my/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const subscriptions = await Subscription.scan('subscribedToId').eq(id).exec();
        const data = await Promise.all(subscriptions.map(async (e) =>{
            const user = await User.get(e.subscriberId)
            return {
                ...e,user  }
                
            }))
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// gets people whom i subscribed to
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const subscriptions = await Subscription.scan('subscriberId').eq(id).exec();
        const data = await Promise.all(subscriptions.map(async (e) =>{
            const user = await User.get(e.subscriberId)
            return {
                ...e,user  }
                
            }))
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a subscription
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Subscription.delete({ _id: id });
        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
