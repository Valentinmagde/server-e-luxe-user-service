import Referral from "./referral.model";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-16
 *
 * Class ReferralService
 */
class ReferralService {
  /**
   * Get referral details by user id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} userId the user id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async showByUserId(userId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const referral = await Referral.findOne({ user: userId });

          const levels = [1, 2, 3];
          const network: Record<string, any[]> = {};

          for (const level of levels) {
            const path = `referral_path.level${level}`;
            const referrals = await Referral.find({ [path]: userId })
              .select("user created_at")
              .populate("user", "first_name last_name name email created_at")
              .lean();

            network[`level${level}`] = referrals.map((r: any) => ({
              ...r,
              joinDate: r.created_at,
            }));
          }

          resolve({ ...referral?.toObject(), network });
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Generate unique referral code for user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} userId the user id
   * @return {Promise<unknown>} generated referral code
   */
  public async generateReferralCode(userId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const referral = await Referral.findOne({ user: userId });

          if (referral) {
            if (referral?.code) {
              resolve(referral);
            }

            const code = `LUX-${Math.random()
              .toString(36)
              .substr(2, 8)
              .toUpperCase()}`;

            referral.code = referral.code || code;
            referral.tier = referral.tier || "standard";
            referral.stats = referral.stats || {
              total_earned: 0,
              total_referrals: 0,
              last_commission_date: new Date(),
            };

            await referral?.save();
            resolve(referral);
          } else {
            const code = `LUX-${Math.random()
              .toString(36)
              .substr(2, 8)
              .toUpperCase()}`;

            const referral = await Referral.create({
              user: userId,
              code,
              tier: "standard",
              stats: {
                total_earned: 0,
                total_referrals: 0,
                last_commission_date: new Date(),
              },
            });

            resolve(referral);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get referral statistics for user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} userId the user id
   * @return {Promise<object>} referral statistics
   */
  public async getReferralStats(userId: string): Promise<object> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const referral = await Referral.findOne({ user: userId })
            .select("stats referral_path code")
            .lean();

          if (!referral) {
            throw new Error("Referral data not found");
          }

          const [level1, level2, level3] = await Promise.all([
            Referral.countDocuments({ "referral_path.level1": userId }),
            Referral.countDocuments({ "referral_path.level2": userId }),
            Referral.countDocuments({ "referral_path.level3": userId }),
          ]);

          resolve({
            code: referral.code,
            earnings: referral.stats?.total_earned || 0,
            network: { level1, level2, level3 },
          });
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get referral network for user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} userId the user id
   * @param {number} level the network level (1-3)
   * @return {Promise<Array>} list of referred users
   */
  public async getReferralNetwork(
    userId: string,
    level = 1
  ): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const path = `referral_path.level${level}`;
          const referrals = await Referral.find({ [path]: userId })
            .select("user created_at")
            .populate("user", "first_name last_name email created_at")
            .lean();

          resolve(
            referrals.map((referral: any) => ({
              ...referral,
              joinDate: referral.created_at,
            }))
          );
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Process referral commission for an order
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} userId the user id who made purchase
   * @param {number} orderAmount the order amount
   * @param {number} profitMargin the profit margin percentage
   * @return {Promise<void>} the eventual completion or failure
   */
  public async processReferralCommission(
    userId: string,
    orderAmount: number,
    profitMargin: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const referral = await Referral.findOne({ user: userId });
          if (!referral?.referred_by) return;

          const profit = orderAmount * (profitMargin / 100);
          const commissions = [
            { level: "level1", rate: 0.05 },
            { level: "level2", rate: 0.04 },
            { level: "level3", rate: 0.01 },
          ];

          type ReferralLevel = "level1" | "level2" | "level3";
          for (const { level, rate } of commissions) {
            const parentId = referral?.referral_path?.[level as ReferralLevel];
            if (parentId) {
              await Referral.findOneAndUpdate(
                { user: parentId },
                {
                  $inc: {
                    "stats.total_earned": profit * rate,
                    "stats.total_referrals": level === "level1" ? 1 : 0,
                    "wallet.pending": profit * rate,
                  },
                  $set: { "stats.last_commission_date": new Date() },
                }
              );
            }
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create new referral
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {any} data the referral data
   * @return {Promise<any>} the eventual completion or failure
   */
  public async store(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { userId, referredBy } = data;

          const existing = await Referral.findOne({ user: userId });
          if (existing) resolve(existing);

          const createdReferral = await Referral.create({
            user: userId,
            ...(referredBy && { referred_by: referredBy }),
            stats: {
              total_earned: 0,
              total_referrals: 0,
              last_commission_date: new Date(),
            },
            tier: "standard",
          });

          resolve(createdReferral);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update referral
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} referralId the referral id
   * @param {any} data the referral data
   * @return {Promise<any>} the eventual completion or failure
   */
  public async update(referralId: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const referral = await Referral.findOneAndUpdate(
            { _id: referralId },
            {
              $set: data,
            }
          );

          resolve(referral);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete referral
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} referralId the referral id
   * @return {Promise<any>} the eventual completion or failure
   */
  public async delete(referralId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const referral = await Referral.findOneAndDelete({ _id: referralId });

          resolve(referral);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}

const referralService = new ReferralService();
export default referralService;
