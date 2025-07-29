import Referral from "../referral/referral.model";
import withdrawalModel from "./withdrawal.model";
import * as jsonpatch from "fast-json-patch";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-10
 *
 * Class WithdrawalService
 */
class WithdrawalService {
  /**
   * Process withdrawal request
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {any} data the withdrawal data
   * @return {Promise<any>} the eventual completion or failure
   */
  public processWithdrawal(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const userId = data.userId;
          const referred = await Referral.findOne({ referred_by: userId });

          if (!referred) resolve("NO_REFERRAL");

          const referral = await Referral.findOne({ user: userId });

          if ((referral?.wallet?.available || 0) < data.amount) {
            resolve("NOT_ENOUGH_FUNDS");
          }

          const withdrawal = await withdrawalModel.create({
            user: userId,
            amount: data.amount || 0,
            currency: data.currency || "USD",
            payment_method: data.paymentMethod || "bank_transfer",
            payment_details: data.paymentDetails,
            status: "pending",
          });

          await Referral.findOneAndUpdate(
            { user: userId },
            {
              $inc: {
                "wallet.available": -data.amount,
                "wallet.locked": data.amount,
              },
            }
          );

          resolve(withdrawal);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get all withdrawals
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {any} query the query object
   * @return {Promise<any>} the eventual completion or failure
   */
  public async getWithdrawals(query: any): Promise<any> {
    try {
      const {
        day,
        status,
        page = 1,
        limit = 10,
        method,
        endDate,
        startDate,
        customerName,
      } = query;

      // Build query object
      const queryObject: Record<string, any> = this.buildQueryObject({
        day,
        status,
        method,
        endDate,
        startDate,
        customerName,
      });

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute queries in parallel
      const [total, withdrawals] = await Promise.all([
        withdrawalModel.countDocuments(queryObject),
        this.fetchWithdrawals(queryObject, skip, limit, customerName),
      ]);

      return {
        withdrawals,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error);
      throw new Error("Failed to fetch withdrawals");
    }
  }
  /**
   * Get all withdrawals by user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-28
   *
   * @param {string} userId the user id
   * @return {Promise<any>} the eventual completion or failure
   */
  public getWithdrawalsByUser(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const withdrawals = await withdrawalModel.find({ user: userId });

          resolve(withdrawals);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get withdrawal by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} withdrawalId the withdrawal id
   * @return {Promise<any>} the eventual completion or failure
   */
  public getWithdrawalById(withdrawalId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const withdrawal = await withdrawalModel
            .findById(withdrawalId)
            .populate("user", "name first_name last_name email");

          resolve(withdrawal);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update withdrawal
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} withdrawalId the withdrawal id
   * @param {any} data the withdrawal data
   * @return {Promise<any>} the eventual completion or failure
   */
  public update(withdrawalId: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const withdrawal: any = await withdrawalModel.findById(withdrawalId);
          if (!withdrawal) resolve(null);

          withdrawal.amount = data.amount || withdrawal?.amount;
          withdrawal.payment_method =
            data.paymentMethod || withdrawal?.payment_method;
          withdrawal.payment_details =
            data.paymentDetails || withdrawal?.payment_details;

          const updatedWithdrawal = await withdrawal.save();

          resolve(updatedWithdrawal);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Patch a withdrawal
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} withdrawalId the withdrawal id
   * @param {any} data the update object
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async patch(withdrawalId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const withdrawal = await withdrawalModel.findById(withdrawalId);

          if (withdrawal) {
            const updateObject = jsonpatch.applyPatch(
              withdrawal.toObject(),
              data,
              false,
              true
            ).newDocument;

            await withdrawalModel.updateOne(
              { _id: withdrawalId },
              { $set: updateObject }
            );

            resolve(updateObject);
          } else {
            resolve(withdrawal);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Cancel withdrawal
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} withdrawalId the withdrawal id
   * @return {Promise<any>} the eventual completion or failure
   */
  public cancel(withdrawalId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const withdrawal = await withdrawalModel.findById(withdrawalId);

          if (!withdrawal) resolve(null);

          if (withdrawal) {
            withdrawal.status = "cancelled";

            const updatedWithdrawal = await withdrawal.save();

            await Referral.findOneAndUpdate(
              { user: withdrawal.user },
              {
                $inc: {
                  "wallet.available": +withdrawal.amount,
                  "wallet.locked": -withdrawal.amount,
                },
              }
            );

            resolve(updatedWithdrawal);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete withdrawal
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {string} withdrawalId the withdrawal id
   * @return {Promise<any>} the eventual completion or failure
   */
  public delete(withdrawalId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const withdrawal = await withdrawalModel?.softDeleteById(
            withdrawalId
          );

          resolve(withdrawal);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Build query object
   *
   * @param {any} params the query object
   * @private
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-30
   *
   * @returns {Record<string, any>} the query object
   */
  private buildQueryObject(params: {
    day?: number;
    status?: string;
    method?: string;
    endDate?: string;
    startDate?: string;
    customerName?: string;
  }): Record<string, any> {
    const { day, status, method, endDate, startDate, customerName } = params;
    const queryObject: Record<string, any> = {};

    // Status filtering
    if (status) {
      queryObject.status = { $regex: new RegExp(status, "i") };
    } else {
      queryObject.status = {
        $in: [
          "pending",
          "processing",
          "completed",
          "cancelled",
          "rejected",
          "approved",
        ],
      };
    }

    // Date filtering
    if (day) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      queryObject.created_at = { $gte: date, $lte: new Date() };
    }

    if (startDate && endDate) {
      queryObject.updated_at = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Payment method filtering
    if (method) {
      queryObject.payment_method = { $regex: new RegExp(method, "i") };
    }

    // Customer name search
    if (customerName) {
      const nameRegex = new RegExp(customerName.trim(), "i");
      queryObject.$or = this.buildNameSearchConditions(nameRegex, customerName);
    }

    return queryObject;
  }

  /** Build name search conditions
   *
   * @param {RegExp} nameRegex the name regex
   * @param {string} customerName the customer name
   * @private
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-30
   *
   * @returns {any[]} the name search conditions
   */
  private buildNameSearchConditions(
    nameRegex: RegExp,
    customerName: string
  ): any[] {
    return [
      { "user.name": nameRegex },
      { "user.first_name": nameRegex },
      { "user.last_name": nameRegex },
      {
        $expr: {
          $regexMatch: {
            input: { $concat: ["$user.first_name", " ", "$user.last_name"] },
            regex: customerName.trim(),
            options: "i",
          },
        },
      },
    ];
  }

  /** Fetch withdrawals
   *
   * @param {Record<string, any>} queryObject the query object
   * @param {number} skip the skip number
   * @param {number} limit the limit number
   * @param {string} [customerName] the customer name
   * @private
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-30
   *
   * @returns {Promise<any[]>} the withdrawals
   */
  private async fetchWithdrawals(
    queryObject: Record<string, any>,
    skip: number,
    limit: number,
    customerName?: string
  ): Promise<any[]> {
    return withdrawalModel
      .find(queryObject)
      .populate({
        path: "user",
        select: "name first_name last_name email",
        match: customerName ? undefined : {},
      })
      .sort({ updated_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }
}

const withdrawalService = new WithdrawalService();
export default withdrawalService;
