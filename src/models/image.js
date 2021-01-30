const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema({
  title:  String, // String is shorthand for {type: String}
  path: String,
  mimetype:   String,
  date_created: {
      type: Date,
      default: Date.now()
  }
  // dont need id cuz mongo auto generate one

});

// Image varaible basically represents a class that takes on imageSchema
// as the template
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;










