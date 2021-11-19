// import {Storage} from '@google-cloud/storage';
const {Storage} = require('@google-cloud/storage');
require('dotenv').config()

const credentials = {
  "client_email": process.env.GCS_CLIENT_EMAIL,
  "private_key": process.env.GCS_PRIVATE_KEY,
};
const projectId = process.env.GCS_PROJECT_ID;
const storage = new Storage({projectId, credentials});


async function listBuckets() {
  try {
    const [buckets] = await storage.getBuckets();

    console.log('Buckets:');
    buckets.forEach(bucket => {
      console.log(bucket.name);
    });
  } catch (err) {
    console.error('ERROR:', err);
  }
}

async function makeBucketPublic() {
  const bucketName = 'agendyimages';
  await storage.bucket(bucketName).makePublic();

  console.log(`Bucket ${bucketName} is now publicly readable`);
}

makeBucketPublic();