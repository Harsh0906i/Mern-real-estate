const express = require('express');
const verifyUser = require('../utils/verifyUser');
const router = express.Router();
let Listing = require('../models/listing');
const errorHandeler = require('../utils/error');

router.post('/create', verifyUser, async (req, res, next) => {
    try {
        const createdListing = await Listing.create(req.body);
        return res.status(200).send(createdListing);
    } catch (error) {
        console.log(error)
        next(error);
    }
});

router.delete('/delete/:id', verifyUser, async (req, res, next) => {//req.user.id comming from verifyUser
    const listing = await Listing.findById(req.params.id);
    console.log(req.params.id);
    if (!listing) {
        return next(errorHandeler(404, 'Listing not found'));
    }
    if ((req.user.id || req.user._id) !== listing.userRef) {
        return next(errorHandeler(401, 'You can delete your own listing!'));
    }
    try {
        const deletedListing = await Listing.findByIdAndDelete(req.params.id);
        console.log(deletedListing);
        res.status(200).json('Listing has been deleted!');
    } catch (error) {
        next(error);
    }
});

router.post('/update/:id', verifyUser, async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandeler(404, 'Listing not found'));
    }
    if ((req.user.id || req.user._id) !== listing.userRef) {
        return next(errorHandeler(401, 'You can update your own listing!'));
    }
    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id,
            req.body, { new: true })
        res.status(200).json(updatedListing)
    } catch (error) {
        next(error)

    }
})
router.get('/getListing/:id', async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandeler(404, 'Listing not found'));
        }
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
})
router.get('/get', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;

        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;

        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);
        console.log(listings)
        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
})
module.exports = router
