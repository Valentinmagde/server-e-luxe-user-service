import Commission from "./commission.model";
import Referral from "../referral/referral.model";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-10
 *
 * Class CommissionService
 */
class CommissionService {
  /**
   * Get all commissions
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @return {Promise<any>} the eventual completion or failure
   */
  public async getCommissions(): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const commissions = await Commission.find();

          resolve(commissions);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Process order commission
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {any} order the order
   *
   * @return {Promise<any>} the eventual completion or failure
   */
  public async processOrderCommission(order: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { order_id, user_id, profit_grids, order_items } = order;
          const referral = await Referral.findOne({ user: user_id });
          if (!referral?.referred_by) return;

          const COMMISSION_RATES = {
            level1: 0.05, // 5% pour le parent direct
            level2: 0.04, // 4% pour le grand-parent
            level3: 0.01, // 1% pour l'arrière-grand-parent
          };
          let profit = 0;

          order_items.forEach((item: any) => {
            profit_grids.forEach((grid: any) => {
              if (
                item?.purchase_cost <= grid.max_amount &&
                item?.purchase_cost >= grid.min_amount
              ) {
                profit += item.purchase_cost * (grid.net_rate / 100);
              }
            });
          });

          const commissions = [
            {
              userId: referral.referred_by,
              level: 1,
              amount: profit * COMMISSION_RATES.level1,
            },
            {
              userId: referral.referral_path?.level2,
              level: 2,
              amount: profit * COMMISSION_RATES.level2,
            },
            {
              userId: referral.referral_path?.level3,
              level: 3,
              amount: profit * COMMISSION_RATES.level3,
            },
          ];

          const createdCommissions = await Promise.all(
            commissions
              .filter((c) => c.userId)
              .map(async ({ userId, level, amount }) => {
                await Commission.create({
                  user_id: userId,
                  order_id,
                  amount,
                  level,
                });
                await Referral.findOneAndUpdate(
                  { user: userId },
                  {
                    $inc: {
                      "stats.total_earned": +amount,
                      "wallet.pending": +amount,
                      // ...(level === 1 && { "stats.total_referrals": 1 }),
                    },
                    $set: { "stats.last_commission_date": new Date() },
                  }
                );
              })
          );
          resolve(createdCommissions);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Paid commission
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-29
   *
   * @param {string} orderId the order id
   * @return {Promise<any>} the eventual completion or failure
   */
  public async paidCommission(orderId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const commissions = await Commission.find({ order_id: orderId, status: "pending" });

          if(!commissions.length) resolve("NO_COMMISSIONS_TO_PAID");

          commissions.forEach(async (commission: any) => {
            await Referral.findOneAndUpdate(
              { user: commission.user_id },
              {
                $inc: {
                  "wallet.available": +commission.amount,
                  "wallet.pending": -commission.amount,
                },
              }
            );
          });

          const updatedCommissions = await Commission.updateMany(
            { order_id: orderId },
            { $set: { status: "paid" } }
          );

          resolve(updatedCommissions);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get user commissions
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} userId the user id
   * @return {Promise<any>} the eventual completion or failure
   */
  public async getUserCommissions(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const commissions = await Commission.find({ user_id: userId });

          resolve(commissions);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get commission by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} commissionId the commission id
   * @return {Promise<any>} the eventual completion or failure
   */
  public async getCommission(commissionId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const commission = await Commission.findById(commissionId);

          resolve(commission);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update a commission
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} commissionId the commission id
   * @param {any} data the commission data
   * @return {Promise<any>} the eventual completion or failure
   */
  public async update(commissionId: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const commission = await Commission.findByIdAndUpdate(commissionId, {
            $set: data,
          });

          resolve(commission);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete a commission
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} commissionId the commission id
   * @return {Promise<any>} the eventual completion or failure
   */
  public async delete(commissionId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const commission = await Commission.findByIdAndDelete(commissionId);

          resolve(commission);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}

const commissionService = new CommissionService();
export default commissionService;
