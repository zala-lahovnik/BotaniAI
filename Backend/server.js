const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
        if(!error) console.log("Server is Successfully Running, and App is listening on port "+ PORT)
        else console.log("Error occurred, server can't start", error);
    }
);