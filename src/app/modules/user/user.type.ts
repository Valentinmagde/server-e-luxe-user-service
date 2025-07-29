import GenderType from "../gender/gender.type";
import RoleType from "../role/role.type";
import { Types } from "mongoose";

export default interface UserType {
  _id: string;
  first_name: string;
  last_name: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  current_password: string;
  new_password: string;
  confirm_password: string;
  password: string;
  gender: GenderType | string;
  avatar: string;
  cover: string;
  roles: Array<string | RoleType>;
  billing_address: BillingAddress;
  delivery_address: DeliveryAddress;
  vendor: Vendor;
  referral: Referral;
  status: string;
  referral_code: string;
  referred_by: string;
  is_deleted: boolean;
  online: boolean;
  created_at: Date;
  updated_at: Date;
}

interface Vendor {
  personal_info: PersonalInfo;
  store_info: StoreInfo;
  payment_options: PaymentOptions;
  vendor_options: VendorOptions;
}
interface PersonalInfo {
  country: string;
  state: string;
  currency: string;
  log: string;
  description: string;
  rating: number;
  num_reviews: number;
}

interface BillingAddress {
  first_name: string;
  last_name: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  postal_code: number;
  country: string;
  state: string;
  phone: string;
  email: string;
}

interface DeliveryAddress {
  first_name: string;
  last_name: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  postal_code: number;
  country: string;
  state: string;
  phone: string;
  email: string;
}

interface StoreInfo {
  name: string;
  url: string;
  address1: string;
  address2: string;
  city: string;
  zip_code: string;
  country: string;
  state: string;
  business_hour: Array<BusinessHour>;
  email: string;
  phone: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  instagram: string;
  is_open: boolean;
}

interface PaymentOptions {
  bank_name: string;
  account_name: string;
  account_number: number;
  bank_address: string;
  routing_number: number;
  bank_iban: number;
  bank_swift: string;
}
interface VendorOptions {
  selling: boolean;
  publishing: boolean;
  feature_vendor: boolean;
}

interface BusinessHour {
  _id: string;
  day: string;
  start_time: string;
  end_time: string;
  created_at: Date;
  updated_at: Date;
}

interface Referral {
  code: string;
  referred_by: Types.ObjectId;
  referral_path: ReferralPath;
  stats: Stats;
  commission_rates: CommissionRates;
  wallet: Wallet;
  tier: string;
}

interface ReferralPath {
  level1: string;
  level2: string;
  level3: string;
}

interface Stats {
  total_earned: number;
  total_referrals: number;
  last_commission_date: Date;
}

interface CommissionRates {
  level1: number;
  level2: number;
  level3: number;
}

interface Wallet {
  available: number;
  pending: number;
}
