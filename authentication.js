const jwt = require ('jsonwebtoken');
require('dotenv').config();

function authentication(req, res, next) {
    const bearerToken = req.headers['authorization']
    if(!bearerToken){
        return res.status(401).json({
            message: 'UNAUTHORIZATION'
        })
    }
    const token = bearerToken.split(' ')[1];
    jwt.verify(token, process.env.SECRET_JWT, (error, decode)=>{
        if (error){
            return res.status(401).json({
                message: error.message
            })
        }
        if(process.env.ACCESS_TOKEN_SALT === decode.salt){
            return next();
        }
        return res.status(400).json({
            message: 'BAD REQUEST'
        })
    });
}
module.exports = {
    authentication
};