import mongoose from "mongoose";

interface Location {
  name: string;
  slug: string;
  description?: string;
  lat: number;
  long: number;
  user: mongoose.Schema.Types.ObjectId;
  created_at: number;
  updated_at: number;
}

const options = {
  collection: "location",
};

const LocationSchema = new mongoose.Schema<Location>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
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

// The combination of slug and user must be unique (composite key)
LocationSchema.index({ slug: 1, user: 1 }, { unique: true });

// Update updated_at on save
LocationSchema.pre("save", function (next) {
  this.updated_at = Math.floor(Date.now() / 1000);
  next();
});

export const Location =
  mongoose.models.Location || mongoose.model("Location", LocationSchema);
