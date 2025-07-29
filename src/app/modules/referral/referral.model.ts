// models/Referral.ts
import mongoose from "mongoose";

const referralStatsSchema = new mongoose.Schema({
  total_earned: { type: Number, default: 0 },
  total_referrals: { type: Number, default: 0 },
  last_commission_date: { type: Date, default: new Date() },
});

const referralSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    code: {
      type: String,
      unique: true,
      default: function () {
        return "ELUX-" + Math.random().toString(36).substr(2, 8).toUpperCase();
      },
    },
    referred_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    referral_path: {
      level1: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      level2: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      level3: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
    stats: referralStatsSchema,
    commission_rates: {
      level1: { type: Number, default: 5 },
      level2: { type: Number, default: 4 },
      level3: { type: Number, default: 1 },
    },
    wallet: {
      available: { type: Number, default: 0, min: 0 },
      pending: { type: Number, default: 0, min: 0 },
    },
    tier: {
      type: String,
      enum: ["standard", "vip", "ambassador"],
      default: "standard",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Populate referral_path when referred_by changes
referralSchema.pre("save", async function (next) {
  if (this.isModified("referred_by") && this.referred_by) {
    try {
      const referrer: any = await mongoose.model("referral").findOne({
        user: this.referred_by,
      });
      if (referrer) {
        this.referral_path = {
          level1: referrer.user,
          level2: referrer.referred_by,
          level3: referrer.referral_path?.level2,
        };

        referrer.stats.total_referrals += 1;
        referrer.stats.last_commission_date = new Date();
        await referrer.save();

        const grandParent: any = referrer.referred_by
          ? await mongoose
              .model("referral")
              .findOne({ user: referrer.referred_by })
          : null;

        if (grandParent) {
          grandParent.stats.total_referrals += 1;
          grandParent.stats.last_commission_date = new Date();
          await grandParent.save();
        }
      }
    } catch (err) {
      return next(err as Error);
    }
  }
  next();
});

const Referral = mongoose.model("referral", referralSchema);
export default Referral;
