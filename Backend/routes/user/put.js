const express = require("express");
const router = express.Router();
const { getDB } = require("../../db/db");
const multer = require("multer");
const authenticateToken = require("../../middleware/authMiddleware");

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               customName:
 *                 type: string
 *               firstDay:
 *                  type: string
 *               numberOfDays:
 *                  type: number
 *               amountOfWater:
 *                  type: number
 *               description:
 *                  type: string
 *               wateringArray:
 *                  type: array
 *                  items:
 *                      properties:
 *                          date:
 *                              type: string
 *                          watered:
 *                              type: boolean
 *               image:
 *                  type: string
 *     responses:
 *       200:
 *         description: Plant attributes updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to update plant attributes
 */
router.put(
  "/:userId/personal-garden/:plantId", 
  authenticateToken,
  upload.none(),
  async (req, res) => {
    try {
      const db = getDB();
      const userId = req.params.userId;
      const plantId = req.params.plantId;
      const {
        customName,
        firstDay,
        numberOfDays,
        amountOfWater,
        wateringArray,
        image,
        description,
      } = req.body;

      const watering = {
        firstDay: firstDay,
        numberOfDays: numberOfDays,
        amountOfWater: amountOfWater,
        wateringArray: wateringArray,
      };

      const userCollection = db.collection("user");

      const user = await userCollection.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send("User not found");
      }

      const personalGarden = user.personalGarden;
      const updatedGarden = personalGarden.map((obj) => {
        if (obj._id.toString() === plantId) {
          obj.customName = customName;
          obj.watering = watering;
          obj.image = image;
          obj.description = description;
        }
        return obj;
      });

      await userCollection.updateOne(
        { _id: userId },
        { $set: { personalGarden: updatedGarden } }
      );
      res.status(200).send("Plant common attribute updated");
    } catch (err) {
      console.error("Failed to update plant", err);
      res.status(500).send("Failed to update plant");
    }
  }
);

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
router.put("/:userId", authenticateToken, upload.none(), async (req, res) => {
  try {
    const db = getDB();
    const userId = req.params.userId;
    const { notifications } = req.body;

    const userCollection = db.collection("user");

    const user = await userCollection.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    await userCollection.updateOne(
      { _id: userId },
      { $set: { notifications: notifications } }
    );
    res.status(200).send("Notifications updated");
  } catch (err) {
    console.error("There was an error updating user:", err);
    res.status(500).send("There was an error updating user");
  }
});

module.exports = router;
