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

const userSchema = new mongoose.Schema({
  // Basic auth fields
  googleId:   { type: String, unique: true, sparse: true },
  profilePic: { type: String, default: '' },
  firstname:  { type: String, required: true, trim: true },
  lastname:   { type: String, required: true, trim: true },
  username:   { type: String, required: true, unique: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String },

  // Step 1: photos
  photos: {
    type: [String],
    default: []  // allow empty on signup
  },
  photosCompleted: { type: Boolean, default: false },

  // Step 2: basic info
  pronouns:            { type: String, enum: ['he/him','she/her','they/them','other'], default: null },
  birthday:            { type: Date, default: null },
  location: {
    city:            { type: String, trim: true, default: '' },
    coordinates: {
      type:        { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    }
  },
  gender:            { type: String, enum: ['male','female','non-binary','other'], default: null },
  basicInfoCompleted:{ type: Boolean, default: false },

  // Step 3: lifestyle
  job:                { type: String, trim: true, default: '' },
  education:          { type: String, trim: true, default: '' },
  smoking:            { type: String, enum: ['no','occasionally','yes'], default: 'no' },
  drinking:           { type: String, enum: ['no','occasionally','yes'], default: 'no' },
  kids:               { type: String, enum: ['none','has','wants','unsure'], default: 'none' },
  religion:           { type: String, default: 'Prefer not to say' },
  lifestyleCompleted: { type: Boolean, default: false },

  // Step 4: personality & interests
  shortBio:            { type: String, maxlength: 300, default: '' },
  interestTags:        { type: [String], maxlength: 5, default: [] },
  promptAnswers: [{
    question: { type: String, trim: true, default: '' },
    answer:   { type: String, trim: true, default: '' }
  }],
  favoriteMedia: {
    book:   { type: String, trim: true, default: '' },
    movie:  { type: String, trim: true, default: '' },
    sitcom: { type: String, trim: true, default: '' },
    series: { type: String, trim: true, default: '' },
    song:   { type: String, trim: true, default: '' }
  },
  personalityCompleted: { type: Boolean, default: false },

  // Step 5: intentions
  lookingFor:           [{ type: String, enum: ['long-term','short-term','friends','networking'] }],
  intentionsCompleted:  { type: Boolean, default: false },

  // Hidden scoring system
  profileScore:       { type: Number, default: 100, min: 0, max: 100 },
  profileStatusHistory:[profileStatusSchema]
}, { timestamps: true });

// Virtual to check overall completion
userSchema.virtual('profileComplete').get(function() {
  return (
    this.photosCompleted &&
    this.basicInfoCompleted &&
    this.lifestyleCompleted &&
    this.personalityCompleted &&
    this.intentionsCompleted
  );
});

// 2dsphere index for geospatial queries
userSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('User', userSchema);
