const express = require('express');
const errorHandeler = require('../utils/error');
const router = express.Router();
const bcrypt = require('bcrypt');
const userSchema = require('../models/user');
const verifyUser = require('../utils/verifyUser');
const Listing = require('../models/listing');
router.post('/update/:id', verifyUser, async (req, res, next) => {
    if ((req.user.id || req.user._id) !== req.params.id) {
        return next(errorHandeler(401, 'You can update your own account'))
    }
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hash(req.body.password, 10)
        }
        const updatedUser = await userSchema.findByIdAndUpdate(req.params.id, {//req.params.id is object id of mongo db
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true })

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error)
        console.log(error)
    }
});

router.delete('/delete/:id', verifyUser, async (req, res, next) => {
    if ((req.user.id || req.user._id) !== req.params.id) {
        return res.json('you can only delete your own account');
    }
    try {
        await userSchema.findByIdAndDelete(req.params.id);
        res.status(200).json('user has been deleted!');
    } catch (error) {
        next(error)
    }
});

router.get('/listing/:id', verifyUser, async (req, res, next) => {
    if ((req.user.id || req.user._id) === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listings);
        } catch (error) {
            next(error);
        }
    } else {
        return next(errorHandeler(401, 'You can only view your own listings!'));
    }
});


router.get('/:id', verifyUser, async (req, res, next) => {
    try {
        const user = await userSchema.findById(req.params.id);
        if (!user) {
            next(errorHandeler(404, 'User not found'));
            return;
        }

        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
})




module.exports = router