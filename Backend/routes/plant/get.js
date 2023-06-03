const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { getDB } = require("../../db/db");

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
router.get("/latin/:plantName", async (req, res) => {
  const latinName = decodeURIComponent(req.params.plantName);

  try {
    const db = getDB();
    const collection = db.collection("plant");

    const plant = await collection.findOne({ latin: latinName });
    if (!plant) {
      return res.status(404).send("Plant not found");
    }
    res.status(200).json(plant);
  } catch (err) {
    console.error("Failed to retrieve plant from MongoDB:", err);
    res.status(500).send("Failed to retrieve plant from MongoDB");
  }
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
router.get("/:plantId", async (req, res) => {
  const plantId = req.params.plantId;

  try {
    const db = getDB();
    const collection = db.collection("plant");

    const plant = await collection.findOne({ _id: new ObjectId(plantId) });
    if (!plant) {
      return res.status(404).send("Plant not found");
    }
    res.status(200).json(plant);
  } catch (err) {
    console.error("Failed to retrieve plant from MongoDB:", err);
    res.status(500).send("Failed to retrieve plant from MongoDB");
  }
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
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The maximum number of plants to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: The number of plants to skip
 *     responses:
 *       200:
 *         description: List of plants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Failed to retrieve plants from MongoDB
 */
router.get("/", async (req, res) => {
  const pageParam = parseInt(req.query.pageParam) || 1;
  const limit = 15;
  const offset = (pageParam - 1) * limit;

  try {
    const db = getDB();
    const collection = db.collection("plant");

    const plants = await collection
      .find({})
      .skip(offset)
      .limit(limit)
      .toArray();
    res.status(200).json(plants);
  } catch (err) {
    console.error("Failed to retrieve plants from MongoDB:", err);
    res.status(500).send("Failed to retrieve plants from MongoDB");
  }
});

module.exports = router;
