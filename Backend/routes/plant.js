const express = require('express');
const router = express.Router();
const { getDB } = require('../db/db');

router.get('/latin/:plantName', (req, res) => {
    const latinName = decodeURIComponent(req.params.plantName);

    const db = getDB();
    const collection = db.collection('plant');
    
    collection.findOne({ latin: latinName })
    .then(plant => {
      if (!plant) {
        return res.status(404).send('Plant not found');
      }
      res.status(200).json(plant);
    })
    .catch(err => {
      console.error('Failed to retrieve plant from MongoDB:', err);
      res.status(500).send('Failed to retrieve plant from MongoDB');
    });
});

module.exports = router;