const httpStatus = require('http-status');
const { User } = require('../model');
const { nullChecker } = require('../helper/nullChecker');
const ApiError = require('../utils/ApiError');
const { valueChecker } = require('../helper/valuechecker');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const sendToken = require('../utils/sendtoken');
var validator = require("email-validator");
const crypto = require('crypto')
const extensionExtractor = require('file-ext');
const { AwsInstance } = require('twilio/lib/rest/accounts/v1/credential/aws');


const createUser = async (userBody) => { 
      if (nullChecker(userBody.email) || !validator.validate(userBody.email))
        throw new ApiError(httpStatus.BAD_REQUEST, 'email_required');
      if (nullChecker(userBody.username))
        throw new ApiError(httpStatus.BAD_REQUEST, 'username_required');
      if (nullChecker(userBody.password))
        throw new ApiError(httpStatus.BAD_REQUEST, 'password_required');
      if(nullChecker(userBody.rollno))
        throw new ApiError(httpStatus.BAD_REQUEST,'rollno required');
      if(await User.isRollnoTaken(userBody.rollno))
        throw new ApiError(httpStatus.BAD_REQUEST,"rollno already exist")
      if (await User.isEmailTaken(userBody.email))
        throw new ApiError(httpStatus.BAD_REQUEST, 'email_already_taken');
      if (await User.isUsernameTaken(userBody.username))
        throw new ApiError(httpStatus.BAD_REQUEST, 'email_already_taken');
      return User.create(userBody);
}
const loginUser = async (userBody,res) => {
      console.log(userBody)
      if(nullChecker(userBody.rollno))
        throw new ApiError(httpStatus.BAD_REQUEST,'rollno required');
      if (nullChecker(userBody.password))
        throw new ApiError(httpStatus.BAD_REQUEST, 'password_required');
      const user = await User.findOne({rollno:userBody.rollno}).select("+password");
      if(!user){
          res.status(404).json({success:false,message:"invalid rollno and password"})
          return
      }
      const isPasswordMatched =await bcrypt.compare(userBody.password,user.password);
      if(!isPasswordMatched){res.status(401).json({success:false,message:"Invalid rollno and password"})
      }else{
        const userLogged = await User.findOne({rollno:userBody.rollno})
        sendToken(userLogged,200,res)
      }
 }


 
const getProfile = async (userId) => {
  return await User.findById(userId);
}






const forgotPassword = async (userBody,res) => {
      if (nullChecker(userBody.email) || !validator.validate(userBody.email) )
        throw new ApiError(httpStatus.BAD_REQUEST, 'email_required');
      const user = await User.findOne({email:userBody.email});
      if(!user){
        res.status(404).json({success:false,message:"User Not Found"})
      }else{
        res.status(200).json({success:false,message:"password-reset-link has been shared"})
      }
};
const resetPassword = async (userId,userBody,res) => {
    if (nullChecker(userBody.password))
      throw new ApiError(httpStatus.BAD_REQUEST, 'password_required');
    if (nullChecker(userBody.newpass))
      throw new ApiError(httpStatus.BAD_REQUEST, 'password_required');
    const user = await User.findById(userId.id).select("+password")
    if(!user)
      res.status(404).json({success:false,message:"invalid password"})
    const isPasswordMatched =await bcrypt.compare(userBody.password,user.password);
    console.log(isPasswordMatched)
    if(!isPasswordMatched){res.status(401).json({success:false,message:"Invalid email and password"})
    }else{
      password = await bcrypt.hash(userBody.newpass,8);
      const userLogged = await User.findOneAndUpdate({email:user.email},{password:password})
      res.status(200).json({success:true})
    }
}


const editProfile = async(userBody,userId)=>{
  if (nullChecker(userBody.name))
    throw new ApiError(httpStatus.BAD_REQUEST, 'name_required')
  // if (nullChecker(userBody.phoneno))// || !validator.validate(userBody.email))
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'email_required')
  if(nullChecker(userBody.logo)){
    await User.findByIdAndUpdate(userId,{firstname:userBody.name,lastname:"",})
    
    // await User.findByIdAndUpdate(userId,{firstname:userBody.name,email:userBody.email,lastname:"",})
    //throw new ApiError(httpStatus.BAD_REQUEST, 'logo_path_required')
  }else{
    await User.findByIdAndUpdate(userId,{firstname:userBody.name,lastname:"",dp:"/pic/"+userBody.logo})
  
    // await User.findByIdAndUpdate(userId,{firstname:userBody.name,lastname:"",email:userBody.email,dp:"/pic/"+userBody.logo})
  }
}

const uploadDp = async(req,res)=>{
  try {
    console.log(req.files)
    let sampleFile;
    if (!req.files || Object.keys(req.files).length === 0) {
       return res.status(400).send('No files were uploaded.');
    }
    sampleFile = req.files.POST;
    const fileName=crypto.randomBytes(10).toString('hex')+'.'+extensionExtractor(req.files.POST.name)
    let uploadPath
    isArray_samplefile = Array.isArray(sampleFile)
    uploadPath = __dirname+"/../public/"+req.body.path+'/'+fileName
    sampleFile.mv(uploadPath,async function(err) {
            if (err){ return res.status(500).send(err)};
            });
    res.status(201).json({
      name:fileName
    })
    
  } catch (error) {
    console.log(error)
  }
}

async function changePassword(username  ,oldPassword , newPassword) {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error('User not found');
  }

  const passwordMatch = await bcrypt.compare(oldPassword, user.password);

  if (!passwordMatch) {
    throw new Error('Invalid password');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  return user;
}







  module.exports = {
    createUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getProfile,
    editProfile,
    uploadDp,
    changePassword,
  }