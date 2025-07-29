export default interface ReferralType {
  _id: string;
  user: string;
  code: string;
  referred_by: string;
  referral_path: ReferralPath;
  stats: Stats;
  commission_rates: CommissionRates;
  wallet: Wallet;
  tier: string;
  created_at: Date;
  updated_at: Date;
  __v: number;
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
