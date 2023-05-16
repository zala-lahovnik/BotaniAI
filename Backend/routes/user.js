const express = require('express');
const router = express.Router();
const multer = require('multer');
const { ObjectId } = require('mongodb');
const { getDB } = require('../db/db');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add', upload.none(), (req, res, next) => {
    const userId = req.body.userId;
  
    const db = getDB();
    const collection = db.collection('user');

    const newUser = {
        _id: userId,
        plants: []
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

module.exports = router;