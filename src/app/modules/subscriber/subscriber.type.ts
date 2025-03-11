export default interface SubscriberType {
  _id: string;
  email: string;
  type: "newsletter" | "premium";
  start_date: Date;
  end_date: Date;
  status: "active" | "inactive";
  is_deleted: boolean;
}
