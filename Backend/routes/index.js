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

module.exports = router;