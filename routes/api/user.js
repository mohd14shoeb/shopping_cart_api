const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const router = express.Router({ strict: true });

const User = require("../../models/userSchema");

//@ Description > Getting all of users
//@ Route > /api/users
//@ Access Control > Private
router.get("/users", (req, res, next) => {
  return User.find()
    .sort({ date: -1 })
    .select(" name email username _id createdItem ")
    .exec()
    .then(users => {
      if (users.length < 1) {
        return res.status(409).json({
          success: false,
          message: `no users found yet...`,
          users: null
        });
      } else {
        let usersList = users.map(user => {
          return { ...user._doc };
        });
        //console.log(req.user);
        return res.status(200).json({
          success: true,
          message: `getting all of users...`,
          users: usersList
        });
      }
    })
    .catch(err => {
      throw err.message;
    });
});

//@ Description > Registering users
//@ Route > /api/user/add
//@ Access Control > Public
router.post("/user/add", (req, res, next) => {
  return User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (user) {
        return res.status(409).json({
          success: false,
          message: `email already exist...`
        });
      }

      return User.findOne({ username: req.body.username }).exec();
    })
    .then(user => {
      if (user) {
        return res.status(409).json({
          success: false,
          message: `username already exist...`
        });
      }

      //Hashing password
      return bcrypt.hash(req.body.password, 12);
    })
    .then(hashedPswd => {
      let newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: hashedPswd
      });
      return newUser.save();
    })
    .then(user => {
      return res.status(200).json({
        success: true,
        message: `user successfully created...`,
        user: { ...user._doc }
      });
    })
    .catch(err => {
      throw err.message;
    });
});

//@ Description > Getting user by id
//@ Route > /api/user/:id
//@ Access Control > Private
router.get(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const userId = req.params.id;

    return User.findOne({ _id: userId })
      .select(" name email username _id ")
      .exec()
      .then(user => {
        if (!user) {
          return res.status(409).json({
            success: false,
            message: `couldn't find user...`,
            user: null
          });
        } else {
          return res.status(200).json({
            success: true,
            message: `getting user whose id ${userId}`,
            user: { ...user._doc }
          });
        }
      })
      .catch(err => {
        throw err.message;
      });
  }
);

//@ Description > Deleting users
//@ Route > /api/user/:id
//@ Access Control > Private
router.delete(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const userId = req.params.id;

    return User.findOne({ _id: userId })
      .exec()
      .then(user => {
        if (!user) {
          return res.status(409).json({
            success: false,
            message: `couldn't find user...`
          });
        }

        return User.deleteOne({ _id: userId }).exec();
      })
      .then(user => {
        return res.status(200).json({
          success: true,
          message: `user successfully deleted...`
        });
      })
      .catch(err => {
        throw err.message;
      });
  }
);

module.exports = router;
