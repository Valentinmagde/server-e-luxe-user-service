import mongoose, { Document, Schema } from "mongoose";

export interface IConsent extends Document {
  user_id: mongoose.Types.ObjectId;
  session_id: string;
  ip: string;
  user_agent: string;
  categories: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  given_at: Date;
}

const ConsentSchema = new Schema<IConsent>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "user", required: false },
    session_id: { type: String, required: true },
    ip: { type: String, required: true },
    user_agent: { type: String, required: true },
    categories: {
      necessary: { type: Boolean, default: true },
      analytics: { type: Boolean, default: false },
      marketing: { type: Boolean, default: false },
    },
    given_at: { type: Date, default: Date.now },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Consent = mongoose.model("consent", ConsentSchema);

export default Consent;

export interface IToken extends Document {
  user_id: mongoose.Types.ObjectId;
  token: string;
  expires_at: Date;
  type: string;
}

const TokenSchema = new Schema<IToken>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
    token: { type: String, required: true },
    expires_at: { type: Date, default: Date.now },
    type: { type: String, enum: ["export", "delete"], default: "export" },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const Token = mongoose.model("token", TokenSchema);
