let express = require('express');
const router = express.Router();
const app = express();
const userSchema = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res,next) => {
    const { username, email, password } = req.body
    const hash = await bcrypt.hash(password, 10);
    const newUser = new userSchema({
        username: username,
        email: email,
        password: hash
    });

    try {
        await newUser.save()
        res.status(201).json('user created succesfully');
    } catch (error) {
        next(error);
    }
})
module.exports = router