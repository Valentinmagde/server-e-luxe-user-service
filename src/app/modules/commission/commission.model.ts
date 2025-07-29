import mongoose, { Document, Schema } from "mongoose";

export interface ICommission extends Document {
  user_id: mongoose.Types.ObjectId;
  order_id: string;
  amount: number;
  level: number;
  status: 'pending' | 'paid' | 'cancelled';
}

const CommissionSchema = new Schema<ICommission>({
  user_id: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  order_id: { type: String, required: true },
  amount: { type: Number, required: true },
  level: { type: Number, enum: [1, 2, 3], required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
 });

const Commission = mongoose.model('commission', CommissionSchema);

export default Commission;
