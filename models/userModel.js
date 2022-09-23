const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;
const opts = {
  toJSON: { virtuals: true },
  toObject: {
    virtuals: true,
    transform: (doc, ret, opts) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
};
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    }
  },
  opts
);
UserSchema.plugin(passportLocalMongoose, {
  limitAttempts: true,
  maxAttempts: 5,
  unlockInterval: 30000,
  interval: 2000
});
module.exports.UserModel =
  mongoose.model.User || mongoose.model('User', UserSchema);
