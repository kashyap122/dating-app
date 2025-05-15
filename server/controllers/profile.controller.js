// controllers/profile.controller.js
const cloudinary  = require("cloudinary").v2;
const streamifier = require("streamifier");
const User        = require("../models/user.model");

// Configure Cloudinary
cloudinary.config({
  cloud_name:    process.env.CLOUDINARY_CLOUD_NAME,
  api_key:       process.env.CLOUDINARY_API_KEY,
  api_secret:    process.env.CLOUDINARY_API_SECRET,
});

// Helper to stream a Buffer into Cloudinary
function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "user_photos", resource_type: "image" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

// 1) Handle photo uploads
exports.uploadPhotos = async (req, res, next) => {
  try {
    if (!req.files || req.files.length < 3) {
      return res.status(400).json({ error: "Please upload at least 3 photos." });
    }

    // Upload up to 6
    const files   = req.files.slice(0, 6);
    const results = await Promise.all(files.map(f => uploadBuffer(f.buffer)));
    const urls    = results.map(r => r.secure_url);

    // ---- FIXED: fetch the user document ----
    const userId = req.user._id || req.user.id;
    const user   = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update and save
    user.photos           = urls;
    user.photosCompleted  = true;
    await user.save();

    return res.json({ photos: urls });

  } catch (err) {
    console.error("❌ uploadPhotos error:", err);
    next(err);
  }
};

// 2) Status check for onboarding
exports.getProfileStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      steps: {
        photosCompleted:      user.photosCompleted,
        basicInfoCompleted:   user.basicInfoCompleted,
        lifestyleCompleted:   user.lifestyleCompleted,
        personalityCompleted: user.personalityCompleted,
        intentionsCompleted:  user.intentionsCompleted
      },
      profileComplete: user.profileComplete
    });
  } catch (err) {
    console.error("❌ getProfileStatus error:", err);
    next(err);
  }
};

// 3) Save Basic Info
exports.saveBasicInfo = async (req, res, next) => {
  try {
    const {
      firstname, lastname, pronouns,
      birthday, city, coordinates, gender
    } = req.body;

    const updates = {
      firstname,
      lastname,
      pronouns,
      birthday,
      "location.city": city,
      "location.coordinates": coordinates,
      gender,
      basicInfoCompleted: true
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    );

    return res.json({ user });

  } catch (err) {
    console.error("❌ saveBasicInfo error:", err);
    next(err);
  }
};

// 4) Save Lifestyle
exports.saveLifestyle = async (req, res, next) => {
  try {
    const { job, education, smoking, drinking, kids, religion } = req.body;

    const updates = {
      job,
      education,
      smoking,
      drinking,
      kids,
      religion,
      lifestyleCompleted: true
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    );

    return res.json({ user });
  } catch (err) {
    console.error("❌ saveLifestyle error:", err);
    next(err);
  }
};

// 5) Save Personality
exports.savePersonality = async (req, res, next) => {
  try {
    const { shortBio, interestTags, promptAnswers, favoriteMedia } = req.body;
    const updates = {
      shortBio,
      interestTags,
      promptAnswers,
      favoriteMedia,
      personalityCompleted: true
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    );

    return res.json({ user });
  } catch (err) {
    console.error("❌ savePersonality error:", err);
    next(err);
  }
};

// 6) Save Intentions
exports.saveIntentions = async (req, res, next) => {
  try {
    const { lookingFor } = req.body;
    const updates = {
      lookingFor,
      intentionsCompleted: true
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    );

    return res.json({ user });
  } catch (err) {
    console.error("❌ saveIntentions error:", err);
    next(err);
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error("❌ getMyProfile error:", err);
    next(err);
  }
};
