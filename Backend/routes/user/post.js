const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../../db/db');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/:userId/add-personal-garden', upload.any(), (req, res, next) => {
    const userId = req.params.userId;
    const { originalname, mimetype, buffer } = req.files[0];
    const { latin, common, description, intervalZalivanja, prviDanZalivanja } = req.body;

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
            personalGarden: { _id: new ObjectId, latin: latin, common: common, description: description, intervalZalivanja: intervalZalivanja, prviDanZalivanja: prviDanZalivanja, image: newImage }
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


router.post('/:userId/add-history', upload.any(), (req, res, next) => {
    const userId = req.params.userId;
    const { originalname, mimetype, buffer } = req.files[0];
    const { plantId, customName, intervalZalivanja, prviDanZalivanja, date } = req.body;

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