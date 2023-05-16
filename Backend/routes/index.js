const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getDB } = require('../db/db');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.any(), async (req, res, next) => {
  const userId = req.body.userId; // userId => id userja iz firebasa
  const { originalname, mimetype, buffer } = req.files[0];
  const { title } = req.body;

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
        plants: { title: title, image: newImage }
      }
    }
  )
  .then(() => {
    res.status(200).send(`Image saved to MongoDB, user: ${userId}`);
  })
  .catch(err => {
    console.error('Failed to save image to MongoDB:', err);
    res.status(500).send('Failed to save image to MongoDB');
  });
});

router.get('/plants/:userId', (req, res) => {
  const userId = req.params.userId;

  const db = getDB();
  const collection = db.collection('user');

  collection.findOne({ _id: userId })
  .then(user => {
    if (!user || !user.plants) {
      return res.status(404).send('User or plants not found');
    }
    res.status(200).json(user.plants);
  })
  .catch(err => {
    console.error('Failed to retrieve plants from MongoDB:', err);
    res.status(500).send('Failed to retrieve plants from MongoDB');
  });
});

module.exports = router;