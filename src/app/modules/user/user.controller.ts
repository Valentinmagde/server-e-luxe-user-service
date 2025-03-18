import { Request, Response } from "express";
import userService from "./user.service";
import i18n from "../../../core/i18n";
import customResponse from "../../utils/custom-response.util";
import statusCode from "../../utils/status-code.util";
import errorNumbers from "../../utils/error-numbers.util";
import validator from "../../utils/validator.util";
import { Errors } from "validatorjs";
import rabbitmqManager from "../../../core/rabbitmq";
import {
  checkObjectId,
  getBrowserFromRequest,
  getOsFromRequest,
  loadTemplate,
  removeFirstLastSlash,
} from "../../utils/helpers.util";
// import * as path from "path";
import UserType from "./user.type";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-22-03
 *
 * Class UserController
 */
class UserController {
  /**
   * Constructs a new instance of the UserController class.
   *
   * @author Valentin magde <valentinmagde@gmail.com>
   * This constructor binds the sendResetPasswordLink method to the current instance
   * of the class to ensure the correct `this` context is maintained when the method
   * is used as a callback or event handler.
   */
  constructor() {
    this.sendResetPasswordLink = this.sendResetPasswordLink.bind(this);
  }

  /**
   * Get user details handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-22-03
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async profile(req: Request, res: Response): Promise<void> {
    const userid = req.params.userId;
    if (checkObjectId(userid)) {
      userService
        .profile(userid)
        .then((result) => {
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
        errMsg: i18n.__("user.others.invalidUserId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Get users by role
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getUsersByRoles(req: Request, res: Response): Promise<void> {
    userService
      .getUsersByRoles(req.query)
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
   * Get all customers details handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-29
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getAllCustomers(req: Request, res: Response): Promise<void> {
    userService
      .getAllCustomers()
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
   * Get all staff details handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-08-02
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getAllStaff(req: Request, res: Response): Promise<void> {
    userService
      .getAllStaff()
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
   * Get user details by usernane
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-10-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async showByUsername(req: Request, res: Response): Promise<void> {
    const userName = req.params.userName;
    userService
      .showByUsername(userName)
      .then((result) => {
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
   * Assign a role to a user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-21
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async assign(req: Request, res: Response): Promise<void> {
    const userid = req.params.userId;
    const roleid = req.params.roleId;

    if (!checkObjectId(userid)) {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("user.others.invalidUserId"),
      };

      return customResponse.error(response, res);
    } else if (!checkObjectId(roleid)) {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("role.others.invalidUserId"),
      };

      return customResponse.error(response, res);
    } else {
      userService
        .assign(userid, roleid)
        .then((result) => {
          if (result === "ROLE_NOT_FOUND") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("role.show.roleNotFound"),
            };

            return customResponse.error(response, res);
          } else if (result === "USER_NOT_FOUND") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("user.profile.userNotFound"),
            };

            return customResponse.error(response, res);
          } else if (result === "ALREADY_ASSIGNED") {
            const response = {
              status: statusCode.httpBadRequest,
              errNo: errorNumbers.resourceExist,
              errMsg: i18n.__("user.assign.roleAlreadyAssigned"),
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

  /**
   * Unassign a role to a user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-21
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async unassign(req: Request, res: Response): Promise<void> {
    const userid = req.params.userId;
    const roleid = req.params.roleId;

    if (!checkObjectId(userid)) {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("user.others.invalidUserId"),
      };

      return customResponse.error(response, res);
    } else if (!checkObjectId(roleid)) {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("role.others.invalidUserId"),
      };

      return customResponse.error(response, res);
    } else {
      userService
        .unassign(userid, roleid)
        .then((result) => {
          if (result === "ROLE_NOT_FOUND") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("role.show.roleNotFound"),
            };

            return customResponse.error(response, res);
          } else if (result === "USER_NOT_FOUND") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("user.profile.userNotFound"),
            };

            return customResponse.error(response, res);
          } else if (result === "NOT_HAVE_THIS_ROLE") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("user.unassign.notHaveThisRole"),
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

  /**
   * Login route handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-22-03
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async login(req: Request, res: Response): Promise<void> {
    console.log(req);

    const validationRule = {
      email: "required|string|email",
      password: "required|string|min:6",
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
            userService
              .login(req.body)
              .then((result) => {
                if (result === null || result === undefined) {
                  const response = {
                    status: statusCode.httpBadRequest,
                    errNo: errorNumbers.badLoginCredentials,
                    errMsg: i18n.__("user.login.userLoginFailed"),
                  };

                  return customResponse.error(response, res);
                } else if (result === "INACTIVE_USER") {
                  const response = {
                    status: statusCode.httpBadRequest,
                    errNo: errorNumbers.badLoginCredentials,
                    errMsg: i18n.__("user.login.inactiveUser"),
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
   * Register route handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-22-03
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async register(req: Request, res: Response): Promise<void> {
    const validationRule = {
      // last_name: "required|string",
      email: "required|string|email",
      // gender: "required|string",
      password: "required|string|min:6",
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
            userService
              .register(req.body)
              .then((result) => {
                if (result === "EMAIL_ALREADY_TAKEN") {
                  const response = {
                    status: statusCode.httpNotFound,
                    errNo: errorNumbers.resourceNotFound,
                    errMsg: i18n.__("user.register.emailAlreadyTaken"),
                  };

                  return customResponse.error(response, res);
                } else {
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
   * Create new user route handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-29
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async store(req: Request, res: Response): Promise<void> {
    const validationRule = {
      username: "required|string",
      // last_name: "required|string",
      email: "required|string|email",
      // gender: "required|string",
      password: "required|string|min:6",
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
            userService
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
   * Create multiple users route handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-29
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async storeMultiple(req: Request, res: Response): Promise<void> {
    userService
      .storeMultiple(req.body)
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

  /**
   * Subscribe route handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-30
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async subscribe(req: Request, res: Response): Promise<void> {
    const validationRule = {
      email: "required|string|email",
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
            userService
              .subscribe(req.body)
              .then((result) => {
                if (result === "ROLE_NOT_FOUND") {
                  const response = {
                    status: statusCode.httpNotFound,
                    errNo: errorNumbers.resourceNotFound,
                    errMsg: i18n.__("role.show.roleNotFound"),
                  };

                  return customResponse.error(response, res);
                } else {
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
   * Send reset password
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-22
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async sendResetPasswordLink(
    req: Request,
    res: Response
  ): Promise<void> {
    const validationRule = {
      email: "required|string|email",
    };
    const body = req.body;

    await validator
      .validator(body, validationRule, {}, (err: Errors, status: boolean) => {
        if (!status) {
          const response = {
            status: statusCode.httpPreconditionFailed,
            errNo: errorNumbers.validator,
            errMsg: err.errors,
          };

          return customResponse.error(response, res);
        } else {
          userService
            .sendResetPasswordLink(body)
            .then(async (result) => {
              if (result === null || result === undefined) {
                const response = {
                  status: statusCode.httpNotFound,
                  errNo: errorNumbers.resourceNotFound,
                  errMsg: i18n.__("user.update.userNotFound"),
                };

                return customResponse.error(response, res);
              } else {
                const url = await this.createResetPasswordLink(result, req);

                const emailData: any = {
                  name: result.name || "",
                  product_name: body?.appName || "",
                  action_url: url,
                  operating_system: getOsFromRequest(req),
                  browser_name: getBrowserFromRequest(req),
                  support_url: body.supportUrl || "#",
                };
                const emailHtml = loadTemplate(
                  "reset-password-template.html",
                  emailData
                );

                rabbitmqManager
                  .publishMessage("eluxe.email.sendMail", "sendMail", {
                    receivers: body.email,
                    subject:
                      body.subject || "Password Reset Request - 24 Hours Only",
                    body: emailHtml,
                  })
                  .then((result) => {
                    const response = {
                      status: statusCode.httpOk,
                      data: result,
                    };

                    return customResponse.success(response, res);
                  })
                  .catch((error) => {
                    const response = {
                      status:
                        error?.status || statusCode.httpInternalServerError,
                      errNo: errorNumbers.genericError,
                      errMsg: error?.message || error,
                    };

                    return customResponse.error(response, res);
                  });
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
   * Generates a password reset link for a user and sets an expiration time of 24 hours.
   *
   * @param {UserType} user - The user object, including the user's unique identifier (`_id`).
   * @param {Request} req - The HTTP request object, used to extract the application's origin URL and return path.
   * @return {Promise<string>} - The generated password reset URL.
   * @throws {Error} - If there is an issue while updating the user's expiration or creating the URL.
   */
  private async createResetPasswordLink(
    user: UserType,
    req: Request
  ): Promise<string> {
    const origin = req.headers.origin as string;
    const returnPath = req.body.returnPath
      ? removeFirstLastSlash(req.body.returnPath)
      : "reset-password";

    // Update user's reset password expiration
    await userService.patch(user._id.toString(), [
      {
        op: "replace",
        path: "/reset_password_expires",
        value: req.body.expiresAt,
      },
    ]);

    // Build the reset password URL
    const resetUrl = `${origin}/${returnPath}/${user._id}`;

    return resetUrl;
  }

