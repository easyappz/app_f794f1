'use strict';

const mongoose = require('mongoose');
const { isBase64Under1MB } = require('@src/utils/base64');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    avatarBase64: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          if (v == null || v === '') return true;
          return isBase64Under1MB(v);
        },
        message: 'avatarBase64 exceeds 1 MB limit',
      },
    },
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });

// Basic size validation in pre-save as a safety net
userSchema.pre('save', function (next) {
  try {
    if (this.isModified('avatarBase64') && this.avatarBase64) {
      if (!isBase64Under1MB(this.avatarBase64)) {
        return next(new Error('avatarBase64 exceeds 1 MB limit'));
      }
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

// Hide passwordHash in JSON
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
