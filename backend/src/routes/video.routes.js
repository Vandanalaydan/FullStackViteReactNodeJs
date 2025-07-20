import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getCurrentUserVideos,
   getCurrentChannelVIdeos,
    getVideoById,
     publishAVideo,
    togglePublishStatus,
    updateVideo,
    getVideoStats
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router.route("/user/videos").get( getCurrentUserVideos);
router.route("/channel/videos").get( getCurrentChannelVIdeos);
router.route("/:videoId/stats").get( getVideoStats);

export default router