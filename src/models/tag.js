const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema = new Schema({
    tag_name: String,
    images: [{ref: 'Image', type: mongoose.Types.ObjectId}]
});

// Image varaible basically represents a class that takes on imageSchema
// as the template
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;










