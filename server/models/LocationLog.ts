import mongoose from "mongoose";
import type { ILocationLog } from "~/types/types";

type LocationLogDocument = ILocationLog & mongoose.Document;

const options = {
  collection: "location_log",
};

const LocationLogSchema = new mongoose.Schema<LocationLogDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    started_at: {
      type: Number,
      required: true,
    },
    ended_at: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
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
LocationLogSchema.pre("save", function (next) {
  this.updated_at = Math.floor(Date.now() / 1000);
  next();
});

// export const LocationLog =
//   mongoose.models.LocationLog ||
//   mongoose.model("LocationLog", LocationLogSchema);

export const LocationLog = mongoose.models.LocationLog as mongoose.Model<LocationLogDocument> || mongoose.model<LocationLogDocument>('LocationLog', LocationLogSchema);
