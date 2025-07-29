import { Request, Response } from "express";
import i18n from "../../../core/i18n";
// import { validateWithdrawal } from "./referral.validator";
import withdrawalService from "./withdrawal.service";
import customResponse from "../../utils/custom-response.util";
import statusCode from "../../utils/status-code.util";
import errorNumbers from "../../utils/error-numbers.util";
import { checkObjectId } from "../../utils/helpers.util";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-10
 *
 * Class WithdrawalController
 */
class WithdrawalController {
  /**
   * Withdrawal request
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async withdraw(req: Request, res: Response): Promise<void> {
    // await validateWithdrawal(req.body);
    withdrawalService
      .processWithdrawal(req.body)
      .then((result) => {
        if (result === "NOT_ENOUGH_FUNDS") {
          return customResponse.error(
            {
              status: statusCode.httpBadRequest,
              errNo: errorNumbers.validator,
              errMsg: i18n.__("withdrawal.notEnoughFunds"),
            },
            res
          );
        } else if (result === "NO_REFERRAL") {
          return customResponse.error(
            {
              status: statusCode.httpBadRequest,
              errNo: errorNumbers.validator,
              errMsg: i18n.__("withdrawal.noReferral"),
            },
            res
          );
        } else {
          return customResponse.success(
            {
              status: statusCode.httpCreated,
              data: result,
            },
            res
          );
        }
      })
      .catch((error) => {
        return customResponse.error(
          {
            status: error?.status || statusCode.httpInternalServerError,
            errNo: errorNumbers.genericError,
            errMsg: error?.message || error,
          },
          res
        );
      });
  }

  /**
   * Get all withdrawals
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getWithdrawals(req: Request, res: Response): Promise<void> {
    withdrawalService
      .getWithdrawals(req.query)
      .then((result) => {
        customResponse.success(
          {
            status: statusCode.httpOk,
            data: result,
          },
          res
        );
      })
      .catch((error) => {
        customResponse.error(
          {
            status: error?.status || statusCode.httpInternalServerError,
            errNo: errorNumbers.genericError,
            errMsg: error?.message || error,
          },
          res
        );
      });
  }

  /**
   * Get withdrawals by user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getWithdrawalsByUser(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = req.params.userId;
    if (checkObjectId(userId)) {
      withdrawalService
        .getWithdrawalsByUser(userId)
        .then((result) => {
          customResponse.success(
            {
              status: statusCode.httpOk,
              data: result,
            },
            res
          );
        })
        .catch((error) => {
          customResponse.error(
            {
              status: error?.status || statusCode.httpInternalServerError,
              errNo: errorNumbers.genericError,
              errMsg: error?.message || error,
            },
            res
          );
        });
    } else {
      customResponse.error(
        {
          status: statusCode.httpBadRequest,
          errNo: errorNumbers.ivalidResource,
          errMsg: i18n.__("user.profile.invalidUserId"),
        },
        res
      );
    }
  }

  /**
   * Get withdrawal by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getWithdrawalById(req: Request, res: Response): Promise<void> {
    const { withdrawalId } = req.params;
    if (checkObjectId(withdrawalId)) {
      withdrawalService
        .getWithdrawalById(req.params.withdrawalId)
        .then((result) => {
          if (!result) {
            customResponse.error(
              {
                status: statusCode.httpNotFound,
                errNo: errorNumbers.resourceNotFound,
                errMsg: i18n.__("withdrawal.withdrawalNotFound"),
              },
              res
            );
          } else {
            customResponse.success(
              {
                status: statusCode.httpOk,
                data: result,
              },
              res
            );
          }
        })
        .catch((error) => {
          customResponse.error(
            {
              status: error?.status || statusCode.httpInternalServerError,
              errNo: errorNumbers.genericError,
              errMsg: error?.message || error,
            },
            res
          );
        });
    } else {
      res.status(400).json({ error: "Invalid withdrawal id" });
    }
  }

  /**
   * Patch a withdrawal
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async patch(req: Request, res: Response): Promise<void> {
    const { withdrawalId } = req.params;
    if (checkObjectId(withdrawalId)) {
      withdrawalService
        .patch(withdrawalId, req.body)
        .then((result) => {
          if (!result) {
            return customResponse.error(
              {
                status: statusCode.httpNotFound,
                errNo: errorNumbers.resourceNotFound,
                errMsg: i18n.__("withdrawal.withdrawalNotFound"),
              },
              res
            );
          } else {
            return customResponse.success(
              {
                status: statusCode.httpOk,
                data: result,
              },
              res
            );
          }
        })
        .catch((error) => {
          return customResponse.error(
            {
              status: error?.status || statusCode.httpInternalServerError,
              errNo: errorNumbers.genericError,
              errMsg: error?.message || error,
            },
            res
          );
        });
    } else {
      return customResponse.error(
        {
          status: statusCode.httpBadRequest,
          errNo: errorNumbers.ivalidResource,
          errMsg: i18n.__("withdrawal.invalidWithdrawalId"),
        },
        res
      );
    }
  }

  /**
   * Update withdrawal
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
    const { withdrawalId } = req.params;
    if (checkObjectId(withdrawalId)) {
      withdrawalService
        .update(req.params.withdrawalId, req.body)
        .then((result) => {
          if (!result) {
            return customResponse.error(
              {
                status: statusCode.httpNotFound,
                errNo: errorNumbers.resourceNotFound,
                errMsg: i18n.__("withdrawal.withdrawalNotFound"),
              },
              res
            );
          } else {
            return customResponse.success(
              {
                status: statusCode.httpOk,
                data: result,
              },
              res
            );
          }
        })
        .catch((error) => {
          return customResponse.error(
            {
              status: error?.status || statusCode.httpInternalServerError,
              errNo: errorNumbers.genericError,
              errMsg: error?.message || error,
            },
            res
          );
        });
    } else {
      return customResponse.error(
        {
          status: statusCode.httpBadRequest,
          errNo: errorNumbers.ivalidResource,
          errMsg: i18n.__("withdrawal.invalidWithdrawalId"),
        },
        res
      );
    }
  }

  /**
   * Complete withdrawal
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async complete(req: Request, res: Response): Promise<void> {
    const { withdrawalId } = req.params;
    if (checkObjectId(withdrawalId)) {
      withdrawalService
        .update(req.params.withdrawalId, { status: "completed" })
        .then((result) => {
          if (!result) {
            customResponse.error(
              {
                status: statusCode.httpNotFound,
                errNo: errorNumbers.resourceNotFound,
                errMsg: i18n.__("withdrawal.withdrawalNotFound"),
              },
              res
            );
          } else {
            customResponse.success(
              {
                status: statusCode.httpOk,
                data: result,
              },
              res
            );
          }
        })
        .catch((error) => {
          customResponse.error(
            {
              status: error?.status || statusCode.httpInternalServerError,
              errNo: errorNumbers.genericError,
              errMsg: error?.message || error,
            },
            res
          );
        });
    } else {
      customResponse.error(
        {
          status: statusCode.httpBadRequest,
          errNo: errorNumbers.ivalidResource,
          errMsg: i18n.__("withdrawal.invalidWithdrawalId"),
        },
        res
      );
    }
  }

  /**
   * Reject withdrawal
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async reject(req: Request, res: Response): Promise<void> {
    const { withdrawalId } = req.params;
    if (checkObjectId(withdrawalId)) {
      withdrawalService
        .update(req.params.withdrawalId, { status: "rejected" })
        .then((result) => {
          if (!result) {
            customResponse.error(
              {
                status: statusCode.httpNotFound,
                errNo: errorNumbers.resourceNotFound,
                errMsg: i18n.__("withdrawal.withdrawalNotFound"),
              },
              res
            );
          } else {
            customResponse.success(
              {
                status: statusCode.httpOk,
                data: result,
              },
              res
            );
          }
        })
        .catch((error) => {
          customResponse.error(
            {
              status: error?.status || statusCode.httpInternalServerError,
              errNo: errorNumbers.genericError,
              errMsg: error?.message || error,
            },
            res
          );
        });
    } else {
      customResponse.error(
        {
          status: statusCode.httpBadRequest,
          errNo: errorNumbers.ivalidResource,
          errMsg: i18n.__("withdrawal.invalidWithdrawalId"),
        },
        res
      );
    }
  }

  /**
   * Approve withdrawal
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async approve(req: Request, res: Response): Promise<void> {
    const { withdrawalId } = req.params;
    if (checkObjectId(withdrawalId)) {
      withdrawalService
        .update(req.params.withdrawalId, { status: "approved" })
        .then((result) => {
          if (!result) {
            customResponse.error(
              {
                status: statusCode.httpNotFound,
                errNo: errorNumbers.resourceNotFound,
                errMsg: i18n.__("withdrawal.withdrawalNotFound"),
              },
              res
            );
          } else {
            customResponse.success(
              {
                status: statusCode.httpOk,
                data: result,
              },
              res
            );
          }
        })
        .catch((error) => {
          customResponse.error(
            {
              status: error?.status || statusCode.httpInternalServerError,
              errNo: errorNumbers.genericError,
              errMsg: error?.message || error,
            },
            res
          );
        });
    } else {
      customResponse.error(
        {
          status: statusCode.httpBadRequest,
          errNo: errorNumbers.ivalidResource,
          errMsg: i18n.__("withdrawal.invalidWithdrawalId"),
        },
        res
      );
    }
  }

  /**
   * Cancel withdrawal
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async cancel(req: Request, res: Response): Promise<void> {
    const { withdrawalId } = req.params;
    if (checkObjectId(withdrawalId)) {
      withdrawalService
        .cancel(withdrawalId)
        .then((result) => {
          if (!result) {
            customResponse.error(
              {
                status: statusCode.httpNotFound,
                errNo: errorNumbers.resourceNotFound,
                errMsg: i18n.__("withdrawal.withdrawalNotFound"),
              },
              res
            );
          } else {
            customResponse.success(
              {
                status: statusCode.httpOk,
                data: result,
              },
              res
            );
          }
        })
        .catch((error) => {
          customResponse.error(
            {
              status: error?.status || statusCode.httpInternalServerError,
              errNo: errorNumbers.genericError,
              errMsg: error?.message || error,
            },
            res
          );
        });
    } else {
      customResponse.error(
        {
          status: statusCode.httpBadRequest,
          errNo: errorNumbers.ivalidResource,
          errMsg: i18n.__("withdrawal.invalidWithdrawalId"),
        },
        res
      );
    }
  }

  /**
   * Delete withdrawal
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
    const { withdrawalId } = req.params;
    if (checkObjectId(withdrawalId)) {
      withdrawalService
        .delete(req.params.withdrawalId)
        .then((result) => {
          if (!result) {
            customResponse.error(
              {
                status: statusCode.httpNotFound,
                errNo: errorNumbers.resourceNotFound,
                errMsg: i18n.__("withdrawal.withdrawalNotFound"),
              },
              res
            );
          } else {
            customResponse.success(
              {
                status: statusCode.httpNoContent,
                data: result,
              },
              res
            );
          }
        })
        .catch((error) => {
          customResponse.error(
            {
              status: error?.status || statusCode.httpInternalServerError,
              errNo: errorNumbers.genericError,
              errMsg: error?.message || error,
            },
            res
          );
        });
    } else {
      customResponse.error(
        {
          status: statusCode.httpBadRequest,
          errNo: errorNumbers.ivalidResource,
          errMsg: i18n.__("withdrawal.invalidWithdrawalId"),
        },
        res
      );
    }
  }
}

const withdrawalController = new WithdrawalController();
export default withdrawalController;
