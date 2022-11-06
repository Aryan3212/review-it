const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;
const opts = {
    strict: true,
    strictQuery: false,
    timestamps: true,
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
        username: {
            type: String,
            unique: true
        },
        verified: { type: Boolean, required: true, default: false }
    },
    opts
);
UserSchema.plugin(passportLocalMongoose, {
    limitAttempts: true,
    maxAttempts: 5,
    unlockInterval: 30000,
    interval: 2000,
    usernameField: 'email',
    usernameQueryFields: ['email']
});
module.exports.UserModel =
    mongoose.model.User || mongoose.model('User', UserSchema);
