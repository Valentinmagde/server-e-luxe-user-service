import mongoose from "mongoose";

const genderSchema = new mongoose.Schema(
  {
    name: { type: Object, required: false, unique: true },
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

const Gender = mongoose.model("gender", genderSchema);

export default Gender;
