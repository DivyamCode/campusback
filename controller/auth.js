const catchAsync = require('../utils/catchAsync')
const authService = require('../service/auth.service')
const sendToken = require('../utils/sendtoken');




const registerUser = catchAsync(async (req, res) => {

    try{  const user = await authService.createUser(req.body)
      sendToken(user,201,res)
    }catch(errr){
      console.log(errr.status +errr.message )
    }
})
const loginUser = catchAsync(async (req ,res)=>{
    try {
       await authService.loginUser(req.body,res)
    } catch (error) {
      
    }
})









const getProfile = catchAsync(async (req,res)=>{
    console.log("profile")
    res.send("hello ")
})






module.exports = {
    registerUser,
    loginUser,
    getProfile,

}