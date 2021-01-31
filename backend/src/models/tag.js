const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema = new Schema({
    name: {type: String, unique: true},
    images: [{ref: 'Image', type: mongoose.Types.ObjectId}]
});

// Image varaible basically represents a class that takes on imageSchema
// as the template
const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;










