const express = require('express');
const processFile = require("../middlewares/processFile");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
import User from "../models/user";

// Instantiate a storage client with credentials
const credentials = {
  "client_email": process.env.GCS_CLIENT_EMAIL,
  "private_key": process.env.GCS_PRIVATE_KEY,
};
const projectId = process.env.GCS_PROJECT_ID;
const storage = new Storage({ projectId, credentials });

const bucket = storage.bucket("agendyimages");

const router = express.Router();

router.get('/listBuckets', async (req, res) => {
  try {
    const [buckets] = await storage.getBuckets();

    console.log('Buckets:');
    // buckets.forEach(bucket => {
    //   console.log(bucket.name);
    // });
    res.json(buckets)
  } catch (err) {
    console.error('ERROR listBuckets:', err);
    res.status(500).send({ message: err.message });
  }
});

router.post('/:id', async (req, res) => {
  try {
    await processFile(req, res);

    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      console.log ('Este es el error', err)
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );

      const _id = req.params.id;
      const body = req.body;
      try {
          const userDB = await User.findByIdAndUpdate(
              _id, { imageUrl: publicUrl }, { new: true });
          res.json(userDB);
      }
      catch (error) {
          return res.status(400).json({
              mensaje: 'Ocurrio un error', error
          })
      }

    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
});

module.exports = router;