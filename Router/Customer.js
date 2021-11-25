const DynamicDB = require("../Middleware/dynamicDb");
const { Customer } = require("../utils/AllCollection");
const customerSchema = require("../Models/customer");
const admin = require("../Middleware/admin");
const auth = require("../Middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/", DynamicDB, async (req, res) => {
  const CustomerModel = Database.model(Customer, customerSchema);

  const customers = await CustomerModel.find().sort("name");
  res.send(customers);
});

router.post("/", DynamicDB, async (req, res) => {
  const CustomerModel = Database.model(Customer, customerSchema);

  const newData = {
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  };

  const newModel = CustomerModel(newData);
  const result = await newModel.save();

  res.send(result);
});

module.exports = router;
