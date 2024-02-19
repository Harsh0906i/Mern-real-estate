let express = require('express');
const router = express.Router();
const app = express();
const userSchema = require('../models/user');
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

router.post('/signup', async (req, res, next) => {
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
});
router.post('/signin', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const Valid = await userSchema.findOne({ email });
        if (!Valid) {
            return res.status(404).send('User not found');
        }
        const validPassword = await bcrypt.compare(password, Valid.password);

        if (!validPassword) {
            res.status(404).send('Wrong credentials!');
        }
        const token = jwt.sign({ id: Valid._id }, process.env.JWT)
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(Valid);

    } catch (error) {
        next(error);
    }
})
module.exports = router