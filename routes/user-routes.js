const express = require("express");
const { signup, login, verifytoken, getuser } = require('../controllers/user-controller.js');



const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/users', verifytoken , getuser)

module.exports = router;