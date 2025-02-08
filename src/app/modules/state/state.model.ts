import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
  {
    id: { type: Number, require: true },
    name: { type: String, require: true },
    country_id: { type: String, require: true },
    country_code: { type: String, require: true },
    country_name: { type: String, require: true },
    state_code: { type: String, require: true },
    type: { type: String, require: true },
    latitude: { type: String, require: true },
    longitude: { type: String, require: true },
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the updated date
    },
  }
);

const State = mongoose.model("state", stateSchema);

export default State;
