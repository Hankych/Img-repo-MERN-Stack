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

// import image model 
const Image = require('./models/image.js');

app.get('/', (req, res) => {
  res.send('Hello Whatever!')
})

// /image/image_id
app.get('/image/:image_id', async (req, res) => {
  // Image automatically refers to MongoDB cuz
let img = await Image.findById(req.params.image_id)
res.set('Content-Type', img.mimetype)
  res.sendFile(path.resolve(img.path))
})

app.get('/images', async(req, res) => {
  // find all documents
  let img_all = await Image.find({})
  let img_all_path = [];
  for (let i = 0; i < img_all.length; i++) {
    img_all_path[i] = "http://localhost:3000/image/" + img_all[i]._id
  }
  res.send(img_all_path)
})

app.post('/image', upload.single("image"), 
async (req, res) => {
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
  res.send("File uploaded successfully!")
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
