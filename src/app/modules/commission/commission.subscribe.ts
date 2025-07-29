import DBManager from "../../../core/db";
import rabbitmqManager from "../../../core/rabbitmq";
import commissionService from "./commission.service";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-29
 *
 * Class CommissionSubscribe
 */
class CommissionSubscribe {
  /**
   * Process order commission.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-29
   *
   * @returns {Promise<void>} - A promise that resolves when the operation completes.
   *
   * @throws {Error} - Logs any errors related to order commission.
   */
  public async processOrderCommission(): Promise<void> {
    try {
      const { channel, queue } = await rabbitmqManager.setupQueue(
        "eluxe.order.processOrderCommission",
        "processOrderCommissionQueue",
        "processOrderCommission"
      );

      channel.consume(queue, async (msg: any) => {
        try {
          const data = JSON.parse(msg.content);
          const dbManager = new DBManager();

          // Connect to the database
          const dbConnection = await dbManager.asyncOnConnect();

          await this.handleProcessOrderCommission(data, dbConnection);
        } catch (error) {
          console.error("Message processing failed:", error);
        } finally {
          channel.ack(msg); // Always acknowledge the message
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Paid commission.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-29
   *
   * @returns {Promise<void>} - A promise that resolves when the operation completes.
   *
   * @throws {Error} - Logs any errors related to order commission.
   */
  public async paidOrderCommission(): Promise<void> {
    try {
      const { channel, queue } = await rabbitmqManager.setupQueue(
        "eluxe.order.paidOrderCommission",
        "paidOrderCommissionQueue",
        "paidOrderCommission"
      );

      channel.consume(queue, async (msg: any) => {
        try {
          const data = JSON.parse(msg.content);
          const dbManager = new DBManager();

          // Connect to the database
          const dbConnection = await dbManager.asyncOnConnect();

          await this.handlePaidOrderCommission(data, dbConnection);
        } catch (error) {
          console.error("Message processing failed:", error);
        } finally {
          channel.ack(msg); // Always acknowledge the message
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Processes an order commission request.
   *
   * @param {any} data - The data containing the order commission details.
   * @param {any} dbConnection - The active database connection object used to interact with the database.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   *
   * @throws {Error} - Logs any errors related to order commission.
   */
  private async handleProcessOrderCommission(
    data: any,
    dbConnection: any
  ): Promise<void> {
    try {
      await commissionService.processOrderCommission(data.message);
    } catch (error) {
      console.error("Error handling order commission:", error);
    } finally {
      dbConnection.disconnect();
    }
  }

  /**
   * Processes a paid order commission request.
   *
   * @param {any} data - The data containing the order commission details.
   * @param {any} dbConnection - The active database connection object used to interact with the database.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   *
   * @throws {Error} - Logs any errors related to order commission.
   */
  private async handlePaidOrderCommission(
    data: any,
    dbConnection: any
  ): Promise<void> {
    try {
      await commissionService.paidCommission(data.message.order_id);
    } catch (error) {
      console.error("Error handling paid order commission:", error);
    } finally {
      dbConnection.disconnect();
    }
  }
}

const commissionSubscribe = new CommissionSubscribe();
export default commissionSubscribe;
