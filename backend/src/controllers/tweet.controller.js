import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../modles/tweet.model.js"
import {User} from "../modles/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    // Get the content from the request body
    const { content } = req.body;
    const userId = req.user._id; // Assuming you have authentication middleware
  
    // Check if content is provided
    if (!content?.trim()) {
      throw new ApiError(400, "Content is required");
    }
  
    try {
      // Create the tweet
      const tweet = await Tweet.create({
        content,
        owner: userId,
      });
  
      // If tweet is not created throw an error
      if (!tweet) {
        throw new ApiError(500, "Failed to create tweet");
      }
  
      // Optionally, update the user's tweets array (if you have one)
      await User.findByIdAndUpdate(
        userId,
        { $push: { tweets: tweet._id } }, // push tweet id in user's tweets array
        { new: true }
      );
  
      // Return a success response
      return res.status(201).json(
        new ApiResponse(201, tweet, "Tweet created successfully")
      );
    } catch (error) {
      // Handle any errors during tweet creation
      throw new ApiError(500, "Error creating tweet: " + error.message);
    }
  });
  
  const getUserTweets = asyncHandler(async (req, res) => {
    // Get the user ID from the request parameters
    const { userId } = req.params;
  
    // Basic validation for userId
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }
  
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    // Fetch tweets for the user, populating the owner field
    const tweets = await Tweet.find({ owner: userId }).populate("owner");
  
    // Return the tweets
    return res.status(200).json(
      new ApiResponse(200, tweets, "User tweets retrieved successfully")
    );
  });
  
  const updateTweet = asyncHandler(async (req, res) => {
    // Get the tweet ID from the request parameters
    const { tweetId } = req.params;
    const { content } = req.body;
    const userId = req.user._id; // Get user ID from auth middleware
  
    // Check if content is provided
    if (!content?.trim()) {
      throw new ApiError(400, "Content is required for update");
    }
  
    // Find the tweet and verify ownership
    const tweet = await Tweet.findById(tweetId);
  
    if (!tweet) {
      throw new ApiError(404, "Tweet not found");
    }
  
    if (tweet.owner.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not authorized to update this tweet");
    }
  
    // Update the tweet
    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { content },
      { new: true } // Return the updated tweet
    );
  
    if (!updatedTweet) {
      throw new ApiError(500, "Failed to update the tweet"); // Handle the update failure
    }
    // Return a success response
    return res.status(200).json(
      new ApiResponse(200, updatedTweet, "Tweet updated successfully")
    );
  });
  
  const deleteTweet = asyncHandler(async (req, res) => {
    // Get the tweet ID from the request parameters
    const { tweetId } = req.params;
    const userId = req.user._id;
  
    // Find the tweet and verify ownership
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      throw new ApiError(404, "Tweet not found");
    }
    if (tweet.owner.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not authorized to delete this tweet");
    }
  
    // Delete the tweet
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
  
    if (!deletedTweet) {
      throw new ApiError(500, "Failed to delete the tweet"); // Handle the delete failure
    }
  
      // Optionally, remove the tweet's ID from the user's tweets array
      await User.findByIdAndUpdate(
        userId,
        { $pull: { tweets: tweetId } }, // Remove the tweet's ID
        { new: true }
      );
  
    // Return a success response
    return res.status(200).json(
      new ApiResponse(200, {}, "Tweet deleted successfully")
    );
  });
export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}