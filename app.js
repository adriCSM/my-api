require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./router/index.js'));
mongoose
    .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log(`connection Database is Successfully`);
    })
    .catch((err) => {
        console.log(`DB error: ${err.message} `);
    });

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server run at http://localhost:${port}`);
});
