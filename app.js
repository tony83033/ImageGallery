const express = require('express')
const path = require('path');
const connectDB = require('./db');
const jwt = require('jsonwebtoken');
connectDB();
const cookieParser = require('cookie-parser');
const app = express()
const port = 3000
app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views',path.resolve('./Views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.get('/',(req,res)=>{
  console.log("This is request fro index.js",req.cookies.auth);
  var data = {auth:false}
  if(req.cookies.auth!==undefined){
    
    var decoded = jwt.verify(req.cookies.auth, 'super');
  console.log(decoded) // bar
  data.auth=true;
    data = {auth:true,name:decoded.user.name,email:decoded.user.email}

  }
  console.log(data);
  return res.render("index",data);
})

app.get('/upload', (req, res) => {
  var data = {auth:false}
  if(req.cookies.auth!==undefined){
    
    var decoded = jwt.verify(req.cookies.auth, 'super');
  console.log(decoded) // bar
  data.auth=true;
    data = {auth:true,name:decoded.user.name,email:decoded.user.email}

  }
  return res.render("upload",data)
});

app.get('/health',(req,res)=>{
    res.status(200).json({message:"Everything is working Fine"});
})

app.use('/api/v1/auth',require('./routes/auth'));
app.use('/api/v1/upload',require('./routes/upload'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})