export default interface CommissionType {
  _id: string;
  user_id: string;
  order_id: string;
  amount: number;
  level: number;
  status: "pending" | "paid" | "cancelled";
  created_at?: Date;
  updated_at?: Date;
  __v?: number;
}
