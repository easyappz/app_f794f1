const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
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
      minlength: 2,
      maxlength: 50,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
      maxlength: 300,
    },
    avatarBase64: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.method('toClient', function toClient(includeEmail = false) {
  return {
    id: this._id.toString(),
    ...(includeEmail ? { email: this.email } : {}),
    displayName: this.displayName,
    bio: this.bio || '',
    avatarBase64: this.avatarBase64 || '',
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

module.exports = mongoose.model('User', UserSchema);
