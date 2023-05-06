const sendToken = (user,statusCode,res)=>{
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE *24*60*60*100
    })
    const options = {
        Date: new Date(
            Date.now()+process.env.COOKIE_EXPIRE *24*60*60*100
        ),
        httpOnly:true,
    }
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,
        token
    })
    console.log('token_send')
}

module.exports = sendToken;