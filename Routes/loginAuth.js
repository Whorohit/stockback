const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const login = require('../models/Loginmodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../Middleware/Fetchuser')
const nodemailer = require("nodemailer");
const multer = require('multer')
const multerupload = multer({
    limits: {
        fieldSize: 1024 * 1024 * 5
    }
})

const multersingle = multerupload.single("userprofile")

const tokenkey = "mynamrisrohit"

router.post('/auth/signup', [
    body('firstname', 'should  be greater than 5 character').isLength({ min: 3 }),
    body('lastname', 'should  be greater than 5 character').isLength({ min: 3 }),
    body('email', 'enter the vaild email').isEmail(),
    body('password', 'enter the strong password').isLength(
        { min: 7 },
    )
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors });
    }
    const { email, password, lastname, firstname } = req.body
    try {
        let usr = await login.findOne({ email: req.body.email })
        if (usr) {
            return res.status(400).json({ success: false, errors: "email id already Exists use differnent id" });
        }
        // const salt = await bcrypt.genSalt(10);
        // console.log();
        console.log(req.body);
        console.log(password);
        const pass = await bcrypt.hash(password, 10);
        console.log(pass);
        const user = await login.create({
            firstname: firstname,
            lastname: lastname,
            password: pass,
            email: email,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        // console.log(data);
        var token = await jwt.sign(data, tokenkey, {
            expiresIn: '30m'
        });
        success = true
        res.json({ success: true, token, id: user.id, firstname: user.firstname, })
        console.log(user)

    }
    catch (error) {
        res.status(200).send({ success: false, errors: "techincal error bro" })

    }
})
router.post('/auth/login', [
    body('email', 'email should  be proper ').isEmail(),
    body('password', 'password should be greater  than   7 characters').isLength({ min: 7 })
],
    async (req, res) => {
        const errors = validationResult(req);
        let success = false
        if (!errors.isEmpty) {
            return res.status(400).json({ errors: errors.array(), success: false });
        }
        const { email, password } = req.body
        try {
            let user = await login.findOne({ email })
            if (!user) {
                return res.status(400).json({ success, errors: "enter with correct user name and  password" });

            }
            console.log(user);
            const pascomapre = await bcrypt.compare(password, user.password);
            console.log(pascomapre);
            if (!pascomapre) {
                return res.status(400).json({ success: false, errors: "enter with ddd correct user name and  password" });

            }
            const data = {
                user: {
                    id: user.id
                }
            }
            var token = await jwt.sign(data, tokenkey, {
                expiresIn: '30m'
            });
            success = true
            let userinfo = await login.findOne({ email }).select("-password")
            res.status(200).json({ success: true, token, id: user._id, userinfo: userinfo })
            console.log(user, token, 'ttt')

        } catch (error) {
            res.status(500).send({ errors: "techincal error", success: false })
        }
    })

router.post('/auth/updateuserinfo', multersingle, [
    // body('firstname', 'title cannot be smaller than 2 characters').isLength({ min: 2 }),
    // body('lastname', 'enter the  correct amount').isLength({ min: 1 }),
    // body('dob', 'enter the vaild time!').isLength({ min: 5 }),
    // body('mobile', 'enter the vaild  price').isLength({ min: 10, max: 10 }),
    // body('pincode', 'enter the vaild   pincode').isLength({ min: 6, max: 6 }),
    // body('business', 'enter the vaild   pincode').isLength({ min: 6, max: 6 }),
    // body('address', 'enter the vaild   address').isLength({ min: 5, max: 40 }),
    // body('email', 'enter the vaild   Email id').isEmail({ max: 40 }),

], fetchuser, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array(), success: false });
    }
    const { firstname, lastname, pincode, mobile, business, email, dob, address, userprofile, newsapi, stockapi } = req.body
    try {
        const userid = req.user;
        let updateuserinfo = {}

        if (firstname) { updateuserinfo.firstname = firstname }
        if (dob) { updateuserinfo.dob = dob }
        if (lastname) { updateuserinfo.lastname = lastname }
        if (pincode) { updateuserinfo.pincode = pincode }
        if (mobile) { updateuserinfo.mobile = mobile }
        if (business) { updateuserinfo.business = business }
        if (email) { updateuserinfo.email = email }
        if (address) { updateuserinfo.address = address }
        if (userprofile) {
            updateuserinfo.userprofile = req.file
        }
        if (newsapi) {
            updateuserinfo.newsapi = newsapi
        }
        if (stockapi) {
            updateuserinfo.stockapi = stockapi
        }
        const user = await login.findByIdAndUpdate(req.user, { $set: updateuserinfo }, { new: true })


        console.log("helllll");
        res.json({ message: "Changed info successfully", success: true })
    } catch (error) {
        next(error)
    }
})
router.post('/auth/pass', fetchuser, async (req, res) => {
    let success = false
    if (!req.body.password)
        return res.status(400).json({ success: false, errors: "enter with correct user name and  password" });

    try {

        const userid = req.user;
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(req.body.password, salt);

        const user = await login.findByIdAndUpdate(userid, { password: pass }, { new: true })
        res.json(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
router.post('/auth/email',
    [
        body('email', 'email should  be proper ').isEmail(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        let success = false
        if (!errors.isEmpty) {
            return res.status(400).json({ errors: errors.array(), success: false });
        }
        const { email } = req.body
        try {
            let user = await login.findOne({ email })
            if (!user) {
                return res.status(400).json({ success, errors: "Email doesn't Exists " });

            }
            const transporter = nodemailer.createTransport({
                service: "gmail",
                // host: "",
                port: 465,
                secure: true,
                auth: {
                    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                    user: "ram211296@gmail.com",
                    pass: "qgajxrisogbplmkf",
                },
            });
            const info = await transporter.sendMail({
                from: '"Fred Foo 👻" <chhayaccx@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                // html body
            });
            success = true
            res.status(200).json({ success, info: info.messageId })
            console.log(info.messageId)


        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })
router.get('/auth/getuser', fetchuser
    , async (req, res) => {
        try {
            let user = await login.findById(req.user).select("-password")
            if (!user) {
                return res.status(400).json({ success, errors: "Email doesn't Exists " });

            }
            success = true
            res.status(200).json({ success, user: user })



        } catch (error) {
            console.error(error.message);
            res.status(200).send({ success: false, message: "Internal Server Error" });
        }
    })



module.exports = router