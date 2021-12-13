const Joi = require("joi")

exports.userRegistrationSchema = Joi.object({
   username: Joi.string().min(3).required(),
   email: Joi.string().required().email(),
   password: Joi.string().min(6)
})

exports.profileSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    // userId: Joi.number().integer().required(),
    gender: Joi.string().required(),
    phone: Joi.string().allow(null, ''),
    dob: Joi.date().allow(null, ''),
    country: Joi.string().allow('')
})

exports.validator = (schema) => {
    return (req, res, next) => {
        const result = schema.validate(req.body) 
        if(result.error) {
            return res.status(400).json({error: result.error.details})
        }
        next()
    }
}