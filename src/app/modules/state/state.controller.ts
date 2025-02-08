import { Request, Response } from "express";
import i18n from "../../../core/i18n";
import customResponse from "../../utils/custom-response.util";
import statusCode from "../../utils/status-code.util";
import errorNumbers from "../../utils/error-numbers.util";
import validator from "../../utils/validator.util";
import { Errors } from "validatorjs";
import stateService from "./state.service";
import { checkObjectId } from "../../utils/helpers.util";
/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-08-06
 *
 * Class StateController
 */
class StateController {
  /**
   * Get state details handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getStateById(req: Request, res: Response): Promise<void> {
    const stateId = req.params.stateId;

    if (checkObjectId(stateId)) {
      stateService
        .getStateById(stateId)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("state.stateNotFound"),
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
        errMsg: i18n.__("state.invalidStateId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Get states by country handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-08
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getStatesByCountry(
    req: Request,
    res: Response
  ): Promise<void> {
    const countryId = req.params.countryId;

    // if (helpers.checkObjectId(countryId)) {
      stateService
        .getStatesByCountry(countryId)
        .then((result) => {
          if (result === "COUNTRY_NOT_FOUND") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("country.countryNotFound")
            };

            return customResponse.error(response, res);
          } else {
            const response = {
              status: statusCode.httpOk,
              data: result
            };

            return customResponse.success(response, res);
          }
        })
        .catch((error) => {
          const response = {
            status: error?.status || statusCode.httpInternalServerError,
            errNo: errorNumbers.genericError,
            errMsg: error?.message || error
          };

          return customResponse.error(response, res);
        });
    // } else {
    //   const response = {
    //     status: statusCode.httpBadRequest,
    //     errNo: errorNumbers.ivalidResource,
    //     errMsg: i18n.__("country.invalidCountryId")
    //   };

    //   return customResponse.error(response, res);
    // }
  }

  /**
   * Get all state handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getStates(req: Request, res: Response): Promise<void> {
    stateService
      .getStates(req)
      .then((result) => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("state.stateNotFound"),
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
   * Add new state handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async store(req: Request, res: Response): Promise<void> {
    const validationRule = {
      id: "required|integer",
      name: "required|string",
      latitude: "required|string",
      longitude: "required|string",
      country_id: "required|string",
      country_code: "required|string",
      country_name: "required|string",
      state_code: "required|string",
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
            stateService
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
   * Update a state
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async update(req: Request, res: Response): Promise<void> {
    const validationRule = {
      id: "required|integer",
      name: "required|string",
      latitude: "required|string",
      longitude: "required|string",
      country_id: "required|string",
      country_code: "required|string",
      country_name: "required|string",
      state_code: "required|string",
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
            const stateId = req.params.stateId;
            // check if role id is valid
            if (checkObjectId(stateId)) {
              stateService
                .update(stateId, req.body)
                .then((result) => {
                  if (result === null || result === undefined) {
                    const response = {
                      status: statusCode.httpNotFound,
                      errNo: errorNumbers.resourceNotFound,
                      errMsg: i18n.__("state.stateNotFound"),
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
                errMsg: i18n.__("state.invalidStateId"),
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
   * Delete a state by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async delete(req: Request, res: Response): Promise<void> {
    const stateId = req.params.stateId;

    if (checkObjectId(stateId)) {
      stateService
        .delete(stateId)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("state.stateNotFound"),
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
        errMsg: i18n.__("state.invalidStateId"),
      };

      return customResponse.error(response, res);
    }
  }
}

const stateController = new StateController();
export default stateController;
