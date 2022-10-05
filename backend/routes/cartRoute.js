const express = require("express");
const {
  newCartItem,
  getUserCartItem,
} = require("../controllers/cartController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/new/cartItem").post(isAuthenticatedUser, newCartItem);

router.route("/me/cartItem").get(isAuthenticatedUser, getUserCartItem);

module.exports = router;