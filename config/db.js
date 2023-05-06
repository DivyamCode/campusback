const mongoose = require('mongoose');

const connectDatabase = ()=>{
    try {
      mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=> console.log("connection succesfull ..."))
    } catch (error) {
      console.log(error)
    }
}

module.exports = connectDatabase