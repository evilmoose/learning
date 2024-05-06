const express = require("express")

const { NotFoundError } = require("./expressError.js")

const app = express()

// 404 errors
app.use((req, res, next) => {
    return next(new NotFoundError())
})

// Generic Error
app.use((err, req, res, next) => {
    if(process.env.MODE_ENV !== "test") 
        console.error(err.stack)
    
    const status = err.status || 500
    const message = err.message

    return res.status(status).json({
        error: {message, status},
    })
})

module.exports = app