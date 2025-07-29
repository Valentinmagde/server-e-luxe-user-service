import { Request, Response } from "express";
import i18n from "../../../core/i18n";
import customResponse from "../../utils/custom-response.util";
import statusCode from "../../utils/status-code.util";
import errorNumbers from "../../utils/error-numbers.util";
import { checkObjectId } from "../../utils/helpers.util";
import commissionService from "./commission.service";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-10
 *
 * Class CommissionController
 */
class CommissionController {
  /**
   * Constructs a new instance of the CommissionController class.
   *
   * @author Valentin magde <valentinmagde@gmail.com>
   * This constructor binds the handleError method to the current instance
   * of the class to ensure the correct `this` context is maintained when the method
   * is used as a callback or event handler.
   */
  constructor() {
    this.handleError = this.handleError.bind(this);
  }

  /**
   * Get all commissions
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getCommissions(req: Request, res: Response): Promise<void> {
    try {
      const result = await commissionService.getCommissions();

      customResponse.success({ status: statusCode.httpOk, data: result }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Process order commission
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async create(req: Request, res: Response): Promise<void> {
    commissionService
      .processOrderCommission(req.body)
      .then((result) => {
        customResponse.success(
          { status: statusCode.httpCreated, data: result },
          res
        );
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }

  /**
   * Paid commission
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-29
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async paid(req: Request, res: Response): Promise<void> {
    try {
      const result = await commissionService.paidCommission(req.params.orderId);

      if(result === "NO_COMMISSIONS_TO_PAID") {
        return customResponse.success(
          { status: statusCode.httpOk, data: [] },
          res
        );
      }

      customResponse.success({ status: statusCode.httpOk, data: result }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Get user commissions
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getUserCommissions(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      if (!checkObjectId(userId)) {
        return customResponse.error(
          {
            status: statusCode.httpBadRequest,
            errNo: errorNumbers.ivalidResource,
            errMsg: i18n.__("user.profile.invalidUserId"),
          },
          res
        );
      }
      const result = await commissionService.getUserCommissions(userId);

      customResponse.success({ status: statusCode.httpOk, data: result }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Get commission by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getCommission(req: Request, res: Response): Promise<void> {
    try {
      const result = await commissionService.getCommission(
        req.params.commissionId
      );

      customResponse.success({ status: statusCode.httpOk, data: result }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Update a commission
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const result = await commissionService.update(
        req.params.commissionId,
        req.body
      );

      customResponse.success({ status: statusCode.httpOk, data: result }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Delete a commission
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await commissionService.delete(req.params.commissionId);

      customResponse.success(
        { status: statusCode.httpNoContent, data: result },
        res
      );
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handle error
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {any} error the error
   * @param {Response} res the http response
   *
   * @return {void} void
   */
  private handleError(error: any, res: Response): void {
    const response = {
      status: error?.status || statusCode.httpInternalServerError,
      errNo: errorNumbers.genericError,
      errMsg: error?.message || error,
    };

    customResponse.error(response, res);
  }
}

const commissionController = new CommissionController();
export default commissionController;
