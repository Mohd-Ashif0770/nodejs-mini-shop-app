const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mini_ecom_app",   // YOUR FOLDER NAME
    allowed_formats: ["jpeg", "jpg", "png", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;
