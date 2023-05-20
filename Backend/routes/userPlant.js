const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const multer = require('multer');
const { getDB } = require('../db/db');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add', upload.any(), (req, res, next) => {
  const { originalname, mimetype, buffer } = req.files[0];
  const { userId, latin, common, description, intervalZalivanja, prviDanZalivanja } = req.body;

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

router.get('/personalGarden/:userId', (req, res) => {
  const userId = req.params.userId;

  const db = getDB();
  const collection = db.collection('user');

  collection.findOne({ _id: userId })
  .then(user => {
    if (!user || !user.personalGarden) {
      return res.status(404).send('User or plants not found');
    }
    res.status(200).json(user.personalGarden);
  })
  .catch(err => {
    console.error('Failed to retrieve plants from MongoDB:', err);
    res.status(500).send('Failed to retrieve plants from MongoDB');
  });
});


router.get('/history/:userId', (req, res) => {
  const userId = req.params.userId;

  const db = getDB();
  const userCollection = db.collection('user');
  const plantCollection = db.collection('plant');

    userCollection.findOne({ _id: userId })
    .then(user => {

      if (!user) {
        return res.status(404).send('User not found');
      }

      const plantIds = user.history.map(obj => new ObjectId(obj.plantId));

      plantCollection.find({ _id: { $in: plantIds } }).toArray()
      .then(plants => {

        const userPlants = user.history.map(obj => {
          const plant = plants.find(p => p._id.equals(obj.plantId));
          return {
            plantId: obj.plantId,
            customName: obj.customName,
            intervalZalivanja: obj.intervalZalivanja,
            prviDanZalivanja: obj.prviDanZalivanja,
            date: obj.date,
            image: obj.image,
            plant: plant || null
          };
        });
        res.status(200).json(userPlants);
      });
    })
    .catch(err => {
      console.error('Failed to retrieve user\'s plants:', err);
      res.status(500).send('Failed to retrieve user\'s plants');
    });
});

module.exports = router;