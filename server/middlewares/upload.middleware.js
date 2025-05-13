const multer = require('multer');

// keep uploads in memory for streaming into Cloudinary
module.exports = multer({ storage: multer.memoryStorage() });
