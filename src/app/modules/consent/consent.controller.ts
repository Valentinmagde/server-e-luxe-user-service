import { Request, Response } from "express";
import i18n from "../../../core/i18n";
import customResponse from "../../utils/custom-response.util";
import statusCode from "../../utils/status-code.util";
import errorNumbers from "../../utils/error-numbers.util";
import consentService from "./consent.service";
import rabbitmqManager from "../../../core/rabbitmq";
import {
  getBrowserFromRequest,
  getOsFromRequest,
  loadTemplate,
  removeFirstLastSlash,
} from "../../utils/helpers.util";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-08-09
 *
 * Class ConsentController
 */
class ConsentController {
  /**
   * Get consent by user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async show(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;

    consentService
      .show(userId)
      .then((result) => {
        customResponse.success(
          { status: statusCode.httpOk, data: result },
          res
        );
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }

  /**
   * Store consent
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-09
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async store(req: Request, res: Response): Promise<void> {
    const ip = req.ip;
    const sessionID = req.sessionID;
    const ua = req.get("User-Agent");
    const body = req.body;

    consentService
      .store({ ip, sessionID, ua }, body)
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
   * Export gdpr request
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-09
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async exportGdprRequest(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      const token = await consentService.exportGdprRequest(body);

      if (!token) {
        const response = {
          status: statusCode.httpNotFound,
          errNo: errorNumbers.resourceNotFound,
          errMsg: i18n.__("user.profile.userNotFound"),
        };

        return customResponse.error(response, res);
      }

      const url = await this.createExportGdprLink(token, req);

      const emailData: any = {
        name: body?.name || "",
        product_name: body?.appName || "",
        action_url: url,
        operating_system: getOsFromRequest(req),
        browser_name: getBrowserFromRequest(req),
        support_url: body.supportUrl || "#",
      };

      const emailHtml = loadTemplate(
        "export-gdpr-request-template.html",
        emailData
      );

      await rabbitmqManager.publishMessage("eluxe.email.sendMail", "sendMail", {
        receivers: body.email,
        subject: body.subject || "Export your personal data from our website",
        body: emailHtml,
      });

      customResponse.success({ status: statusCode.httpOk, data: token }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Confirm gdpr
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-09
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<any>} the eventual completion or failure
   */
  public async confirmGdpr(req: Request, res: Response): Promise<any> {
    try {
      const result = await consentService.confirmGdpr(req.query);

      if (result.status === "INVALID_TOKEN") {
        return customResponse.error(
          {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("gdpr.invalidToken"),
          },
          res
        );
      }

      if (result.status === "EXPORT") {
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${result.filename}`
        );
        return customResponse.success(
          {
            status: statusCode.httpOk,
            data: {
              status: "EXPORT",
              filename: result.filename,
              data: result.data,
            },
          },
          res
        );
      }

      if (result.status === "DELETE") {
        return customResponse.success(
          {
            status: statusCode.httpOk,
            data: {
              status: "DELETE",
              ...result,
            },
          },
          res
        );
      }

      return customResponse.error(
        {
          status: statusCode.httpBadRequest,
          errNo: errorNumbers.genericError,
          errMsg: i18n.__("gdpr.unknownAction"),
        },
        res
      );
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Delete gdpr request
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-09
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async deleteGdprRequest(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      const token = await consentService.deleteGdprRequest(body);

      if (!token) {
        return customResponse.error(
          {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("user.profile.userNotFound"),
          },
          res
        );
      }

      const url = await this.createDeleteGdprLink(token, req);

      const emailData: any = {
        name: body?.name || "",
        product_name: body?.appName || "",
        action_url: url,
        operating_system: getOsFromRequest(req),
        browser_name: getBrowserFromRequest(req),
        support_url: body.supportUrl || "#",
      };

      const emailHtml = loadTemplate(
        "account-deletion-request-template.html",
        emailData
      );

      await rabbitmqManager.publishMessage("eluxe.email.sendMail", "sendMail", {
        receivers: body.email,
        subject:
          body.subject || "Request to delete your account from our website",
        body: emailHtml,
      });

      customResponse.success({ status: statusCode.httpOk, data: token }, res);
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

  /**
   * Generates a GDPR export link for a user and sets an expiration time of 24 hours.
   *
   * @param {string} token - The token.
   * @param {Request} req - The HTTP request object, used to extract the application's origin URL and return path.
   * @return {Promise<string>} - The generated GDPR export URL.
   * @throws {Error} - If there is an issue while updating the user's expiration or creating the URL.
   */
  private async createExportGdprLink(
    token: string,
    req: Request
  ): Promise<string> {
    const origin = req.headers.origin as string;
    const returnPath = req.body.returnPath
      ? removeFirstLastSlash(req.body.returnPath)
      : "gdpr/confirm";

    // Build the export gdpr URL
    const url = `${origin}/${returnPath}?token=${token}&type=export`;

    return url;
  }

  /**
   * Generates a GDPR delete link for a user and sets an expiration time of 24 hours.
   *
   * @param {string} token - The token.
   * @param {Request} req - The HTTP request object, used to extract the application's origin URL and return path.
   * @return {Promise<string>} - The generated GDPR delete URL.
   * @throws {Error} - If there is an issue while updating the user's expiration or creating the URL.
   */
  private async createDeleteGdprLink(
    token: string,
    req: Request
  ): Promise<string> {
    const origin = req.headers.origin as string;
    const returnPath = req.body.returnPath
      ? removeFirstLastSlash(req.body.returnPath)
      : "gdpr/confirm";

    // Build the delete gdpr URL
    const url = `${origin}/${returnPath}?token=${token}&type=delete`;

    return url;
  }
}

const consentController = new ConsentController();
export default consentController;
