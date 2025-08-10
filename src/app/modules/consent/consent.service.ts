import { Token } from "./consent.model";
import crypto from "crypto";
import Consent from "./consent.model";
import User from "../user/user.model";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-10
 *
 * Class ConsentService
 */
class ConsentService {
  /**
   * Get consent by user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-10
   *
   * @param {string} userId the user id
   * @return {Promise<any>} the eventual completion or failure
   */
  public async show(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const consent = await Consent.findOne({ userId });
          resolve(consent);
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
   * @param {any} query the query
   * @param {any} body the body
   *
   * @return {Promise<any>} the eventual completion or failure
   */
  public async store(query: any, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { ip, sessionID, ua } = query;
          const { categories, user_id } = body;

          let consent = await Consent.findOne({ session_id: sessionID });

          if (!consent && user_id) {
            consent = await Consent.findOne({ user_id: user_id });
          }

          if (consent) {
            consent.categories = categories;
            consent.ip = ip;
            consent.user_agent = ua;
            consent.given_at = new Date();
            if (user_id) consent.user_id = user_id;

            await consent.save();
            resolve(consent);
          } else {
            const c = new Consent({
              user_id,
              session_id: sessionID,
              ip,
              user_agent: ua,
              categories,
            });
            const createdConsent = await c.save();
            resolve(createdConsent);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Export gdpr request
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-10
   *
   * @param {any} data the data
   * @return {Promise<any>} the eventual completion or failure
   */
  public async exportGdprRequest(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { email } = data;
          const user = await User.findOne({ email });

          if (user) {
            const token = crypto.randomBytes(32).toString("hex");

            await Token.create({
              user_id: user._id,
              token,
              type: "export",
              expires_at: Date.now() + 1000 * 60 * 60 * 48,
            });

            resolve(token);
          }

          resolve(user);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Confirm gdpr
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-09
   *
   * @param {any} query the query
   * @return {Promise<any>} the eventual completion or failure
   */
  public async confirmGdpr(query: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { token, type } = query;
          const t: any = await Token.findOne({ token, type });

          if (!t || t.expires_at < Date.now()) {
            resolve({ status: "INVALID_TOKEN" });
          }

          const user = await User.findById(t.user_id);
          if (user) {
            if (type === "export") {
              const userData = await this.gatherAllUserData(
                user._id.toString()
              );
              resolve({
                status: "EXPORT",
                filename: `${user.email}-data.json`,
                data: userData,
              });
            }

            if (type === "delete") {
              user.is_deleted = true;
              user.deleted_at = new Date();
              await user.save();
              await this.purgePersonalData(user._id.toString());
              resolve({ status: "DELETE" });
            }

            resolve({ status: "UNKNOWN_ACTION" });
          }

          resolve({ status: "INVALID_TOKEN" });
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete gdpr request
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-09
   *
   * @param {any} data the data
   * @return {Promise<any>} the eventual completion or failure
   */
  public async deleteGdprRequest(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { email } = data;
          const user = await User.findOne({ email });

          if (user) {
            const token = crypto.randomBytes(32).toString("hex");

            await Token.create({
              user_id: user._id,
              token,
              type: "delete",
              expires_at: Date.now() + 1000 * 60 * 60 * 48,
            });

            resolve(token);
          }

          resolve(user);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Gather all data related to a user for GDPR export.
   *
   * @param {string} userId - The user ID
   * @returns {Promise<Record<string, any>>} - Collected user data
   */
  private async gatherAllUserData(
    userId: string
  ): Promise<Record<string, any>> {
    const user = await User.findById(userId).lean();
    // const orders = await Order.find({ userId }).lean();
    const consents = await Consent.find({ userId }).lean();

    return {
      profile: user,
      // orders,
      consents,
      exportedAt: new Date(),
    };
  }

  /**
   * Purge or anonymize user personal data while keeping what's legally required.
   *
   * @param {string} userId - The user ID
   * @returns {Promise<void>} - Promise that resolves when the operation is complete
   */
  private async purgePersonalData(userId: string): Promise<void> {
    // Remove PII from the user profile
    await User.findByIdAndUpdate(userId, {
      email: null,
      name: null,
      address: null,
      phone: null,
    });

    // Optionally anonymize orders (keep for tax/legal purposes)
    // await Order.updateMany(
    //   { userId },
    //   { $set: { shippingAddress: "ANONYMIZED", billingAddress: "ANONYMIZED" } }
    // );

    // Delete consents
    await Consent.deleteMany({ userId });
  }
}

const consentService = new ConsentService();
export default consentService;
