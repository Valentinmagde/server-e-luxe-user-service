export default interface ConsentType {
  _id: string;
  user_id: string;
  session_id: string;
  ip: string;
  user_agent: string;
  categories: Categories;
  given_at: Date;
  created_at?: Date;
  updated_at?: Date;
  __v?: number;
}

interface Categories {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}
