const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  
  fullname:{
    type:String
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    trim: true,
    private: true
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
    private:true
  },
  username: {
    type: String,
    trim: true
  },
  phoneno: {
    type: String,
    trim: true,
    lowercase: true
  },
  rollno:{
    type:String,
    unique: true,
  },
  city: {
    type: String
  },
  dateOfBirth: {
    type: Date,
    trim: true
  },
  gender: {
    type: String,
    trim: true,
    enum: ['male', 'female']
  },
  dp:{
    type:String,
    default:'/pic/default.webp'
  }
});

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!user;
};
userSchema.statics.isRollnoTaken = async function (rollno, excludeUserId) {
  const user = await this.findOne({ rollno, _id: { $ne: excludeUserId } });
  return !!user;
};


userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
