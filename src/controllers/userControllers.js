const { createError } = require("../utils/errors")
const {Profile} = require("../../db/models")
const { User } = require("../../db/models");
const { pagination } = require("../utils");


exports.createProfile = async (req, res, next) => {
    const userId = req.user.id;
    const userData = req.body;
    userData.userId = userId;
    try {
        await Profile.create(userData)
        return res.sendStatus(201)
    }catch(err) {
        next(err)
    }
}

exports.updateProfile = async (req, res, next) => {
    const data = req.body
    const userId = req.user.id
    const profile = await Profile.findOne({where: {userId}})
    //check if user is authorised to upadate
    // const auth = profile.userId === userId
    // if(!auth) return next(createError(403))
    try {
        const newProfile = await profile.update(data)
        return res.status(200).json({message: "profile updated", result: newProfile})
    }catch(err) {
        next(err)
    }   
}

exports.getMe = async (req, res, next) => {
    if(req.isAuthenticated) {
        const user = await User.findOne({where: { id: req.user.id}, include: ['profile']})
        return res.status(200).json({result: user })
    }
}

exports.getAllUsers = async (req, res, next) => {
    if(!req. isAuthenticated) {
        return next(createError(401))
    }

    try {
        const {limit, offset} = pagination(req)
        const users = await User.findAndCountAll({include: ['profile'], limit, offset})
        return res.status(200).json(users)
    }catch(err) {
        next(err)
    }
}

