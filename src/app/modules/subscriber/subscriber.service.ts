import * as jsonpatch from "fast-json-patch";
import Subscriber from "./subscriber.model";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-03-11
 *
 * Class SubscriberService
 */
class SubscriberService {
  /**
   * Get subscriber details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @param {string} subscriberId the subscriber id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public show(subscriberId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const subscriber = await Subscriber.findById(subscriberId);

          resolve(subscriber);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get subscriber by email
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-11
   *
   * @param {string} email the subscriber email
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public showByEmail(email: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const subscriber = await Subscriber.findOne({ email: email });

          resolve(subscriber);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get all subscriber.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public index(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const subscribers = await Subscriber.find();

          resolve(subscribers);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create new subscriber.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-03-11
   *
   * @param {any} data the subscriber data to store.
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async store(data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const subscriber: any = await Subscriber.findOne({ email: data.email });

          if (subscriber) {
            if (subscriber.status === "Inactive") {
              await Subscriber.updateOne(
                { _id: subscriber._id },
                { $set: { status: "Active" } }
              );

              resolve(subscriber);
            } else {
              reject("ALREADY_EXISTS");
            }
          } else {
            const newSubscriber = new Subscriber({
              ...data,
              start_date: new Date(),
            });

            const createdSubscriber = await newSubscriber.save();

            resolve(createdSubscriber);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update a subscriber
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @param {string} subscriberId the subscriber id
   * @param {any} data the subscriber data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async update(subscriberId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const subscriber: any = await Subscriber.findById(subscriberId);

          if (!subscriber) resolve(null);

          const updateObject = { ...subscriber.toObject(), ...data };

          await Subscriber.updateOne(
            { _id: subscriberId },
            { $set: updateObject }
          );

          resolve(updateObject);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Patch a subscriber
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @param {string} subscriberId the subscriber id
   * @param {any} data the update object
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async patch(subscriberId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const subscriber: any = await Subscriber.findById(subscriberId);

          if (subscriber) {
            const updateObject = jsonpatch.applyPatch(
              subscriber.toObject(),
              data,
              false,
              true
            ).newDocument;

            await Subscriber.updateOne(
              { _id: subscriberId },
              { $set: updateObject }
            );

            resolve(updateObject);
          } else {
            resolve(subscriber);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Unsubscribe a subscriber
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-11
   *
   * @param {string} subscriberId the subscriber id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async unsubscribe(subscriberId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const subscriber: any = await Subscriber.findById(subscriberId);

          if (subscriber) {
            await Subscriber.updateOne(
              { _id: subscriberId },
              { $set: { status: "Inactive" } }
            );

            await subscriber.softDelete();

            resolve(subscriber);
          } else {
            resolve(subscriber);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete a subscriber by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @param {string} subscriberId the subscriber id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public delete(subscriberId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const subscriber: any = await Subscriber.findById(subscriberId);

          if (subscriber) {
            await Subscriber.updateOne(
              { _id: subscriberId },
              { $set: { status: "Inactive" } }
            );

            await subscriber.softDelete();

            resolve(subscriber);
          } else {
            resolve(subscriber);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}

const subscriberService = new SubscriberService();
export default subscriberService;
