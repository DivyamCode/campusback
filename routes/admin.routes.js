const express = require('express');
const adminController = require('../admin/controller/auth')
// const {  authController } = require('../controller');
// // const { authToken } = require('../middlewares/auth');

const router = express.Router();

router.get(
  '/',
   adminController.adminIndex
);
// router.post(
//   '/login',
//   authController.loginUser
// )


module.exports = router;