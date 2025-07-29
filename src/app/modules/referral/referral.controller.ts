import { Request, Response } from "express";
import referralService from "./referral.service";
import i18n from "../../../core/i18n";
import customResponse from "../../utils/custom-response.util";
import statusCode from "../../utils/status-code.util";
import errorNumbers from "../../utils/error-numbers.util";
import { checkObjectId } from "../../utils/helpers.util";
import validator from "../../utils/validator.util";
import { Errors } from "validatorjs";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-16
 *
 * Class ReferralController
 */
class ReferralController {
  /**
   * Get referral details by user id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async showByUserId(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;
    if (checkObjectId(userId)) {
      referralService
        .showByUserId(userId)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("referral.referralNotFound"),
            };

            return customResponse.error(response, res);
          } else {
            const response = {
              status: statusCode.httpOk,
              data: result,
            };

            return customResponse.success(response, res);
          }
        })
        .catch((error) => {
          const response = {
            status: error?.status || statusCode.httpInternalServerError,
            errNo: errorNumbers.genericError,
            errMsg: error?.message || error,
          };

          return customResponse.error(response, res);
        });
    } else {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("referral.invalidReferralId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Generate referral code for user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   * @return {Promise<void>} the eventual completion or failure
   */
  public async generateReferralCode(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = req.params.userId;

    if (checkObjectId(userId)) {
      referralService.generateReferralCode(userId).then((result) => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("user.profile.userNotFound"),
          };

          return customResponse.error(response, res);
        } else {
          const response = {
            status: statusCode.httpOk,
            data: result,
          };

          return customResponse.success(response, res);
        }
      });
    } else {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("user.profile.invalidUserId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Get user referral stats
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getReferralStats(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;

    if (checkObjectId(userId)) {
      referralService
        .getReferralStats(userId)
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
          const response = {
            status: error?.status || statusCode.httpInternalServerError,
            errNo: errorNumbers.genericError,
            errMsg: error?.message || error,
          };

          return customResponse.error(response, res);
        });
    } else {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("user.profile.invalidUserId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Get user referral network
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getReferralNetwork(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;

    if (checkObjectId(userId)) {
      referralService
        .getReferralNetwork(
          userId,
          req.query.level ? parseInt(req.query.level as string) : 1
        )
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
          const response = {
            status: error?.status || statusCode.httpInternalServerError,
            errNo: errorNumbers.genericError,
            errMsg: error?.message || error,
          };

          return customResponse.error(response, res);
        });
    } else {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("user.profile.invalidUserId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Process referral commission for user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   * @return {Promise<void>} the eventual completion or failure
   */
  public async processReferralCommission(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = req.params.userId;

    if (checkObjectId(userId)) {
      referralService
        .processReferralCommission(
          userId,
          parseFloat(req.query.orderAmount as string),
          parseFloat(req.query.profitMargin as string)
        )
        .then(() => {
          customResponse.success(
            {
              status: statusCode.httpOk,
              data: {},
            },
            res
          );
        })
        .catch((error) => {
          const response = {
            status: error?.status || statusCode.httpInternalServerError,
            errNo: errorNumbers.genericError,
            errMsg: error?.message || error,
          };

          return customResponse.error(response, res);
        });
    } else {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("user.profile.invalidUserId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Create new referral
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   * @return {Promise<void>} the eventual completion or failure
   */
  public async store(req: Request, res: Response): Promise<void> {
    const validationRule = {
      user: "required|string",
    };

    await validator
      .validator(
        req.body,
        validationRule,
        {},
        (err: Errors, status: boolean) => {
          if (!status) {
            const response = {
              status: statusCode.httpPreconditionFailed,
              errNo: errorNumbers.validator,
              errMsg: err.errors,
            };

            return customResponse.error(response, res);
          } else {
            referralService
              .store(req.body)
              .then((result) => {
                const response = {
                  status: statusCode.httpCreated,
                  data: result,
                };

                return customResponse.success(response, res);
              })
              .catch((error) => {
                const response = {
                  status: error?.status || statusCode.httpInternalServerError,
                  errNo: errorNumbers.genericError,
                  errMsg: error?.message || error,
                };

                return customResponse.error(response, res);
              });
          }
        }
      )
      .catch((error) => {
        const response = {
          status: error?.status || statusCode.httpInternalServerError,
          errNo: errorNumbers.genericError,
          errMsg: error?.message || error,
        };

        return customResponse.error(response, res);
      });
  }

  /**
   * Update referral
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   * @return {Promise<void>} the eventual completion or failure
   */
  public async update(req: Request, res: Response): Promise<void> {
    const validationRule = {
      user: "required|string",
    };

    await validator
      .validator(
        req.body,
        validationRule,
        {},
        (err: Errors, status: boolean) => {
          if (!status) {
            const response = {
              status: statusCode.httpPreconditionFailed,
              errNo: errorNumbers.validator,
              errMsg: err.errors,
            };

            return customResponse.error(response, res);
          } else {
            referralService
              .update(req.params.referralId, req.body)
              .then((result) => {
                if (result === null || result === undefined) {
                  const response = {
                    status: statusCode.httpNotFound,
                    errNo: errorNumbers.resourceNotFound,
                    errMsg: i18n.__("referral.referralNotFound"),
                  };

                  return customResponse.error(response, res);
                } else {
                  const response = {
                    status: statusCode.httpOk,
                    data: result,
                  };

                  return customResponse.success(response, res);
                }
              })
              .catch((error) => {
                const response = {
                  status: error?.status || statusCode.httpInternalServerError,
                  errNo: errorNumbers.genericError,
                  errMsg: error?.message || error,
                };

                return customResponse.error(response, res);
              });
          }
        }
      )
      .catch((error) => {
        const response = {
          status: error?.status || statusCode.httpInternalServerError,
          errNo: errorNumbers.genericError,
          errMsg: error?.message || error,
        };

        return customResponse.error(response, res);
      });
  }

  /**
   * Delete referral
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   * @return {Promise<void>} the eventual completion or failure
   */
  public async delete(req: Request, res: Response): Promise<void> {
    referralService
      .delete(req.params.referralId)
      .then((result) => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("referral.referralNotFound"),
          };

          return customResponse.error(response, res);
        } else {
          const response = {
            status: statusCode.httpNoContent,
            data: result,
          };

          return customResponse.success(response, res);
        }
      })
      .catch((error) => {
        const response = {
          status: error?.status || statusCode.httpInternalServerError,
          errNo: errorNumbers.genericError,
          errMsg: error?.message || error,
        };

        return customResponse.error(response, res);
      });
  }
}

const referralController = new ReferralController();
export default referralController;
