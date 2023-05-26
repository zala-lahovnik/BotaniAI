const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../../db/db');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add-user', upload.none(), (req, res, next) => {
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

    collection.insertOne(newUser)
    .then(() => {
      res.status(200).send('New user added to MongoDB');
    })
    .catch(err => {
      console.error('Failed to add new user to MongoDB:', err);
      res.status(500).send('Failed to add new user to MongoDB');
    });
});

router.post('/add-personal-garden', upload.any(), (req, res, next) => {
    const { originalname, mimetype, buffer } = req.files[0];
    const { userId, latin, common, description, watering } = req.body;

    const db = getDB();
    const collection = db.collection('user');

    const newImage = {
        originalname,
        mimetype,
        buffer
    };

    collection.updateOne(
    { _id: userId },
    {
        $push: {
            personalGarden: { _id: new ObjectId, latin: latin, common: common, description: description, watering: watering, image: newImage }
        }
    }
    )
    .then(() => {
        res.status(200).send(`Plant added, user: ${userId}`);
    })
    .catch(err => {
        console.error('Failed to add plant to MongoDB:', err);
        res.status(500).send('Failed to add plant to MongoDB');
    });
});


router.post('/add-history', upload.any(), (req, res, next) => {
    const { originalname, mimetype, buffer } = req.files[0];
    const { userId, plantId, customName, intervalZalivanja, prviDanZalivanja, date } = req.body;

    const db = getDB();
    const collection = db.collection('user');

    const newImage = {
        originalname,
        mimetype,
        buffer
    };

    collection.updateOne(
    { _id: userId },
    {
        $push: {
            history: { _id: new ObjectId, plantId: plantId, customName: customName, intervalZalivanja: intervalZalivanja, prviDanZalivanja: prviDanZalivanja, date: date, image: newImage }
        }
    }
    )
    .then(() => {
        res.status(200).send(`Plant added, user: ${userId}`);
    })
    .catch(err => {
        console.error('Failed to add plant to MongoDB:', err);
        res.status(500).send('Failed to add plant to MongoDB');
    });
});

module.exports = router;