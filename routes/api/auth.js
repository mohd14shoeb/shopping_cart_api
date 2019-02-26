const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router({ strict: true });

const User = require("../../models/userSchema");
const { JWT_KEY } = require("../../config/keys");

//@ Description > Authenticate user
//@ Route > /api/user/authenticate
//@ Access Control > Public
router.post("/user/authenticate", (req, res, next) => {
  let currentUser = null;
  return User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(409).json({
          success: false,
          message: `invalid email id...`
        });
      }

      currentUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(isMatch => {
      if (isMatch) {
        let token = jwt.sign({ currentUser }, JWT_KEY, {
          expiresIn: "1h"
        });
        return res.status(200).json({
          success: true,
          message: `user authenticated...`,
          token: `Bearer ${token}`,
          user: {
            name: currentUser.name,
            email: currentUser.email,
            username: currentUser.username,
            id: currentUser._id
          }
        });
      }
      return res.status(409).json({
        success: false,
        message: `password is not matched...`
      });
    })
    .catch(err => {
      throw err.message;
    });
});

//@ Description > Getting authenticated user
//@ Route > /api/user/current
//@ Access Control > Private
router.get(
  "/user/current-user",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    let authenticatedUser = req.user;
    try {
      if (!authenticatedUser) {
        return res.status(401).json({
          success: false,
          message: `authentication failed...`,
          user: null
        });
      } else {
        return res.status(200).json({
          success: true,
          message: `getting auth user...`,
          user: authenticatedUser
        });
      }
    } catch (error) {
      throw error.message;
    }
  }
);

module.exports = router;
