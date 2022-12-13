const User = require("../models/User")
const { hashPassword, validatePassword } = require("../services/authService")
const jwt = require('jsonwebtoken')
const JWT_SECRET = require('../utils/config')

//@method Register
//@alias Signup
const register = async (req, res, next) => {
    try {
        const { firstname, lastname, email, password, role } = req.body;
        const encryptedPassword = await hashPassword(password);
        const newUser = new User({ firstname, lastname, email, password: encryptedPassword, role: role || 'user' });
        const accessToken = jwt.sign({ userId: newUser._id }, 'JWT_SECRET', { expiresIn: '1d' });
        newUser.accessToken = accessToken;
        const savedUser = await newUser.save();

        res.status(200).json({ data: savedUser })
    } catch (err) {
        next(err)
    }
}

//@method: Login
//@alias SignIn 
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) next(new Error('Email does not exist'));
        const validPassword = await validatePassword(password, user.password)
        if (!validPassword) next(new Error('Password does not match'));
        const accessToken = jwt.sign({ userId: user._id }, 'JWT_SECRET', { expiresIn:  '1d' });
        await User.findByIdAndUpdate(user._id, { accessToken });

        res.status(200).json({
            data: { email: user.email, role: user.role },
            accessToken
        });
    } catch (err) {
       next(err)
    }
}
 

module.exports = {
    register,
    login
}