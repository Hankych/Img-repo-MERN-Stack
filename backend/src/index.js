// Configuration from Express website
const express = require('express')
const app = express()
const port = 3000
// Configuration from Mongoose website
const mongoose = require('mongoose');
// Import multer
const multer = require('multer')
// Creates a folder to store uploads in my project folder
const upload = multer({dest: "uploads/"})
// Require path module which is built into Node.js
const path = require('path')
// Import package axious for Imagga
const axios = require('axios') // got is trash
// Import FormData package
const FormData = require('form-data')
const fs = require('fs')
// Define cors access
const cors = require('cors')
app.use(cors())

// Require env npm package so I can get API key from env file
require('dotenv').config()


// import image model 
const Image = require('./models/image.js');
// import tag model
const Tag = require('./models/tag');

app.get('/', (req, res) => {
  res.send('Hello Whatever!')
})

// get a list of images
// /image/image_id
app.get('/image/:image_id', async (req, res) => {
  // Image automatically refers to MongoDB cuz
let img = await Image.findById(req.params.image_id)
res.set('Content-Type', img.mimetype)
  res.sendFile(path.resolve(img.path))
})

// get an image
app.get('/images', async(req, res) => {
  // find all documents
  let img_all = await Image.find({})
  let img_all_path = [];
  for (let i = 0; i < img_all.length; i++) {
    img_all_path[i] = "http://localhost:3000/image/" + img_all[i]._id
  }
  res.send(img_all_path)
})

// search for images with certain tag
app.get('/search', async (req, res) => {
  if(!req.query.tags) {
    return res.redirect("/images")
  }
  let searchTags = req.query.tags.split(',')
  let tagCount = {}
  let searchResults = []
  for (let i = 0; i < searchTags.length; i++) {
    let tagImages = await Tag.findOne({ name: searchTags[i] })
    if (!tagImages) {
      searchResults = {error: `Tag does not exist: ${searchTags[i]}`}
      break
    }
    tagImages = tagImages.images

    tagImages.forEach((id) => {
      if (!tagCount[id]) {
        tagCount[id] = 0
      }
      tagCount[id]++;

      if (tagCount[id] == searchTags.length) {
        searchResults.push(`http://localhost:3000/image/${id}`)
      }
    })
    console.log(tagCount)
  }

  res.send(searchResults)
})

app.post('/image', upload.single("image"), 
async (req, res, next) => {
  // can only have one res.send
  // req.file is the image details in JSON format
  // res.send(file)
  let file = req.file;
  let Img = new Image({
    title: file.originalname,
    path: file.path,
    mimetype: file.mimetype,
  })

  await Img.save()
  req.img = Img;

  res.send("File uploaded successfully!")

  next()
},
async (req, res) => {
  let formData = new FormData();
  formData.append('image', fs.createReadStream(path.resolve(req.file.path)))
  try {
    let res = await axios({
      method: 'post',
      url: 'https://api.imagga.com/v2/tags',
      data: formData,
      headers: formData.getHeaders(),
      auth: {
        username: process.env.IMAGGA_API_KEY,
        password: process.env.IMAGGA_API_SECRET
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    console.log(res.data);

    let tags = res.data.result.tags.slice(0, 5).map(t => t.tag.en);
    
    console.log(tags);

    for(let i = 0; i < tags.length; i++) {
      let tag = await Tag.findOne({name: tags[i]})
      if(!tag) {
        tag = new Tag({
          name: tags[i],
          images: []
        });
      }
      // add image to tag
      tag.images.push(req.img._id)
      await tag.save()

      // add tags to image
      req.img.tags.push(tag._id)
      await req.img.save();
      
    }

  } catch (err) {
    console.log(err);
  }
})


async function main() {
// Configuration from Mongoose website
await mongoose.connect('mongodb://localhost:27017/img_repo', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log("Connected to the databse!")
});

/*
// One time upload image detail to mongo database
let testImg = new Image({
  title: "Test Image",
  path: "my computer",
  mimetype: ".exe",
  date_created: new Date()
})
await testImg.save()
*/

// Configuration from Express website
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})}

main();
