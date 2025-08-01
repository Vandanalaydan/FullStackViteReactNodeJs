import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
    getSubscriptionStatus
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelId").post(toggleSubscription);
 router.route("/c/:subscriberId").get(getSubscribedChannels)
    

router.route("/u/:channelId").get(getUserChannelSubscribers);

// GET /api/v1/subscriptions/status/:channelId
router.route("/status/:channelId").get( getSubscriptionStatus);


export default router 
