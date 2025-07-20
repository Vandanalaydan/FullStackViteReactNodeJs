


 import mongoose, {isValidObjectId} from "mongoose"
 import {Video} from "../modles/video.model.js"
 import {User} from "../modles/user.model.js";
 import {ApiError} from "../utils/ApiError.js"
 import {ApiResponse} from "../utils/ApiResponse.js"
 import {asyncHandler} from "../utils/asyncHandler.js"
 import {uploadOnCloudinary} from "../utils/cloudinary.js"
 import { Like } from "../modles/like.model.js"
 
 
 const getAllVideos = asyncHandler(async (req, res) => {
     const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
 
     const pipeline = [];
 
     if (query) {
         pipeline.push({
             $search: {
                 index: 'videos', // Make sure you have a text index named 'videos'
                 text: {
                     query: query,
                     path: ['title', 'description']
                 }
             }
         });
     }
 
     if (userId && isValidObjectId(userId)) {
         pipeline.push({
             $match: {
                 owner: new mongoose.Types.ObjectId(userId)
             }
         });
     }
 
     const sortStage = {};
     if (sortBy && sortType && ['asc', 'desc'].includes(sortType.toLowerCase())) {
         sortStage[sortBy] = sortType === 'asc' ? 1 : -1;
         pipeline.push({ $sort: sortStage });
     } else {
         // Default sorting by createdAt in descending order
         pipeline.push({ $sort: { createdAt: -1 } });
     }
 
     const aggregateResult = await Video.aggregate([
         ...pipeline,
         {
             $lookup: {
                 from: "users",
                 localField: "owner",
                 foreignField: "_id",
                 as: "ownerInfo",
                 pipeline: [
                     {
                         $project: {
                             username: 1,
                             fullName: 1,
                             avatar: 1
                         }
                     }
                 ]
             }
         },
         {
             $unwind: "$ownerInfo"
         },
         {
             $skip: (parseInt(page) - 1) * parseInt(limit)
         },
         {
             $limit: parseInt(limit)
         }
     ]);
 
     const totalVideos = await Video.countDocuments(query ? {
         $or: [
             { title: { $regex: query, $options: 'i' } },
             { description: { $regex: query, $options: 'i' } }
         ]
     } : {});
 
     const totalPages = Math.ceil(totalVideos / parseInt(limit));
 
     return res
     .status(200)
     .json(
         new ApiResponse(
             200,
             { videos: aggregateResult, totalPages, currentPage: parseInt(page) },
             "Videos fetched successfully"
         )
     )
 })
 
 const publishAVideo = asyncHandler(async (req, res) => {
     const { title, description} = req.body
     const videoFileLocalPath = req.files?.videoFile[0]?.path;
     const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
 
     if (!videoFileLocalPath) {
         throw new ApiError(400, "Video file is required");
     }
 
     const videoFile = await uploadOnCloudinary(videoFileLocalPath);
     const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
 
     if (!videoFile) {
         throw new ApiError(500, "Failed to upload video on Cloudinary");
     }
 
     const video = await Video.create({
         videoFile: videoFile.url,
         thumbnail: thumbnail?.url || null,
         title,
         description,
         duration: videoFile.duration,
         owner: req.user?._id
     })
 
     if (!video) {
         throw new ApiError(500, "Failed to create video record in database");
     }
 
     return res.status(201).json(
         new ApiResponse(201, video, "Video published successfully")
     )
 })

 const getCurrentUserVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query;

    const sortOrder = sortType === "asc" ? 1 : -1;

    const userId = req.user._id;

    const videos = await Video.find({ owner: userId })
        .sort({ [sortBy]: sortOrder })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .populate({
            path: "owner",
            select: "username fullName avatar"
        });

    const totalVideos = await Video.countDocuments({ owner: userId });
    const totalPages = Math.ceil(totalVideos / parseInt(limit));

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                videos,
                totalPages,
                currentPage: parseInt(page)
            },
            "User's videos fetched successfully"
        )
    );
});
const getCurrentChannelVIdeos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query;

    const sortOrder = sortType === "asc" ? 1 : -1;

    const ChannelId = req.user._id;

    const videos = await Video.find({ owner:ChannelId })
        .sort({ [sortBy]: sortOrder })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .populate({
            path: "owner",
            select: "username fullName avatar"
        });

    const totalVideos = await Video.countDocuments({ owner: ChannelId });
    const totalPages = Math.ceil(totalVideos / parseInt(limit));

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                videos,
                totalPages,
                currentPage: parseInt(page)
            },
            "User's videos fetched successfully"
        )
    );
});

 
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).populate({
    path: "owner",
    select: "username fullName avatar"
  });

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // ✅ Increment views if current user is not the owner
  if (req.user && video.owner._id.toString() !== req.user._id.toString()) {
    video.views = (video.views || 0) + 1;
    await video.save({ validateBeforeSave: false });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

 const updateVideo = asyncHandler(async (req, res) => {
     const { videoId } = req.params
     const { title, description } = req.body
 
     if (!isValidObjectId(videoId)) {
         throw new ApiError(400, "Invalid video ID");
     }
 
     const video = await Video.findById(videoId);
 
     if (!video) {
         throw new ApiError(404, "Video not found");
     }
 
     if (video.owner.toString() !== req.user?._id.toString()) {
         throw new ApiError(403, "You are not authorized to update this video");
     }
 
     const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
     let thumbnail;
     if (thumbnailLocalPath) {
         await uploadOnCloudinary(thumbnailLocalPath)
         thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
         if (thumbnail?.url) {
             video.thumbnail = thumbnail.url;
         }
     }
 
     video.title = title || video.title;
     video.description = description || video.description;
 
     const updatedVideo = await video.save({ validateBeforeSave: false });
 
     if (!updatedVideo) {
         throw new ApiError(500, "Failed to update video details");
     }
 
     return res.status(200).json(new ApiResponse(200, updatedVideo, "Video details updated successfully"));
 })
 
 const deleteVideo = asyncHandler(async (req, res) => {
     const { videoId } = req.params
 
     if (!isValidObjectId(videoId)) {
         throw new ApiError(400, "Invalid video ID");
     }
 
     const video = await Video.findById(videoId);
 
     if (!video) {
         throw new ApiError(404, "Video not found");
     }
 
     if (video.owner.toString() !== req.user?._id.toString()) {
         throw new ApiError(403, "You are not authorized to delete this video");
     }
 
     // TODO: Optionally delete video and thumbnail from Cloudinary
 
     await Video.findByIdAndDelete(videoId);
 
     return res.status(200).json(new ApiResponse(200, { videoId: videoId }, "Video deleted successfully"));
 })
 
 const togglePublishStatus = asyncHandler(async (req, res) => {
     const { videoId } = req.params
 
     if (!isValidObjectId(videoId)) {
         throw new ApiError(400, "Invalid video ID");
     }
 
     const video = await Video.findById(videoId);
 
     if (!video) {
         throw new ApiError(404, "Video not found");
     }
 
     if (video.owner.toString() !== req.user?._id.toString()) {
         throw new ApiError(403, "You are not authorized to toggle publish status of this video");
     }
 
     video.isPublished = !video.isPublished;
     await video.save({ validateBeforeSave: false });
 
     return res.status(200).json(
         new ApiResponse(200, { isPublished: video.isPublished }, `Video publish status toggled successfully to ${video.isPublished}`)
     );
 })



const getVideoStats = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const totalLikes = await Like.countDocuments({ video: videoId });
  const totalViews = video.views || 0;
  


  return res.status(200).json(
    new ApiResponse(200, { totalLikes, totalViews }, "Video stats fetched")
  );
});

 
 export {
     getAllVideos,
     getCurrentUserVideos,
     getCurrentChannelVIdeos,
     publishAVideo,
     getVideoById,
     updateVideo,
     deleteVideo,
     togglePublishStatus,
     getVideoStats
  }
