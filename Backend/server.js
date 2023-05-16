const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const runDB = async () => {
    const { connectDB } = require('./db/db');
    await connectDB();
};
runDB();

let userRouter = require('./routes/user');
let userPlantRouter = require('./routes/userPlant');
let plantRouter = require('./routes/plant');

app.use('/user', userRouter);
app.use('/user/plant', userPlantRouter);
app.use('/plant', plantRouter);

const PORT = 3000;

app.listen(PORT, (error) => {
        if(!error) console.log("Server is Successfully Running, and App is listening on port "+ PORT)
        else console.log("Error occurred, server can't start", error);
    }
);