  /**
   * Update a user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async update(req: Request, res: Response): Promise<void> {
    const userid = req.params.userId;
    // check if user id is valid
    if (checkObjectId(userid)) {
      userService
        .update(userid, req.body)
        .then((result) => {
          if (result === "INCORRECT_PASSWORD") {
            const response = {
              status: statusCode.httpBadRequest,
              errNo: errorNumbers.ivalidResource,
              errMsg: i18n.__("user.update.incorrectCurrentPassword"),
            };

            return customResponse.error(response, res);
          } else if (result === "NEW_PASSWORD_MUST_BE_DIFFERENT") {
            const response = {
              status: statusCode.httpBadRequest,
              errNo: errorNumbers.ivalidResource,
              errMsg: i18n.__("user.update.currPawdNewPwdNotdifferent"),
            };

            return customResponse.error(response, res);
          } else if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("user.update.userNotFound"),
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
        errMsg: i18n.__("user.others.invalidUserId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Patch a user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-21
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async patch(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;

    // check if user id is valid
    if (checkObjectId(userId)) {
      userService
        .patch(userId, req.body)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("user.update.userNotFound"),
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
        errMsg: i18n.__("user.others.invalidUserId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Reset password
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-27
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async resetPassword(req: Request, res: Response): Promise<void> {
    const validationRule = {
      new_password: "min:6",
      confirm_password: "min:6",
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
            const userid = req.params.userId;
            // check if user id is valid
            if (checkObjectId(userid)) {
              userService
                .resetPassword(userid, req.body)
                .then((result) => {
                  if (result === "NEW_AND_CONFIRM_PASSWORD_MUST_BE_SAME") {
                    const response = {
                      status: statusCode.httpBadRequest,
                      errNo: errorNumbers.ivalidResource,
                      errMsg: i18n.__("user.others.newAndConfirmPwdMustBeSame"),
                    };

                    return customResponse.error(response, res);
                  } else if (result === null || result === undefined) {
                    const response = {
                      status: statusCode.httpNotFound,
                      errNo: errorNumbers.resourceNotFound,
                      errMsg: i18n.__("user.update.userNotFound"),
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
                errMsg: i18n.__("user.others.invalidUserId"),
              };

              return customResponse.error(response, res);
            }
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
   * Delete a user by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async delete(req: Request, res: Response): Promise<void> {
    const userid = req.params.userId;

    if (checkObjectId(userid)) {
      userService
        .delete(userid)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("user.profile.userNotFound"),
            };

            return customResponse.error(response, res);
          } else if (result == "isAdmin") {
            const response = {
              status: statusCode.httpBadRequest,
              errNo: errorNumbers.requiredPermission,
              errMsg: i18n.__("user.delete.cannotDeleteAdmin"),
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
        errMsg: i18n.__("user.others.invalidUserId"),
      };

      return customResponse.error(response, res);
    }
  }
}

const userController = new UserController();
export default userController;
