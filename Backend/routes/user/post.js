const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../../db/db');
const multer = require('multer');
const os = require('os');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const cron = require('node-cron');
const { Expo } = require('expo-server-sdk');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 20000000,
    }
});

/**
 * Add a new user
 * @swagger
 * /user/add-user:
 *   post:
 *     summary: Add a new user
 *     description: Create a new user in the system.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               notifications:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User added successfully
 *       500:
 *         description: Failed to add new user to MongoDB
 */
router.post('/add-user', upload.none(), async (req, res, next) => {
    try {
        const { userId, name, surname, email, notifications } = req.body;
    
        const db = getDB();
        const collection = db.collection('user');

        const newUser = {
            _id: userId,
            name: name,
            surname: surname,
            email: email,
            notifications: notifications,
            history: [],
            personalGarden: []
        };

        await collection.insertOne(newUser)
        res.status(200).send('New user added to MongoDB');
    } catch(err) {
      console.error('Failed to add new user to MongoDB:', err);
      res.status(500).send('Failed to add new user to MongoDB');
    };
});


const generatAccessToken = (username) => {
    return jwt.sign({ username }, process.env.TOKEN_SECRET, {expiresIn: "30d"});
}

router.post('/generate-token', upload.none(), async (req, res, next) => {
    try {
        const { userId } = req.body;

        let token = generatAccessToken(userId);

        res.status(200).json(token);

    } catch(err) {
      console.error('Failed generate token', err);
      res.status(500).send('Failed generate token');
    };
});


/**
 * Add a plant to personal garden
 * @swagger
 * /user/add-personal-garden:
 *   post:
 *     summary: Add a plant to personal garden
 *     description: Add a new plant to the personal garden of a user.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               latin:
 *                 type: string
 *               common:
 *                 type: string
 *               customName:
 *                 type: string
 *               description:
 *                 type: string
 *               firstDay:
 *                  type: string
 *               numberOfDays:
 *                  type: number
 *               amountOfWater:
 *                  type: number
 *               wateringArray:
 *                  type: array
 *                  items:
 *                      properties:
 *                          date:
 *                              type: string
 *                          watered:
 *                              type: boolean
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plant added successfully
 *       500:
 *         description: Failed to add plant to MongoDB
 */
router.post('/add-personal-garden', authenticateToken, upload.none(), async (req, res, next) => {
    try {
        const { userId, latin, common, customName, description, firstDay, numberOfDays, amountOfWater, wateringArray, image } = req.body;

        const db = getDB();
        const collection = db.collection('user');

        const watering = {
            firstDay: firstDay,
            numberOfDays: numberOfDays,
            amountOfWater: amountOfWater,
            wateringArray: wateringArray
        }

        const addedId = new ObjectId

        await collection.updateOne(
            { _id: userId },
            {
                $push: {
                    personalGarden: { _id: addedId, latin: latin, common: common, customName: customName, description: description, watering: watering, image: image }
                }
            }
        );
        res.status(200).json({plantId: addedId});
    } catch(err) {
        console.error('Failed to add plant to MongoDB:', err);
        if (err == 'RangeError: offset is out of bounds') {
            res.send('choose smaller image');
        } else {
            res.status(500).send('Failed to add plant to MongoDB');
        }
    };
});


/**
 * Add a plant to user's history
 * @swagger
 * /user/add-history:
 *   post:
 *     summary: Add a plant to user's history
 *     description: Add a new plant to the history of a user.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               plantId:
 *                 type: string
 *               customName:
 *                 type: string
 *               date:
 *                 type: string
 *               result:
 *                  type: number
 *               latin:
 *                  type: string
 *               watering:
 *                  type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plant added successfully
 *       500:
 *         description: Failed to add plant to MongoDB
 */
router.post('/add-history', authenticateToken, upload.any(), async (req, res, next) => {
    try {
        const { userId, plantId, customName, date, result, latin, watering, image } = req.body;

        const db = getDB();
        const collection = db.collection('user');

        const fileName = userId + Date.now()
        const filePath = path.join(os.tmpdir(), fileName);
        const fileBuffer = Buffer.from(image, "base64")

        fs.writeFileSync(filePath, fileBuffer);

        const bucket = admin.storage().bucket();

        await bucket.upload(filePath, {
            // destination: filePath,
            contentType: 'image/jpeg',
        });
        console.log('Saved image to Firebase Storage ', fileName);

        fs.unlinkSync(filePath);

        const historyPlantId = new ObjectId

        await collection.updateOne(
            { _id: userId },
            {
                $push: {
                    history: { _id: historyPlantId, plantId: plantId, customName: customName, date: new Date(date), result: result, latin: latin, watering: watering, image: fileName }
                }
            }
        );
        res.status(200).send({addedId: historyPlantId, imageName: fileName});
    } catch(err) {
        console.error('Failed to add plant to MongoDB:', err);
        if (err == 'RangeError: offset is out of bounds') {
            res.send('choose smaller image');
        } else {
            res.status(500).send('Failed to add plant to MongoDB');
        }
    };
});


router.post('/fcm-token/:userId', async (req, res) => {
    const { userId } = req.params;
    const { fcmToken } = req.body;
  
    try {
        const db = getDB();
        const usersCollection = db.collection('user');
  
        const user = await usersCollection.findOneAndUpdate(
            { _id: userId },
            { $set: { fcmToken } },
            { upsert: true }
        );
  
        console.log('FCM token updated for user:', user);
            
        res.sendStatus(200);
    } catch (error) {
        console.log('Error updating FCM token:', error);
        res.sendStatus(500);
    }
});

cron.schedule('45 9 * * *', async () => {
    try {
        const db = getDB();
        const usersCollection = db.collection('user');

        const users = await usersCollection.find({ notifications: true }).toArray();
    
        users.forEach(async user => {
            const plants = user.personalGarden;
            
            let plantsToBeWatered = [];
    
            plants.forEach(plant => {
                const wateringArray = plant.watering.wateringArray;
                
                wateringArray.forEach(watering => {
                    const today = new Date().toISOString().slice(0, 10);
                    const { date, watered } = watering;
            
                    if ((date === today) && !watered) {
                        plantsToBeWatered.push(plant);
                    }
                });
            });

            if (plantsToBeWatered.length > 0) {
                await sendNotification(user.fcmToken);
            }
        });
    } catch(error) {
        console.log('Error while trying to send notifications: ' + error);
    }
});



async function sendNotification(token) {
  const expoPushToken = token;

  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.log('Invalid Expo push token:', expoPushToken);
    return;
  }

  const expo = new Expo();

  const notification = {
    to: expoPushToken,
    title: 'Plant Watering Reminder',
    body: 'Remember to water your plants!'
  };

  try {
    const response = await expo.sendPushNotificationsAsync([notification]);
    console.log('Notification sent successfully:', response);
  } catch (error) {
    console.log('Error sending notification:', error);
  }
}

module.exports = router;