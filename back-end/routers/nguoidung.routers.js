const express = require("express");
const NguoiDungController = require("../controllers/nguoidung.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/").get(authController.protect, NguoiDungController.getDetailedUser);
router.route("/refresh-token").post(authController.protect, NguoiDungController.refreshToken);
router.route("/sign-in").post(NguoiDungController.signInUser);
router.route("/sign-out").post(authController.protect, NguoiDungController.signOutUser);
router.route("/sign-up").post(NguoiDungController.createUser);

module.exports = router;
