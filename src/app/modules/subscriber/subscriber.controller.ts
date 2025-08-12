import { Request, Response } from "express";
import i18n from "../../../core/i18n";
import customResponse from "../../utils/custom-response.util";
import statusCode from "../../utils/status-code.util";
import errorNumbers from "../../utils/error-numbers.util";
import validator from "../../utils/validator.util";
import { Errors } from "validatorjs";
import rabbitmqManager from "../../../core/rabbitmq";
import { checkObjectId, loadTemplate } from "../../utils/helpers.util";
import subscriberService from "./subscriber.service";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-03-11
 *
 * Class SubscriberController
 */
class SubscriberController {
  /**
   * Constructs a new instance of the SubscriberController class.
   *
   * @author Valentin magde <valentinmagde@gmail.com>
   * This constructor binds the sendResetPasswordLink method to the current instance
   * of the class to ensure the correct `this` context is maintained when the method
   * is used as a callback or event handler.
   */
  constructor() {
    this.sendSubscriptionEmail = this.sendSubscriptionEmail.bind(this);
  }

  /**
   * Get subscriber details handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async show(req: Request, res: Response): Promise<void> {
    const subscriberId = req.params.subscriberId;
    if (checkObjectId(subscriberId)) {
      subscriberService
        .show(subscriberId)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("subscriber.subscriberNotFound"),
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
        errMsg: i18n.__("subscribers.invalidSubscriberId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Get subscriber by email
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-11
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async showByEmail(req: Request, res: Response): Promise<void> {
    const email = req.params.email;
    subscriberService
      .showByEmail(email)
      .then((result) => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("subscriber.subscriberNotFound"),
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

  /**
   * Get all subscribers
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async index(req: Request, res: Response): Promise<void> {
    subscriberService
      .index()
      .then((result) => {
        const response = {
          status: statusCode.httpOk,
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

  /**
   * Create new subscriber route handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async store(req: Request, res: Response): Promise<void> {
    const validationRule = {
      email: "required|string|email",
      type: "required|string",
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
            subscriberService
              .store(req.body)
              .then((result: any) => {
                if(result === "ALREDY_EXISTS") {
                  const response = {
                    status: statusCode.httpBadRequest,
                    errNo: errorNumbers.genericError,
                    errMsg:  i18n.__("subscriber.alreadySubscribe"),
                  };

                  return customResponse.error(response, res);
                } else {
                this.sendSubscriptionEmail(result?._id, req.body);

                const response = {
                  status: statusCode.httpCreated,
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
   * Update a subscriber
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async update(req: Request, res: Response): Promise<void> {
    const subscriberId = req.params.subscriberId;
    // check if user id is valid
    if (checkObjectId(subscriberId)) {
      subscriberService
        .update(subscriberId, req.body)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("subscriber.subscriberNotFound"),
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
        errMsg: i18n.__("subscriber.invalidSubscriberId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Patch a subscriber
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async patch(req: Request, res: Response): Promise<void> {
    const subscriberId = req.params.subscriberId;

    // check if subcriber id is valid
    if (checkObjectId(subscriberId)) {
      subscriberService
        .patch(subscriberId, req.body)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("subscriber.subscriberNotFound"),
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
        errMsg: i18n.__("subscriber.invalidSubscriberId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Unsubscribe a subscriber
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-11
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async unsubscribe(req: Request, res: Response): Promise<void> {
    const subscriberId = req.params.subscriberId;

    if (checkObjectId(subscriberId)) {
      subscriberService
        .unsubscribe(subscriberId)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("subscriber.subscriberNotFound"),
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
        errMsg: i18n.__("subscriber.invalidSubscriberId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Delete a subscriber by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async delete(req: Request, res: Response): Promise<void> {
    const subscriberId = req.params.subscriberId;

    if (checkObjectId(subscriberId)) {
      subscriberService
        .delete(subscriberId)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("subscriber.subscriberNotFound"),
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
    } else {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("subscriber.invalidSubscriberId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Send subscription notification route handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @param {string} id the subscriber id.
   * @param {any} body the email data.
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  private async sendSubscriptionEmail(id: string, body: any): Promise<void> {
    const emailData = {
      manage_subscription_url: body.manageSubscriptionUrl
        ? new URL(`/unsubscribe/${id}`, body.manageSubscriptionUrl).href
        : "#",
      unsubscribe_url: body.unsubscribeUrl
        ? new URL(`/unsubscribe/${id}`, body.unsubscribeUrl).href
        : "#",
    };

    const emailHtml = loadTemplate(
      "newsletter-subscription-template.html",
      emailData
    );

    console.log("Publish message to rabbitmq", emailHtml);
    await rabbitmqManager
      .publishMessage("eluxe.email.sendMail", "sendMail", {
        senderName: body.appName,
        receivers: body.receivers || [],
        senderEmail: body.sender || "",
        subject: body.subject,
        body: emailHtml,
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

const subscriberController = new SubscriberController();
export default subscriberController;
