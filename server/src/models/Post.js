'use strict';

const mongoose = require('mongoose');
const { isBase64Under1MB } = require('@src/utils/base64');

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },
    imageBase64: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          if (v == null || v === '') return true;
          return isBase64Under1MB(v);
        },
        message: 'imageBase64 exceeds 1 MB limit',
      },
    },
  },
  { timestamps: true }
);

// Feed index: author + createdAt
postSchema.index({ author: 1, createdAt: -1 });

// Basic size validation in pre-save as a safety net
postSchema.pre('save', function (next) {
  try {
    if (this.isModified('imageBase64') && this.imageBase64) {
      if (!isBase64Under1MB(this.imageBase64)) {
        return next(new Error('imageBase64 exceeds 1 MB limit'));
      }
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('Post', postSchema);
