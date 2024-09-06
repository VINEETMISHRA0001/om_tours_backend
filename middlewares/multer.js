const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Helper function to create directory if it doesn't exist
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Setup for images
const multerStorageImages = multer.memoryStorage();
const multerFilterImages = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'));
  }
};
const uploadImages = multer({
  storage: multerStorageImages,
  fileFilter: multerFilterImages,
});

// Setup for documents
const multerStorageDocuments = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/uploads/docs';
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `document-${Date.now()}${ext}`;
    cb(null, filename);
  },
});
const multerFilterDocuments = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Not a valid document! Please upload only PDFs or Word documents.'
      )
    );
  }
};
const uploadDocuments = multer({
  storage: multerStorageDocuments,
  fileFilter: multerFilterDocuments,
});

// Middleware to handle image uploads
exports.uploadVehicleImages = uploadImages.array('images', 5);

// Middleware to handle document uploads
exports.uploadProofDocument = uploadDocuments.single('proof_document');

// Middleware to resize images
exports.resizeVehicleImages = async (req, res, next) => {
  if (!req.files) return next();
  req.body.images = [];
  try {
    await Promise.all(
      req.files.map(async (file, i) => {
        const filename = `vehicle-${Date.now()}-${i + 1}.png`;
        await sharp(file.buffer)
          .resize(1000, 1000)
          .toFormat('png')
          .png({ quality: 90 })
          .toFile(`public/uploads/images/${filename}`);
        req.body.images.push(`/uploads/images/${filename}`);
      })
    );
    next();
  } catch (error) {
    next(error);
  }
};
