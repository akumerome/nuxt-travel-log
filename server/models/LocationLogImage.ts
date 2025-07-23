import mongoose from "mongoose";

const options = {
  collection: "location_log_image",
};

const LocationLogImageSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    location_log: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocationLog",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
LocationLogImageSchema.pre("save", function (next) {
  this.updated_at = Math.floor(Date.now() / 1000);
  next();
});

export const LocationLogImage =
  mongoose.models.LocationLogImage ||
  mongoose.model("LocationLogImage", LocationLogImageSchema);
