import mongoose, {isValidObjectId} from "mongoose";
import {Like} from "../modles/like.model.js";
import {Video} from "../modles/video.model.js";
import {Comment} from "../modles/comment.model.js";
import {Tweet} from "../modles/tweet.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const likedByUser = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id,
    });

    if (likedByUser) {
        // Unlike the video
        await Like.findByIdAndDelete(likedByUser._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { liked: false }, "Video unliked successfully"));
    } else {
        // Like the video
        await Like.create({
            video: videoId,
            likedBy: req.user?._id,
        });
        return res
            .status(201)
            .json(new ApiResponse(200, { liked: true }, "Video liked successfully"));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const likedByUser = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id,
    });

    if (likedByUser) {
        // Unlike the comment
        await Like.findByIdAndDelete(likedByUser._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { liked: false }, "Comment unliked successfully"));
    } else {
        // Like the comment
        await Like.create({
            comment: commentId,
            likedBy: req.user?._id,
        });
        return res
            .status(201)
            .json(new ApiResponse(200, { liked: true }, "Comment liked successfully"));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    const likedByUser = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id,
    });

    if (likedByUser) {
        // Unlike the tweet
        await Like.findByIdAndDelete(likedByUser._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { liked: false }, "Tweet unliked successfully"));
    } else {
        // Like the tweet
        await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id,
        });
        return res
            .status(201)
            .json(new ApiResponse(200, { liked: true }, "Tweet liked successfully"));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                video: { $exists: true },
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideo",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $unwind: "$ownerDetails",
                    },
                ],
            },
        },
        {
            $unwind: "$likedVideo",
        },
        {
            $project: {
                _id: 0,
                likedVideo: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};