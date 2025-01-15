import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { postThreadReact, postThreadExpress, postThreadMongodb, postThreadNode, randomThreadReact, randomThreadExpress, randomThreadNode, randomThreadMongodb, searchThreadReact, searchThreadExpress, searchThreadNode, searchThreadMongodb, userProducts, deleteOrder} from "../controllers/thread.controller.js"
import { verifyUserJwt, verifyAdminJwt } from "../middlewares/auth.middleware.js";

const router = Router()

// Secured Routes

router.route("/random-threads").get(verifyUserJwt,randomThreadReact)
router.route("/user-products").get(verifyUserJwt,userProducts)
router.route("/orders-page").get(verifyAdminJwt,randomThreadReact)
router.route("/express-random-threads").get(verifyUserJwt,randomThreadExpress)
router.route("/node-random-threads").get(verifyUserJwt,randomThreadNode)
router.route("/mongodb-random-threads").get(verifyUserJwt,randomThreadMongodb)
router.route("/react-search-threads").post(verifyAdminJwt,searchThreadReact)
router.route("/express-search-threads").post(verifyUserJwt,searchThreadExpress)
router.route("/node-search-threads").post(verifyUserJwt,searchThreadNode)
router.route("/mongodb-search-threads").post(verifyUserJwt,searchThreadMongodb)
router.route("/post-react-thread").post(verifyAdminJwt,upload.single("image"),postThreadReact)
router.route("/post-order").post(verifyUserJwt,upload.single("image"),postThreadExpress)
router.route("/post-node-thread").post(verifyUserJwt,upload.single("image"),postThreadNode)
router.route("/post-mongodb-thread").post(verifyUserJwt,upload.single("image"),postThreadMongodb)
router.route("/order-accept").post(verifyAdminJwt,deleteOrder)


export default router

