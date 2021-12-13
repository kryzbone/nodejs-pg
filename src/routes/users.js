const router = require("express").Router()
const bcrypt = require('bcrypt')
const { User, Profile } = require("../../db/models")
const { validator, userRegistrationSchema, profileSchema } = require("../utils/validation")
const { generateToken, authenticateUser } = require("../utils/authorisation")
const { createProfile, updateProfile, getMe, getAllUsers } = require("../controllers/userControllers")


/**
 * @openapi
 * /api/user:
 *   get:
 *     description: Get all users list
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'                      
 * 
 */
router.get("/", getAllUsers)

/**
 * @openapi
 * /api/user/regiter:
 *   post:
 *     description: Register User
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultResponse'
 * 
 */
router.post("/register",validator(userRegistrationSchema), async (req, res, next) => {
    const {username, email, password} = req.body
    const salt = parseInt(process.env.SALT)
    try{
        // Check for existing User
        const exist = await User.findOne({where: {email} })
        if(exist) {
            return res.status(400).json({
                error: {
                    message: "user already exist"
                }
            })
        }
        // hash password and create user
        const hashed = bcrypt.hashSync(password, salt)
        const user = await User.create({username,email,password:hashed})

        // create user profile
        await Profile.create({userId: user.id})

        res.status(201).json({message: "user created"})
    }catch(err){
        next(err)
    }
})

router.post("/login", async (req, res, next) => {
    const {email, password} = req.body
    // Get user
    const user = await User.findOne({where: {email}, include: ['profile']})
    if(!user) {
        return res.status(400).json({
            error: {
                message: "Invalid email or passwrd"
            }
        })
    }
    // check if password matches
    const match = bcrypt.compareSync(password, user.password)
    if(!match) {
        return res.status(400).json({
            error: {
                message: "Invalid email or password"
            }
        })
    }

    if(match) {
        const token = generateToken({id: user.id})
        return res.status(200).json({
            token,
            user
        })
    }

    res.status(200).json({message: "Login susccessfull"})
})

router.get('/me', authenticateUser, getMe)
router.post('/profile/create', validator(profileSchema), authenticateUser, createProfile)
router.post('/profile/update', validator(profileSchema), authenticateUser, updateProfile)


module.exports = router