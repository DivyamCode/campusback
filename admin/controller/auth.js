const catchAsync = require("../../utils/catchAsync")




const adminIndex = catchAsync(async (req,res)=>{
     res.render('pages/index');
})




module.exports = {
    adminIndex
}