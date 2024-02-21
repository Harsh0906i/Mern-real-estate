const express = require('express');
const verifyUser = require('../utils/verifyUser');
const router = express.Router();
let Listing = require('../models/listing');

router.post('/create', verifyUser, async (req, res, next) => {
    try {
        const createdListing = await Listing.create(req.body);
        return res.status(200).json('Listing created successfully!', createdListing);
    } catch (error) {
        next(error);
    }
})
module.exports = router
