import mongoose, {
  Document,
  Schema,
  Types,
  Model,
  Query,
} from "mongoose";

export interface IBankDetails {
  iban?: string;
  bic?: string;
  account_holder: string;
  paypal_email?: string;
  crypto_wallet?: string;
  bank_name?: string;
}

export interface IWithdrawal extends Document {
  user: Types.ObjectId;
  amount: number;
  payment_details: IBankDetails;
  currency: string;
  payment_method: "bank_transfer" | "paypal" | "crypto";
  status:
    | "pending"
    | "approved"
    | "processing"
    | "completed"
    | "rejected"
    | "cancelled";
  processed_at?: Date;
  rejection_reason?: string;
  admin_notes?: string;
  transaction_id?: string;
  deleted_at?: Date;
  is_deleted?: boolean;

  // Instance methods
  softDelete(): Promise<IWithdrawal>;
  restore(): Promise<IWithdrawal>;
}

interface IWithdrawalQueryHelpers {
  withDeleted(): Query<any, Document<IWithdrawal>> & IWithdrawalQueryHelpers;
  onlyDeleted(): Query<any, Document<IWithdrawal>> & IWithdrawalQueryHelpers;
}

interface IWithdrawalModel
  extends Model<IWithdrawal, IWithdrawalQueryHelpers> {
  softDeleteById(id: Types.ObjectId | string): Promise<IWithdrawal | null>;
}

// Schéma pour les détails bancaires
const BankDetailsSchema = new Schema(
  {
    iban: { type: String, required: false },
    bic: { type: String, required: false },
    account_holder: { type: String, required: true },
    paypal_email: { type: String, required: false },
    crypto_wallet: { type: String, required: false },
    bank_name: { type: String, required: false },
  },
  { _id: false }
);

const withdrawalSchema = new Schema<
  IWithdrawal,
  IWithdrawalModel,
  IWithdrawalQueryHelpers
>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount: { type: Number, required: true, min: 50 },
    currency: {
      type: String,
      required: true,
      enum: ["EUR", "USD", "GBP"],
      default: "USD",
    },
    payment_method: {
      type: String,
      required: true,
      enum: ["bank_transfer", "paypal", "crypto"],
      default: "bank_transfer",
    },
    payment_details: BankDetailsSchema,
    status: {
      type: String,
      enum: [
        "pending",
        "rejected",
        "approved",
        "cancelled",
        "processing",
        "completed",
      ],
      default: "pending",
    },
    processed_at: { type: Date, default: new Date(), required: true },
    rejection_reason: { type: String },
    admin_notes: { type: String },
    transaction_id: { type: String },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Instance methods
withdrawalSchema.methods.softDelete = function () {
  this.is_deleted = true;
  this.deleted_at = new Date();
  return this.save();
};

withdrawalSchema.methods.restore = function () {
  this.is_deleted = false;
  this.deleted_at = null;
  return this.save();
};

// Static methods
withdrawalSchema.statics.softDeleteById = async function (
  id: Types.ObjectId | string
) {
  return this.findByIdAndUpdate(
    id,
    {
      is_deleted: true,
      deleted_at: new Date(),
    },
    { new: true }
  );
};

/**
 * Middleware pour exclure les enregistrements supprimés
 * @param {any} this the query
 * @param {any} next the callback
 * @return {void}
 */
function excludeDeletedMiddleware(
  this: Query<any, Document<IWithdrawal>>,
  next: () => void
): void {
  if (this.getFilter().is_deleted === undefined) {
    this.where({ is_deleted: false });
  }
  next();
}

withdrawalSchema.pre("find", excludeDeletedMiddleware);
withdrawalSchema.pre("findOne", excludeDeletedMiddleware);
withdrawalSchema.pre("findOneAndUpdate", excludeDeletedMiddleware);
withdrawalSchema.pre("count", excludeDeletedMiddleware);
withdrawalSchema.pre("countDocuments", excludeDeletedMiddleware);

export default mongoose.model<IWithdrawal, IWithdrawalModel>(
  "withdrawal",
  withdrawalSchema
);
