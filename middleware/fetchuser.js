var jwt = require('jsonwebtoken');
const fetchuser = (req,res,next)=>{
    const JWT_SECRET="super";
    const token = req.header('auth-token');
    if(!token){
        res.status(401).json({error:"Pls authenticate using a valid token"});
    }

    try {
        let data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).json({error:"Pls authenticate using a valid token"});
    }

}

module.exports = fetchuser;