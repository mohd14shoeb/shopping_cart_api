const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const router = express.Router({ strict: true });

const Cart = require("../../models/cartSchema");
const User = require("../../models/userSchema");
const Item = require("../../models/itemSchema");

//@ Description > Getting all of the cart items
//@ Route > /api/cart/items
//@ Access Control > Private
router.get(
  "/items",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    return Cart.find()
      .sort({ date: -1 })
      .select(" item creator _id ")
      .exec()
      .then(items => {
        if (items.length < 1) {
          return res.status(409).json({
            success: false,
            message: `no items added yet...`
          });
        }

        let cartList = items.map(item => {
          return { ...item._doc };
        });

        return res.status(200).json({
          success: true,
          message: `items which added on cart...`,
          items: cartList
        });
      })
      .catch(err => {
        throw err.message;
      });
  }
);

//@ Description > Adding items to cart
//@ Route > /api/cart/item/add
//@ Access Control > Private
router.post(
  "/item/add/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const itemId = req.params.id;
    let createdItem;
    let currentUser;
    return Item.findOne({ _id: itemId })
      .exec()
      .then(item => {
        if (!item) {
          return res.status(409).json({
            success: false,
            message: `item not found...`
          });
        }
        createdItem = item;
        return User.findOne({ _id: req.user._id }).exec();
      })
      .then(user => {
        if (!user) {
          return res.status(409).json({
            success: false,
            message: `no user found...`
          });
        }
        currentUser = user;
        return User.findOne({ createdItem: createdItem._id }).exec();
        
      })
      .then(item => {
        if (item) {
          return res.status(409).json({
            success: false,
            message: `you already have this item...`
          });
        }
        currentUser.createdItem.push(createdItem);
        currentUser.save();
        createdItem.creator.push(currentUser);
        createdItem.save();

        let newCartItem = new Cart({
          _id: new mongoose.Types.ObjectId(),
          item: createdItem,
          creator: currentUser
        });
        return newCartItem.save();
      })
      .then(item => {
        return res.status(200).json({
          success: true,
          message: `item successfully added on your cart...`,
          addedItem: { ...item._doc }
        });
      })
      .catch(err => {
        throw err.message;
      });
  }
);

//@ Description > Getting items by user id
//@ Route > /api/cart/user/item/:id
//@ Access Control > Private
router.get(
  "/user/items",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const userId = req.user._id;
    return Cart.find({ creator: userId })
      .populate("item")
      .select(" item ")
      .exec()
      .then(items => {
        if (items.length < 1) {
          return res.status(409).json({
            success: false,
            message: `no items added yet...`
          });
        }

        let userItems = items.map(item => {
          return { ...item._doc };
        });
        return res.status(200).json({
          success: false,
          message: `items which you added on cart...`,
          items: userItems
        });
      })
      .catch(err => {
        throw err.message;
      });
  }
);

//@ Description > Deleting item from cart
//@ Route > /api/cart/item/:id
//@ Access Control > Private
router.delete(
  "/user/item/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const itemId = req.params.id;
    return Cart.findOne({ _id: itemId })
      .exec()
      .then(item => {
        if (!item) {
          return res.status(409).json({
            success: false,
            message: `couldn't find item...`
          });
        }

        return Cart.deleteOne({ _id: itemId }).exec();
      })
      .then(deletedItem => {
        return res.status(200).json({
          success: true,
          message: `item successfully deleted...`
        });
      })
      .catch(err => {
        throw err.message;
      });
  }
);

module.exports = router;
