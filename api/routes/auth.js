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
        res.send(newUser);
        // res.status(201).json('user created succesfully');
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
        const token = jwt.sign({ id: Valid._id }, "cnbfR@@^bsbsdbsbg$@")
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(Valid);

    } catch (error) {
        next(error);
    }
})
router.post('/google', async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userSchema.findOne({ email })
        if (user) {
            const token = jwt.sign({ _id: user._id }, "cnbfR@@^bsbsdbsbg$@");
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(user);
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hash = await bcrypt.hash(generatedPassword, 10);
            const newUser = await new userSchema({ username: req.body.name, email: req.body.email, password: hash, avatar: req.body.photo })
            await newUser.save();
            const token = jwt.sign({ id: newUser._id },"cnbfR@@^bsbsdbsbg$@");
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(newUser);
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
});

router.post('/signout', (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
    } catch (error) {
        next(error);
    }
});


module.exports = router