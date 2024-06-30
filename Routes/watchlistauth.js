const express = require('express')
const router = express.Router();
const fetchuser = require('../Middleware/Fetchuser')
const watchlist = require("../models/Watchlist")
const { body, validationResult } = require('express-validator');


router.post('/api/createwatchlist', fetchuser, [
    body('watchlistname', 'title cannot be smaller than 1 characters').isLength({ min: 1 }),
], async (req, res) => {
    try {
        const { watchlistname } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(),success:false });

        }
        const createnote = new watchlist({ watchlistname, user: req.user })
        const savedata = await createnote.save();
        success = true;
        res.json({ savedata, success:true })
    } catch (error) {
        res.status(500).send({ errors: "Internal Server error",success:false  })
    }
})
router.post('/api/addwatchlist', fetchuser, [
    body('watchlistname', 'title cannot be smaller than 1 characters').isLength({ min: 1 }),
], async (req, res) => {
    try {
        const { watchlistname, stock, _id } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(),success:false });

        }
        const list = await watchlist.findOne({ _id: _id, watchlistname, user: req.user })
        if (!list) { return res.status(404).json({ errors: " watchlist does not   exists",success:false }); }
        const { share } = list
        const { svalue } = stock
        console.log(stock)
        const AlreadyLiked = share.find(({ value }) => (value === stock.value))
        if (AlreadyLiked) {
            return res.status(200).json({ errors:" watchlist  Include    Already", success:false });
        }
        let savedata = await watchlist.findOneAndUpdate(
            { user: req.user, watchlistname: watchlistname },
            { share: [...list.share, stock] }
            ,
            { new: true }
        )
        if(!savedata)
        {
            return res.status(200).json({ errors: " stock cannot added ", success:false });
        }

        res.json({success:true,message:"watchlist add successfully"})
    } catch (error) {
        res.status(500).send({ errors: "Internal Server error",success:false  })
    }
})
router.post('/api/getwatchlist', fetchuser, [
    body('watchlistname', 'title cannot be smaller than 1 characters').isLength({ min: 1 }),
], async (req, res) => {
    try {
        const { watchlistname } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });

        }
        const list = await watchlist.findOne({ watchlistname, user: req.user })
        if (!list) { return res.status(400).json({ errors: " watchlist does not include  exists",success:false }); }
        const { share } = list
        res.json({share:share})
    } catch (error) {
        res.status(500).send({ errors: "Internal Server error",success:false  })
    }
})
router.get('/api/getwatchlistnames', fetchuser, [
    body('watchlistname', 'title cannot be smaller than 1 characters').isLength({ min: 1 }),
], async (req, res) => {
    try {

        const list = await watchlist.find({ user: req.user })
        if (!list) { return res.status(400).json({ errors: " watchlist does not include  exists" }); }
        const array = list.map((data) => {
            return { _id: data._id, watchlistname: data.watchlistname }
        })
        res.json({ array: array, success: true })
    } catch (error) {
        res.status(500).send({ errors: "Internal Server error",success:false  })
    }
})
router.post('/api/remove', fetchuser, [
    body('watchlistname', 'title cannot be smaller than 1 characters').isLength({ min: 1 }),
    body('value', 'title cannot be smaller than 1 characters').isLength({ min: 1 }),
], async (req, res) => {
    try {
        const { watchlistname, value } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });

        }
        const list = await watchlist.findOne({ watchlistname, user: req.user })
        if (!list) { return res.status(400).json({ errors: " watchlist does not include  exists" }); }
        const { share } = list
        if (!share.map((data) => { return data.value }).includes(value))
             { return res.status(400).json({ errors: " watchlist does not include   the share",success:false }); }
        let array = share.filter((data) => {
            return data && data.value !== value
        })
        let savedata = await watchlist.findOneAndUpdate(
            { user: req.user, watchlistname: watchlistname },
            { share: array }
            ,
            { new: true }
        )
        res.json({savedata,success:true})
    } catch (error) {
        res.status(500).send({ errors: "Internal Server error",success:false  })
    }
})
router.post('/api/deletewatchlist', fetchuser, [
    body('watchlistname', 'title cannot be smaller than 1 characters').isLength({ min: 1 }),

], async (req, res) => {
    try {
        let success = false
        const { watchlistname } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });

        }
        const list = await watchlist.findOne({ watchlistname, user: req.user })
        if (!list) { return res.status(400).json({ errors: " watchlist does not include  exists",success:false }); }
        const { _id } = list;
        const savedata = await watchlist.deleteOne({ _id: _id, user: req.user });
        success = true
        res.json({ note: savedata, success })
    } catch (error) {
        res.status(500).send({ errors: "Internal Server error",success:false  })
    }
})


module.exports = router