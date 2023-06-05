const express = require('express');
const app = express();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const serviceAccount = require(`./${process.env.SERVICE_ACCOUNT}`);

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'BotaniAI',
        version: '1.0.0',
      },
    },
    apis: ['./routes/plant/*.js', './routes/user/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({
  limit: '500mb'
}));

const runDB = async () => {
    const { connectDB } = require('./db/db');
    await connectDB();
};
runDB();

const plantGetRoutes = require('./routes/plant/get');
const userGetRoutes = require('./routes/user/get');
const userPostRoutes = require('./routes/user/post');
const userPutRoutes = require('./routes/user/put');
const userDeleteRoutes = require('./routes/user/delete');

app.use('/plant', plantGetRoutes);
app.use('/user', userGetRoutes);
app.use('/user', userPostRoutes);
app.use('/user', userPutRoutes);
app.use('/user', userDeleteRoutes);

const PORT = 3000;

app.listen(PORT, (error) => {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: `${process.env.STORAGE_BUCKET}`,
          databaseURL: process.env.FIREBASE_DATABASE_URL
        })

        if(!error) console.log("Server is Successfully Running, and App is listening on port "+ PORT)
        else console.log("Error occurred, server can't start", error);
    }
);