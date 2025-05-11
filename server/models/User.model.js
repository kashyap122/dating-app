// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     googleId: { type: String, unique: true, sparse: true },
//     profilePic: { type: String, default: '' },
//     firstname: { type: String, required: true },
//     lastname: { type: String, required: true },
//     username: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);
// module.exports = User;

const mongoose = require("mongoose");

// Schema for tracking user interaction events for score history
const profileStatusSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['ghosted', 'responded', 'liked_back', 'unmatched', 'message_sent'],
    required: true
  },
  timestamp: { type: Date, default: Date.now },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const userSchema = new mongoose.Schema(
  {
    // Basic auth fields
    googleId: { type: String, unique: true, sparse: true },
    profilePic: { type: String, default: '' },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },

    // Photo URLs: allow 3–6 photos, required
    photos: {
      type: [String],
      validate: [
        photos => photos.length >= 3 && photos.length <= 6,
        'Must provide between 3 and 6 photos'
      ],
      required: true
    },

    // Basic personal info
    pronouns: { type: String, enum: ['he/him', 'she/her', 'they/them', 'other'], default: 'other' },
    birthday: { type: Date, required: true },
    location: {
      city: { type: String, trim: true },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
      }
    },
    gender: { type: String, enum: ['male', 'female', 'non-binary', 'other'], required: true },

    // Lifestyle & compatibility
    job: { type: String, trim: true },
    education: { type: String, trim: true },
    smoking: { type: String, enum: ['no', 'occasionally', 'yes'], default: 'no' },
    drinking: { type: String, enum: ['no', 'occasionally', 'yes'], default: 'no' },
    kids: { type: String, enum: ['none', 'has', 'wants', 'unsure'], default: 'none' },
    religion: { type: String, default: 'Prefer not to say' },

    // Personality & interests
    shortBio: { type: String, maxlength: 300 },
    interestTags: { type: [String], maxlength: 5 },
    promptAnswers: [
      {
        question: { type: String, trim: true },
        answer: { type: String, trim: true }
      }
    ],
    favoriteMedia: {
      book: { type: String, trim: true },
      movie: { type: String, trim: true },
      sitcom: { type: String, trim: true },
      series: { type: String, trim: true },
      song: { type: String, trim: true }
    },

    // Intentions
    lookingFor: [{ type: String, enum: ['long-term', 'short-term', 'friends', 'networking'] }],

    // Hidden scoring system
    profileScore: { type: Number, default: 100, min: 0, max: 100 },
    profileStatusHistory: [profileStatusSchema]
  },
  { timestamps: true }
);

// 2dsphere index for geospatial queries on location.coordinates
userSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('User', userSchema);
