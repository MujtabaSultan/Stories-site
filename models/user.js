const mongoose = require("mongoose");



const commentSchema = new mongoose.Schema(
  {
    content: String,
    author: String,
  }

 
);
const storySchema = new mongoose.Schema(
  {
    name: String,
    genre: String,
    date: Date,
    content: String,
    editable: Boolean,
    comments: [commentSchema],
  },

  { timestamps: true }
);


const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  stories: [storySchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
