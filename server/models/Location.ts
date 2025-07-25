import mongoose from "mongoose";
import type { ILocation } from "~/types/types";

type LocationDocument = ILocation & mongoose.Document;

const options = {
  collection: "location",
};

const LocationSchema = new mongoose.Schema<LocationDocument>(
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
    location_logs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LocationLog'
    }],
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

// export const Location =
//   mongoose.models.Location || mongoose.model("Location", LocationSchema);

export const Location = mongoose.models.Location as mongoose.Model<LocationDocument> || mongoose.model<LocationDocument>('Location', LocationSchema);

