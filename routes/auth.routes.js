const express = require('express');
const {  authController } = require('../controller');
// const { authToken } = require('../middlewares/auth');

const router = express.Router();

router.post(
  '/register',
   authController.registerUser
);
router.post(
  '/login',
  authController.loginUser
)

router.get(
  '/profile',
   authController.getProfile
);

module.exports = router;