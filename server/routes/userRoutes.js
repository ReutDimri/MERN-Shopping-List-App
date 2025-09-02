const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {userCreation, loginUser, getUserProfile, userUpdate, 
  userDelete} = require('../controllers/userController');

router.post('/login', loginUser);
router.post('/register', userCreation);

router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, userUpdate);
router.delete('/profile', auth, userDelete);

module.exports = router;