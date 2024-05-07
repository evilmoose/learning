const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

// Middleware: Authenticate user.
const authenticateJWT = (req, res, next) => {
    try {
      const authHeader = req.headers && req.headers.authorization;
      if (authHeader) {
        const token = authHeader.replace(/^[Bb]earer /, "").trim();
        res.locals.user = jwt.verify(token, SECRET_KEY);
      }
      return next();
    } catch (err) {
      return next();
    }
  }

// Middleware to use when they must be logged in.
const ensureLoggedIn = (req, res, next) => {
    try {
      if (!res.locals.user) throw new UnauthorizedError();
      return next();
    } catch (err) {
      return next(err);
    }
  }

// Middleware to use when they be logged in as an admin user.
const ensureAdmin = (req, res, next) => {
    try {
      if (!res.locals.user || !res.locals.user.isAdmin) {
        throw new UnauthorizedError();
      }
      return next();
    } catch (err) {
      return next(err);
    }
  }

// Middleware to use when they must provide a valid token & be user matching
// username provided as route param.
const ensureCorrectUserOrAdmin = (req, res, next) => {
    try {
      const user = res.locals.user;
      if (!(user && (user.isAdmin || user.username === req.params.username))) {
        throw new UnauthorizedError();
      }
      return next();
    } catch (err) {
      return next(err);
    }
  }
  
  
  module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureAdmin,
    ensureCorrectUserOrAdmin,
  };