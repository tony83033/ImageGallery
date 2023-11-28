const express = require('express');
const Users = require('../models/Users');
const Image = require('../models/Image');
const CryptoJS = require("crypto-js");
const path = require('path')
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer')
const router = express.Router();



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = './public/images';
        console.log('Destination:', path.resolve(dest));
        cb(null, dest)
    },
    filename: function (req, file, cb) {
        

        cb(null, `${uuidv4()}-${file.originalname}`);
    }
})

const upload = multer({ storage: storage })


router.post('/image', fetchuser, upload.single('image'), async (req, res) => {
    console.log("This is from image router req.body",req.body);
    console.log(req)
    console.log(req.file)
    const email = req.user.email;
    const data = await Image.create({
        email: email,
        filename:req.file.filename,
        path: req.file.path
    })
    console.log(data);
    return res.status(200).json({ message: "working fine" });
});

router.get('/getallImages',fetchuser , async(req,res)=>{
    const userEmail = req.user.email;
    console.log(userEmail)
    const allImages = await Image.find({email:userEmail});
    console.log(allImages)
    return res.status(200).json({images:allImages});
    

})

module.exports = router;