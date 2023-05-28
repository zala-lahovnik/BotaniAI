const express = require('express');
const router = express.Router();
const { getDB } = require('../../db/db');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


/**
 * Update a plant in user's personal garden
 * @swagger
 * /user/{userId}/personal-garden/{plantId}:
 *   put:
 *     summary: Update a plant in user's personal garden
 *     description: Update the custom name and watering attributes of a plant in the personal garden of a user.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user.
 *         schema:
 *           type: string
 *       - in: path
 *         name: plantId
 *         required: true
 *         description: The ID of the plant.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customName:
 *                 type: string
 *               firstDay:
 *                  type: string
 *               numberOfDays:
 *                  type: number
 *               wateringArray:
 *                  type: array
 *                  items:
 *                      properties:
 *                          date:
 *                              type: string
 *                          watered:
 *                              type: boolean
 *                          amountOfWater:
 *                              type: number
 *     responses:
 *       200:
 *         description: Plant attributes updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to update plant attributes
 */
router.put('/:userId/personal-garden/:plantId', upload.none(), (req, res) => {
    const db = getDB();
    const userId = req.params.userId;
    const plantId = req.params.plantId;
    const { customName, firstDay, numberOfDays, wateringArray } = req.body;

    const watering = {
        firstDay: firstDay,
        numberOfDays: numberOfDays,
        wateringArray: wateringArray
    }

    const userCollection = db.collection('user');

    userCollection.findOne({ _id: userId })
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found');
            }

            const personalGarden = user.personalGarden;
            const updatedGarden = personalGarden.map(obj => {
                if (obj._id.toString() === plantId) {
                    obj.customName = customName;
                    obj.watering = watering;
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


/**
 * Update user notifications
 * @swagger
 * /user/{userId}:
 *   put:
 *     summary: Update user notifications
 *     description: Update the notification settings for a user.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notifications:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notifications updated
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to update notifications
 */
router.put('/:userId', upload.none(), (req, res) => {
    const db = getDB();
    const userId = req.params.userId;
    const { notifications } = req.body;

    const userCollection = db.collection('user');

    userCollection.findOne({ _id: userId })
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found');
            }

            userCollection.updateOne(
                { _id: userId },
                { $set: { notifications: notifications } }
            )
            .then(() => {
                res.status(200).send('Notifications updated');
            })
            .catch(err => {
                console.error('Failed to update notifications:', err);
                res.status(500).send('Failed to update notifications');
            });
        })
        .catch(err => {
            console.error('Failed to find user:', err);
            res.status(500).send('Failed to find user');
        });
});

module.exports = router;