const express = require("express");
const mongoose = require("mongoose");

const router = express.Router({ strict: true });

const Item = require("../../models/itemSchema");
const upload = require("../../utils/file");

//@ Description > Getting all of items from database
//@ Route > /api/items
//@ Access Control > Public
router.get("/items", (req, res, next) => {
  return Item.find()
    .sort({ date: -1 })
    .select(" name price _id shoppingImage creator ")
    .then(items => {
      if (items.length < 1) {
        return res.status(200).json({
          message: `no items added yet..`
        });
      } else {
        let itemsList = items.map(item => {
          return { ...item._doc };
        });
        return res.status(200).json({
          success: true,
          message: `getting all of items...`,
          items: itemsList
        });
      }
    })
    .catch(err => {
      throw err.message;
    });
});

//@ Description > Seeding some items to database
//@ Route > /api/item/add
//@ Access Control > Public
router.post("/item/add", upload, (req, res, next) => {
  let item = new Item({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    shoppingImage: req.file.path
  });
  return item
    .save()
    .then(item => {
      return res.status(201).json({
        success: true,
        message: `item successfully created...`,
        item: { ...item._doc }
      });
    })
    .catch(err => {
      throw err.message;
    });
});

//@ Description > Patching item on database
//@ Route > /api/item/:id
//@ Access Control > Public
router.patch("/item/:id", upload, (req, res, next) => {
  const itemId = req.params.id;
  return Item.findOne({ _id: itemId })
    .exec()
    .then(item => {
      if (!item) {
        return res.status(409).json({
          success: false,
          message: `couldn't find item...`
        });
      }
      let updateItem = {
        name: req.body.name,
        price: req.body.price,
        shoppingImage: req.file.path
      };
      return Item.updateOne({ _id: itemId }, { $set: updateItem }).exec();
    })
    .then(item => {
      return res.status(200).json({
        success: true,
        message: `item successfully updated...`
      });
    })
    .catch(err => {
      throw err.message;
    });
});

//@ Description > Getting item by id
//@ Route > /api/item/:id
//@ Access Control > Public
router.get("/item/:id", (req, res, next) => {
  const itemId = req.params.id;
  return Item.findOne({ _id: itemId })
    .select(" name price shoppingImage _id ")
    .exec()
    .then(item => {
      if (!item) {
        return res.status(409).json({
          success: false,
          message: `couldn't find any item...`,
          item: null
        });
      } else {
        return res.status(200).json({
          success: true,
          message: `getting item which has id ${item._id}`,
          item: { ...item._doc }
        });
      }
    })
    .catch(err => {
      throw err.message;
    });
});

//@ Description > Deleting item from database
//@ Route > /api/item/:id
//@ Access Control > Public
router.delete("/item/:id", (req, res, next) => {
  const itemId = req.params.id;
  return Item.findOne({ _id: itemId })
    .exec()
    .then(item => {
      if (!item) {
        return res.status(409).json({
          success: false,
          message: `couldn't find item...`
        });
      }
      return Item.deleteOne({ _id: itemId }).exec();
    })
    .then(item => {
      return res.status(200).json({
        success: true,
        message: `item successfully deleted...`
      });
    })
    .catch(err => {
      throw err.message;
    });
});

module.exports = router;
