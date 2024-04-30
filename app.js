const express = require("express");
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('./routes/user-routes.js');
const cookieParse = require('cookie-parser');


const app = express();
app.use(cookieParse());
app.use(express.json());
app.use('/app' , router);



mongoose.connect(process.env.MongoDB_URL).then(() => {
    app.listen(5000, () => {
        console.log("Server has started! and i am listning to port 5000");
    })
});

