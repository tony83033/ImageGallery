const express = require('express');
const Users = require('../models/Users');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const router = express.Router();
const { body, validationResult } = require('express-validator');

router.post('/sign',
    [body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be more then 5 char').isLength({ min: 5 })
    ]
    , async (req, res) => {
        console.log(req.body);
        const { name, email, password } = req.body;
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(200).json({ error: error.array() });
        }
        try {
            var EmailAlreadyExiest = await Users.findOne({ email: email });
            console.log(EmailAlreadyExiest)
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }

        if (EmailAlreadyExiest) {
            return res.status(200).json({ message: "Sorry! this Email already exiest", success: false });
        }

        // Encrypt password
        var encPass = CryptoJS.AES.encrypt(password, "fromthemackersofhackerstower").toString();
        console.log("Encrypting successfull", encPass)

        // saving user data in Database
        const newUser = await Users.create({
            name: name,
            email: email,
            password: encPass
        });

        // jwt token
        const data = {
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }

        }
        const authToken = jwt.sign(data, "super");
        res.cookie('auth',authToken);
        return res.status(200).redirect('/');

    });

// login route

router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Pls Enter password').exists()

], async (req, res) => {

    const { name, email, password } = req.body;

    try {
        var user = await Users.findOne({ email: email });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!user) {
        return res.status(200).json({ message: "Invalid Credentials", success: false })
    } else {
        var bytes = CryptoJS.AES.decrypt(user.password, 'fromthemackersofhackerstower');
        var originalPass = bytes.toString(CryptoJS.enc.Utf8);

        if (password == originalPass) {
            // CREATING JWT TOKEN

            const data = {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            }
            const auhtoken = jwt.sign(data,"super");
            res.cookie('auth',auhtoken);
        return res.status(200).redirect('/');
        }else{
            return res.status(200).json({ message: "Invalid Credentials", success: false })
        }
       
    }





});
router.get('/logout', (req, res) => {
    // Clear the cookie named 'auth'
    res.clearCookie('auth');
    
    // Redirect or send response as needed
    res.redirect('/'); // For example, redirect to the login page after logout
  });
  

router.post('/getuser', fetchuser, async (req,res)=>{
    try {
       const userId = req.user.id;
       const user  = await Users.findById(userId).select("-password");
       ;
       res.status(200).json(user);

    } catch (error) {
        res.status(500).json({error:"Internal server error"});
    }
})


module.exports = router;