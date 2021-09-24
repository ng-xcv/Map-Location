const mongoose = require('mongoose');
const express = require('express');
const app = express();

require('dotenv').config();

const pinRoute = require('./routes/pins')
const userRoute = require('./routes/user')

app.use(express.json());
app.use('/api/pins', pinRoute);
app.use('/api/user', userRoute);

mongoose.connect( process.env.URL, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() =>  console.log('Database connected !'))
    .catch((err) => console.log(err));


app.listen(process.env.BACKEND_PORT, () => console.log('\nServer is running...'));