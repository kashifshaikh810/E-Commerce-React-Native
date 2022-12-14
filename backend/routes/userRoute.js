const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  userShippingDetails,
  getUserShippingDetails,
  updateUserShippingDetails,
} = require("../controllers/UserController");

const { isAuthenticatedUser, authorizRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizRoles("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizRoles("admin"), deleteUser);

router
  .route("/shippingDetails")
  .post(isAuthenticatedUser, userShippingDetails)
  .get(isAuthenticatedUser, getUserShippingDetails);

router
  .route("/shippingDetails/:id")
  .put(isAuthenticatedUser, updateUserShippingDetails);

module.exports = router;
