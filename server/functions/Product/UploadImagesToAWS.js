const S3 = require("aws-sdk/clients/s3");
const tinify = require("tinify");
const sharp = require("sharp");
const accessKeyId = process.env.S3_ACCESS_KEY
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY

async function UploadImagesToAWS({name, basket, file, size}) {
    const fixedBasket = process.env.NODE_ENV === "production" ? basket : 'lamiya/test'
    const s3 = new S3({
        region: 'eu-central-1', accessKeyId, secretAccessKey
    })
    tinify.key = process.env.TINIFY_API_KEY;
    // const source = tinify.fromFile(file.path);

    // const webpResize = await source
    //     .resize({width: size, height: size, method: 'fit'})
    //     .convert({type: ["image/webp"]})
    //     .transform({background: "#ffffff"})
    //     .toBuffer();
    const webpResize = await sharp(file.path)
        .resize({
            width: size,
            height: size,
            fit: 'contain',
            background: '#ffffff'
        })
        .flatten({background: '#ffffff'})
        .toFormat('webp')
        .toBuffer();
    const uploadParamsWebpResize = {
        Bucket: fixedBasket,
        Body: webpResize,
        Key: name.replace("-hq-", "-lq-"),
        ACL: 'public-read',
        ContentType: 'image/webp',
        CacheControl: 'max-age=31536000'
    };
    s3.upload(uploadParamsWebpResize).promise();

    // const webp = await source
    //     .convert({type: ["image/webp"]})
    //     .transform({background: "#ffffff"})
    //     .toBuffer();
    const webp = await sharp(file.path)
        .flatten({background: '#ffffff'})
        .toFormat('webp')
        .toBuffer();
    const uploadParamsWebp = {
        Bucket: fixedBasket,
        Body: webp,
        Key: name,
        ACL: 'public-read',
        ContentType: 'image/webp',
        CacheControl: 'max-age=31536000'
    };
    s3.upload(uploadParamsWebp).promise();


    const jpg = await sharp(file.path)
        .flatten({background: '#ffffff'})
        .jpeg()
        .toBuffer();
    const uploadParamsJpg = {
        Bucket: fixedBasket,
        Body: jpg,
        Key: name.replace(".webp", ".jpg"),
        ACL: 'public-read',
        ContentType: 'image/jpeg',
        CacheControl: 'max-age=31536000'
    };
    s3.upload(uploadParamsJpg).promise();
}

module.exports = UploadImagesToAWS;