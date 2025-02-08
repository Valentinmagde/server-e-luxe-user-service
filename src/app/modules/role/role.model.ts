import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: { type: Object, required: true }
  },
  {
    timestamps: {
      createdAt: 'created_at', // Use `created_at` to store the created date
      updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
  }
);

const Role = mongoose.model('role', roleSchema);

export default Role;
