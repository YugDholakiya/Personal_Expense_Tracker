const express = require('express');
const validateUser = require("../middleware/validateUser");
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const userAuth = require('../middleware/userAuth');
const sendEmail = require("../controllers/sendEmail")
const redisClient = require("../config/redis")
require('dotenv').config();

const app = express();
app.use(express.json());

const auth = express.Router();

auth.post('/register', async (req, res) => {
    try {
        validateUser(req.body);
        req.body.email = req.body.email.toLowerCase();

        // Delete any existing OTP for this email to allow immediate re-request
        await redisClient.del(`otp:${req.body.email}`);
        await redisClient.del(`user:${req.body.email}`);

        req.body.password = await bcrypt.hash(req.body.password, 10);

        const emailSend = await sendEmail(req.body);

        if (!emailSend) {
            throw new Error("Unable to send Email")
        }

        res.json({ success: true });
        //res.status(200).send("Otp is sended to your email");

    } catch (err) {
        res.status(500).send({ title: "error", message: err.message })
    }
})

auth.post('/verifyEmail', async (req, res) => {
    try {
        const requiredFields = ['email', 'otp'];

        const isAllow = requiredFields.every((k) => Object.keys(req.body).includes(k));

        if (!isAllow) {
            throw new Error("Both Fields are must");
        }

        const email = req.body.email.toLowerCase().trim();
        const otp = req.body.otp.trim();

       ;

        let storedOtp

        try {
            storedOtp = await redisClient.get(`otp:${email}`);
        } catch (err) {
            throw new Error("Not Getting the Redis Output");
        }

        if (!storedOtp) {
            throw new Error("Invalid Credential")
        }

        console.log("Comparison: storedOtp (", storedOtp, ") vs userOtp (", otp, ")");
        if (storedOtp !== otp)
            throw new Error("Invalid OTP");

        const userRawData = await redisClient.get(`user:${email}`);
        
        
        if (!userRawData) {
            throw new Error("User Detail not found in Redis");
        }

        await redisClient.del(`otp:${email}`);
        await redisClient.del(`user:${email}`);

        const userinfo = JSON.parse(userRawData);;

        //userData = {...userData,...userinfo};
        const createdUser = await user.create(userinfo);
       

        res.json({ success: true });
        //res.status(200).send("Registered Succesfully");

    } catch (err) {
        res.status(500).send({msg: err.message});
    }
})

auth.post('/login', async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            throw new Error("Invalid ");
        }
        
        const detail = await user.findOne({ email: req.body.email.toLowerCase() });
        console.log("hii");
        if (!detail) {
            throw new Error("Invalid Creden");
        }

        const isAllow = await bcrypt.compare(req.body.password, detail.password);

        if (!isAllow) {
            throw new Error("Invalid Credentials");
        }

        //jwt token
        const token = jwt.sign({ name: detail.name, _id: detail.id }, process.env.KEY, { expiresIn: 86400 });
        
        // Set cookie with appropriate security settings based on environment
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,  // true in production (HTTPS), false in development
            path: "/"
        });

        res.json({ success: true });

        //res.status(200).send({title:"Login",message:"Login Succesfully"});

    } catch (err) {
        res.status(500).send({ title: "Error", message: err.message });
    }
})

auth.post('/logout', userAuth, async (req, res) => {
    try {
        const token = jwt.sign({ name: "xyz" }, process.env.KEY, { expiresIn: 0 });
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            path: "/"
        });
        res.json({ msg: "Logout Successfully" });
    } catch (err) {
        res.status(500).send({ title: "Error", messsage: err.message });
    }
})

auth.get('/status', async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.json({ loggedIn: false });
        const payload = jwt.verify(token, process.env.KEY);
        if (!payload || !payload.name) return res.json({ loggedIn: false });
        res.json({ loggedIn: true, name: payload.name });
    } catch (err) {
        // Token expired or invalid
        res.json({ loggedIn: false });
    }
});

module.exports = auth;