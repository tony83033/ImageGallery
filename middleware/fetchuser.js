var jwt = require('jsonwebtoken');
const fetchuser = async (req,res,next)=>{
    const JWT_SECRET="super";
    console.log(req.cookies.auth)
    console.log(req.user)
    if(req.cookies.auth===undefined){
        
        res.status(401).json({error:"Pls authenticate using a valid token 1"});
    }
    const token = req.cookies.auth;

    try {
        let data =   jwt.verify(token,JWT_SECRET);
       // console.log(data)
        req.user = data.user;
        
        next();
    } catch (error) {
      
        res.status(401).json({error:"Pls authenticate using a valid token 2"});
    }

}

module.exports = fetchuser;