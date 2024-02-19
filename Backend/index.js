const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.urlencoded({ extended: true }));

main()
    .then(() => {
        console.log("success");
    }).catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/AtomUser");
};



app.listen('8080', () => {
    console.log("Server is listening to port 8080");
});