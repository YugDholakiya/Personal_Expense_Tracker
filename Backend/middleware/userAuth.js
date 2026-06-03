const jwt = require('jsonwebtoken');
const cookie_parser = require('cookie-parser'); 
const express = require("express");
require('dotenv').config();

const app = express();
app.use(cookie_parser());


const userAuth = async (req,res,next)=>{
    try {
        console.log(req.cookies);
console.log(req.headers.cookie);
        const { token } = req.cookies;

        console.log(token);


        if(!token){
            console.log("hii")
            return res.status(401).json({ error: "Login/Register First" });
        }

        const payload = jwt.verify(token, process.env.KEY);

        req.payload = payload;

        next();

    } catch (err) {
        return res.status(401).json({ error: "Unauthorized", details: err.message });
    }
}

module.exports = userAuth;