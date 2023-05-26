const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../../db/db');

router.delete('/:userId/personal-garden/:plantId', (req, res) => {
    const db = getDB();
    const userId = req.params.userId;
    const plantId = req.params.plantId;

    const userCollection = db.collection('user');

    userCollection.findOne({ _id: userId })
    .then(user => {
        if (!user) {
            return res.status(404).send('User not found');
        }

        const personalGarden = user.personalGarden;
        const updatedGarden = personalGarden.filter(obj => !obj._id.toString() === (plantId));

        userCollection.updateOne(
        { _id: userId },
        { $set: { personalGarden: updatedGarden } }
        )
        .then(() => {
            res.status(200).send('Plant deleted from personal garden');
        });
    })
    .catch (err => {
        console.error('Failed to delete plant from personal garden:', err);
        res.status(500).send('Failed to delete plant from personal garden');
    });
});

module.exports = router;