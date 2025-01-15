import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { registerAdmin, loginAdmin, logoutAdmin, changePassword, updateAdminDetails, updateAvatar, getCurrentAdmin } from "../controllers/admin.controller.js"
import { verifyAdminJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register-admin").post(upload.single("avatar"), registerAdmin)
router.route("/login-admin").post(loginAdmin)

//secured routes

router.route("/logout-admin").post(verifyAdminJwt,logoutAdmin)
router.route("/change-password-admin").patch(verifyAdminJwt,changePassword)
router.route("/change-admin-details").patch(verifyAdminJwt,updateAdminDetails)
router.route("/change-avatar-admin").patch(verifyAdminJwt,upload.single("avatar"),updateAvatar)
router.route("/get-admin-details").get(verifyAdminJwt,getCurrentAdmin)

export default router




