const {User} = require("../../db/models")
const jwt = require("jsonwebtoken")
const secret = process.env.SECRET

exports.authorise = async (req, res, next) => {
    const myNext = (auth, user) => {
        req.isAuthenticated = auth
        req.user = user
        return next()
    }
    try{
        if(!req.headers.authorization) {
          return falseNext()
        }
        const token = req.headers.authorization.split(" ")[1]
        // verfiy token
        if(token) {
            const data = jwt.verify(token, secret)
            const user = await User.findOne({where: { id: data.id }, include: ['profile'] })
            return myNext(true, user)
        }
        return myNext(false, null)
    }catch(err) {
        myNext(false, null)
    }
}

exports.authenticateUser = (req, res, next) => {
    if(!req.isAuthenticated) {
        err = new Error("Unauthorized")
        err.status = 401
        return next(err)
    }
    next()
}

exports.generateToken = (obj) => {
    const token = jwt.sign(obj, secret, {expiresIn: '1d'})
    return token
}