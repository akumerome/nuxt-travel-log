import mongoose from "mongoose";

const options = {
  collection: "user",
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000), // UNIX timestamp in seconds
    },
    updated_at: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000),
    },
  },
  options
);

// Update updated_at on save
UserSchema.pre("save", function (next) {
  this.updated_at = Math.floor(Date.now() / 1000);
  next();
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
