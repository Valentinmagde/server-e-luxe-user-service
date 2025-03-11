import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    type: { type: String, enum: ["newsletter", "premium"], required: true },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date },
    status: { type: String, required: false, default: "Active", enum: ["Active", "Inactive"] },
    is_deleted: { type: Boolean, default: false, required: false },
    deleted_at: { type: Date },
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

subscriberSchema.pre(/^find/, function (next) {
  // Ignorer les enregistrements marqués comme supprimés
  if (this instanceof mongoose.Query) {
    this.where({ is_deleted: false }); // Filtrer les enregistrements non supprimés
  }
  next();
});

subscriberSchema.methods.softDelete = async function () {
  this.is_deleted = true;
  this.deleted_at = new Date();
  this.email = `${this.email}_deleted_${Date.now()}`; // Ajouter un suffixe unique
  await this.save();
};

const Subscriber = mongoose.model("subscriber", subscriberSchema);

export default Subscriber;
