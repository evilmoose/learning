const express = require("express")
const cors = require("cors");

const { NotFoundError } = require("./expressError.js")

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");

const morgan = require("morgan");

const app = express()

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

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