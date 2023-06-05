const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DATABASE_URI;

let db;
async function connectDB() {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
        db = client.db('BotaniAI');
        console.log('Connection to db successful');        
        return client;
    } catch (error) {
      console.error('Error connecting to the database:', error);
      throw error;
    }
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };