const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../../db/db');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.put('/userId:/personal-garden/:plantId', upload.none(), (req, res) => {
    const db = getDB();
    const userId = req.params.userId;
    const plantId = req.params.plantId;
    const plant = req.body;

    const userCollection = db.collection('user');

    userCollection.findOne({ _id: userId })
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found');
            }

            const personalGarden = user.personalGarden;
            const updatedGarden = personalGarden.map(obj => {
                if (obj._id.toString() === plantId) {
                    obj = plant;
                }
                return obj;
            });

            userCollection.updateOne(
                { _id: userId },
                { $set: { personalGarden: updatedGarden } }
            )
            .then(() => {
                res.status(200).send('Plant common attribute updated');
            })
            .catch(err => {
                console.error('Failed to update plant common attribute:', err);
                res.status(500).send('Failed to update plant common attribute');
            });
        })
        .catch(err => {
            console.error('Failed to find user:', err);
            res.status(500).send('Failed to find user');
        });
});

module.exports = router;