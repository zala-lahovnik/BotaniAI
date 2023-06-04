const express = require('express');
const router = express.Router();
const { getDB } = require('../../db/db');


/**
 * Delete a plant from user's personal garden
 * @swagger
 * /user/{userId}/personal-garden/{plantId}:
 *   delete:
 *     summary: Delete a plant from user's personal garden
 *     description: Delete a plant from the personal garden of a user.
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
 *     responses:
 *       200:
 *         description: Plant deleted successfully from personal garden
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to delete plant from personal garden
 */
router.delete('/:userId/personal-garden/:plantId', async (req, res) => {
    try {
        const db = getDB();
        const userId = req.params.userId;
        const plantId = req.params.plantId;

        const userCollection = db.collection('user');

        const user = await userCollection.findOne({ _id: userId });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const personalGarden = user.personalGarden;
        const updatedGarden = personalGarden.filter(obj => obj._id.toString() !== (plantId));

        await userCollection.updateOne(
            { _id: userId },
            { $set: { personalGarden: updatedGarden } }
        );
    } catch (err) {
        console.error('Failed to delete plant from personal garden:', err);
        res.status(500).send('Failed to delete plant from personal garden');
    };
});

module.exports = router;