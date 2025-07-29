import { Document, Types } from "mongoose";

export interface IWithdrawal extends Document {
  user: Types.ObjectId;
  amount: number;
  bank_details: IBankDetails;
  status: 'pending' | 'processed' | 'rejected' | 'approved';
  processed_at: Date;
}

export interface IBankDetails {
  iban: string;
  bic: string;
  account_holder: string;
}
