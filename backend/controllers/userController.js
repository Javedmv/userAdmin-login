const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../model/userModal')

// @desc POST registerUser
// @ POST /api/
const registerUser = asyncHandler(async (req,res) => {
    const {name,email,password} = req.body
    if(!name || !email || !password){
        res.status(400)
        throw new Error('please add all fields');
    }

    //check if user exists
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400)
        throw new Error('User already exists');
    }

    //hashPassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password:hashedPassword
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            name : user.name,
            email : user.email,
            token: generateToken(user.id)
        })
    }else{
        res.status(400)
        throw new Error('invalid user data')
    }

})

const userLogin = asyncHandler(async (req,res) => {
    const {email,password} = req.body

    //check for user email
    const user = await User.findOne({email})
    
    if(user && (await bcrypt.compare(password ,user.password))){
        res.status(200).json({
            _id: user.id,
            name : user.name,
            email : user.email,
            token: generateToken(user.id)
        })
    }else{
        res.status(400)
        throw new Error('invalid credentials')
    }
})

const getMe = asyncHandler(async (req,res) => {
    res.status(200).json(req.user)
})

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn:'15d'})
}

module.exports = {
    registerUser,
    userLogin,
    getMe
}