const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../../db/db');


/**
 * Get a plant by its Latin name
 * @swagger
 * /plant/latin/{plantName}:
 *   get:
 *     summary: Get a plant by its Latin name
 *     description: Retrieve a plant from the database based on its Latin name.
 *     tags:
 *       - Plant
 *     parameters:
 *       - in: path
 *         name: plantName
 *         required: true
 *         description: The Latin name of the plant.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plant found
 *       404:
 *         description: Plant not found
 *       500:
 *         description: Failed to retrieve plant from MongoDB
 */
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


/**
 * Get a plant by its ID
 * @swagger
 * /plant/{plantId}:
 *   get:
 *     summary: Get a plant by its ID
 *     description: Retrieve a plant from the database based on its ID.
 *     tags:
 *       - Plant
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         description: The ID of the plant.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plant found
 *       404:
 *         description: Plant not found
 *       500:
 *         description: Failed to retrieve plant from MongoDB
 */
router.get('/:plantId', (req, res) => {
    const plantId = req.params.plantId;

    const db = getDB();
    const collection = db.collection('plant');
    
    collection.findOne({ _id: new ObjectId(plantId) })
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


/**
 * Get all plants
 * @swagger
 * /plant:
 *   get:
 *     summary: Get all plants
 *     description: Retrieve all plants from the database.
 *     tags:
 *       - Plant
 *     responses:
 *       200:
 *         description: List of plants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plant'
 *       500:
 *         description: Failed to retrieve plants from MongoDB
 */
router.get('/', (req, res) => {
    const db = getDB();
    const collection = db.collection('plant');
    
    collection.find({}).toArray()
    .then(plants => {
      res.status(200).json(plants);
    })
    .catch(err => {
      console.error('Failed to retrieve plants from MongoDB:', err);
      res.status(500).send('Failed to retrieve plants from MongoDB');
    });
});

module.exports = router;