import passwordHash from "../../utils/password-hash.util";
import mongoose from "mongoose";

const businessHourSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// const referralStatsSchema = new mongoose.Schema({
//   total_earned: { type: Number, default: 0 },
//   total_referrals: { type: Number, default: 0 },
//   last_commission_date: { type: Date },
// });

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    name: { type: String, required: false },
    image: { type: String, required: false },
    billing_address: {
      first_name: { type: String, required: false },
      last_name: { type: String, required: false },
      company: { type: String, required: false },
      address1: { type: String, required: false },
      address2: { type: String, required: false },
      city: { type: String, required: false },
      postal_code: { type: Number, required: false },
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "country",
        required: false,
      },
      state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "state",
        required: false,
      },
      phone: { type: String, required: false },
      email: { type: String, required: false },
    },
    delivery_address: {
      name: { type: String, required: false },
      first_name: { type: String, required: false },
      last_name: { type: String, required: false },
      company: { type: String, required: false },
      address1: { type: Object, required: false },
      address2: { type: Object, required: false },
      city: { type: String, required: false },
      postal_code: { type: Number, required: false },
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "country",
        required: false,
      },
      state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "state",
        required: false,
      },
      phone: { type: String, required: false },
      email: { type: String, required: false },
    },
    vendor: {
      personal_info: {
        country: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "country",
          required: false,
        },
        state: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "state",
          required: false,
        },
        currency: { type: String, required: false },
        logo: { type: String, required: false },
        description: { type: String, required: false },
        rating: { type: Number, required: false },
        num_reviews: { type: Number, required: false },
      },
      store_info: {
        name: { type: String, required: false },
        url: { type: String, required: false },
        address1: { type: String, required: false },
        address2: { type: String, required: false },
        city: { type: String, required: false },
        zip_code: { type: Number, required: false },
        country: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "country",
          required: false,
        },
        state: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "state",
          required: false,
        },
        business_hour: [businessHourSchema],
        phone: { type: String, required: false },
        email: { type: String, required: false },
        facebook: { type: String, required: false },
        twitter: { type: String, required: false },
        linkedin: { type: String, required: false },
        youtube: { type: String, required: false },
        instagram: { type: String, required: false },
        is_open: { type: Boolean, default: false, required: false },
      },
      payment_options: {
        bank_name: { type: String, required: false },
        account_name: { type: String, required: false },
        account_number: { type: Number, required: false },
        bank_address: { type: String, required: false },
        routing_number: { type: Number, required: false },
        bank_iban: { type: Number, required: false },
        bank_swift: { type: String, required: false },
      },
      vendor_options: {
        selling: { type: Boolean, default: false, required: false },
        publishing: { type: Boolean, default: false, required: false },
        feature_vendor: { type: Boolean, default: false, required: false },
      },
    },
    // referral: {
    //   code: {
    //     type: String,
    //     unique: true,
    //     default: function () {
    //       return "ELUX-" + Math.random().toString(36).substr(2, 8).toUpperCase();
    //     },
    //   },
    //   referred_by: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "user",
    //   },
    //   referral_path: {
    //     level1: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Parrain direct
    //     level2: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Parrain du parrain
    //     level3: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Niveau 3
    //   },
    //   stats: referralStatsSchema,
    //   commission_rates: {
    //     level1: { type: Number, default: 5 }, // 5% pour niveau 1
    //     level2: { type: Number, default: 4 }, // 4% pour niveau 2
    //     level3: { type: Number, default: 1 }, // 1% pour niveau 3
    //   },
    //   wallet: {
    //     available: { type: Number, default: 0, min: 0 },
    //     pending: { type: Number, default: 0, min: 0 },
    //   },
    //   tier: {
    //     type: String,
    //     enum: ["standard", "vip", "ambassador"],
    //     default: "standard",
    //   },
    // },
    referral: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Referral",
      required: false,
    },
    username: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      select: false,
      default: passwordHash.createHash("12345678"),
    },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    gender: { type: mongoose.Schema.Types.ObjectId, ref: "gender" },
    joining_date: { type: Date, required: false },
    avatar: { type: String, required: false },
    cover: { type: String, required: false },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "role" }],
    currency: { type: String, required: false },
    country: { type: String, required: false },
    city: { type: String, required: false },
    status: {
      type: String,
      required: false,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "role" },
    is_deleted: { type: Boolean, default: false, required: false },
    online: { type: Boolean, default: false, required: false },
    reset_password_token: { type: String, required: false },
    reset_password_expires: {
      type: Date,
      default: Date.now(),
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

// Index pour les recherches de parrainage
// userSchema.index({ "referral.code": 1 });
// userSchema.index({ "referral.referred_by": 1 });
// userSchema.index({ "referral.referral_path.level1": 1 });
// userSchema.index({ "referral.referral_path.level2": 1 });

// Middleware corrigé pour le peuplement
// userSchema.pre("save", async function (next) {
//   if (this.isModified("referral.referred_by") && this.referral?.referred_by) {
//     try {
//       const referrer: any = await this.model("user").findById(
//         this.referral.referred_by
//       );
//       if (referrer) {
//         this.referral.referral_path = {
//           level1: referrer?._id,
//           level2: referrer?.referral?.referred_by,
//           level3: referrer?.referral?.referral_path?.level1,
//         };
//       }
//       next();
//     } catch (error) {
//       next(error as Error);
//     }
//   } else {
//     next();
//   }
// });

const User = mongoose.model("user", userSchema);

export default User;
