const e = require('express');
const User  = require('../model/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const signup = async (req, res, next) => {
    const {name , email, password} = req.body ;  // Destructuring the request body;
    let existinguser;


    try{
        existinguser = await User.findOne({email : email});
    }catch(err) {
        console.log("Error in finding the user");
    }
    if(existinguser){
        return res.status(400).json({message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 12);


    const user = new User({
       name,
        email,
        password: hashedPassword    // Storing the hashed password in the database,
    });

    try{
        const result = await user.save();
        res.json(result);
    }catch {
        console.log("Error in saving the user");
    }

    
    return res.status(201).json({message: "User created successfully", user: user});
};



const login = async (req, res, next) => {
    const {password , email} = req.body ;  // Destructuring the request body;

    let existinguser;

    try{
        existinguser = await User.findOne({email : email});
    }catch(err) {
        console.log("Error in finding the user");
    }


    if(!existinguser){
        return res.status(400).json({message: "User does not exists! signup first"});
    }

    const ispasswordcorrect = await bcrypt.compare(password, existinguser.password);

    if(!ispasswordcorrect){
        return res.status(400).json({message: "Invalid credentials"});
    }
    const token = jwt.sign({id: existinguser._id} ,  process.env.JWT_SECRET_KEY , {expiresIn: '1h'});

    res.cookie(String(existinguser._id) , token , {
        path : '/',
        expires : new Date(Date.now() + 3600000), // 1 hour
        httpOnly: true,
        samesite: 'lex',
    },

)

    return res.status(200).json({message: "succesfully logged in", user: existinguser , token: token});
};





const verifytoken = (req, res, next) => {
    const cookie = req.headers.cookie;
    console.log(cookie);
//    const headers = req.headers['authorization'];
//    const token = headers.split(' ')[1];
//    if(!token){
//        return res.status(401).json({message: "No token provided"});
//    }
//    jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
//        if(err){
//            return res.status(401).json({message: "Invalid token"});
//        }
//     //    return res.status(200).json({message: "Authorized" , user: user});
//        req.id = user.id;
//    });
//    next();
   
}

const getuser = async(req, res, next) => {
    const userid = req.id;
    let user;
    try{
        user = await User.findById(userid , '-password');
    }catch(err){
        console.log("Error in finding the user");
    }
    if (!user) {
        return res.status(404).json({message: "User not found"});
    }
    return res.status(200).json({message: "User found", user: user});
}


exports.signup = signup;
exports.login = login;
exports.verifytoken = verifytoken;
exports.getuser = getuser;