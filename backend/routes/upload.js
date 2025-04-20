const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const cors = require("cors");
const router = express.Router();
require("dotenv").config();

const upload = multer();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

router.post("/", upload.single("file"), async (req, res) => {
  const { name, id } = req.body;
  const file = req.file;

  if (!name || !id || !file) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const fileName = `${name}_${id}_${Date.now()}.jpg`;
  const s3Params = {
    Bucket: "connectwise-app",
    Key: `images/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(s3Params).promise();
    res.json({ url: data.Location });
  } catch (err) {
    console.error("S3 Upload Error:", err);
    res.status(500).send("Upload failed");
  }
});

module.exports = router;