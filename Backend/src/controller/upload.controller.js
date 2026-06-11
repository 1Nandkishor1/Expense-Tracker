let Imagekit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
let imageModel=require('../model/image.model');

let imagekit = new Imagekit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadImage(req, res) {
  try {
    const response = await imagekit.files.upload({
      file: await toFile(Buffer.from(req.file.buffer), req.file.originalname),
      fileName: req.file.originalname,
      folder: "/expenses",
    });

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error uploading image:", err);
  }


let imageData = await imageModel.create({
    imageUrl: response.url

})

}

module.exports = { uploadImage };
