import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { registerUser, loginUser, logoutUser, changePassword, updateUserDetails, updateAvatar, getCurrentUser } from "../controllers/user.controller.js"
import { verifyUserJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(upload.single("avatar"), registerUser)
router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyUserJwt,logoutUser)
router.route("/change-password").patch(verifyUserJwt,changePassword)
router.route("/change-user-details").patch(verifyUserJwt,updateUserDetails)
router.route("/change-avatar").patch(verifyUserJwt,upload.single("avatar"),updateAvatar)
router.route("/get-user-details").get(verifyUserJwt,getCurrentUser)

export default router




