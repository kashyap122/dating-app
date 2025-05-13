const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload.middleware');
const ensureAuth = require('../middlewares/auth.middleware');
const {
  uploadPhotos,
  saveBasicInfo,
  saveLifestyle,
  savePersonality,
  saveIntentions,
  getProfileStatus
} = require('../controllers/profile.controller');

// Step 1: photo uploads
router.post(
  '/photos',
  ensureAuth,
  upload.array('photos', 6),
  uploadPhotos
);

// Status check (StepGuard calls this)
router.get(
  '/status',
  ensureAuth,
  getProfileStatus
);

// Step 2: basic info
router.post(
  '/basic',
  ensureAuth,
  saveBasicInfo
);

// Step 3: lifestyle
router.post(
  '/lifestyle',
  ensureAuth,
  saveLifestyle
);

// Step 4: personality & interests
router.post(
  '/personality',
  ensureAuth,
  savePersonality
);

// Step 5: intentions
router.post(
  '/intentions',
  ensureAuth,
  saveIntentions
);

module.exports = router;
