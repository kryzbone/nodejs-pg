require("dotenv").config()
const express = require("express")
const swaggerDocs = require("swagger-jsdoc")
const redoc = require("redoc-express")
const app = express()
const server = require("http").createServer(app)
const {sequelize} = require("./db/models")
const userRoutes = require("./src/routes/users")
const {authorise} = require("./src/utils/authorisation")
const { swaggerOptions } = require("./src/utils")

const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const swaggerSpec = swaggerDocs(swaggerOptions)

// Swagger API documentation
app.get('/swagger.json', (req, res) => {
    res.send(swaggerSpec)
})
app.get("/", redoc({
    title: "Car Rentals API",
    specUrl: "/swagger.json"
}))


// authentication middleware
app.use(authorise)

app.use("/api/user", userRoutes)


//handle 404 Error
app.use((req, res, next) => {
    const err = new Error("Page Not Found")
    err.status = 404
    next(err)
})

//Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || "Server Error",
        error: err,
    })
})



server.listen(port, async () => {
    try {
        await sequelize.authenticate()
        console.log("db connected")
        console.log(`Server is live on port:${port} !!!`)
    }catch(err) {
        console.log(err)
    }    
    
})