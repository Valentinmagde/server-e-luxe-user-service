import { Router } from "express";
import routesGrouping from "../../utils/routes-grouping.util";
import consentController from "./consent.controller";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-08-10
 *
 * Class ConsentRoutes
 */
class ConsentRoutes {
  private router: Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-10
   */
  constructor() {
    this.router = Router({ mergeParams: true });
  }

  /**
   * Creating all consent routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-08-10
   *
   * @returns {Router} the consent routes
   * @swagger
   * tags:
   *   name: Consent
   *   description: Management of consent.
   */
  public consentRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        /**
         * @swagger
         * /v1/{lang}/consents:
         *   post:
         *     tags:
         *     - Consent
         *     operationId: storeConsent
         *     summary: Store user consent
         *     description: Store user consent for GDPR compliance.
         *     parameters:
         *      - in: path
         *        name: lang
         *        schema:
         *          type: string
         *          example: en
         *        required: true
         *        description: Language for the response. Supported
         *          languages ['en', 'fr']
         *      - in: header
         *        name: User-Agent
         *        schema:
         *          type: string
         *        required: true
         *        description: User-Agent of the client.
         *      - in: header
         *        name: X-Forwarded-For
         *        schema:
         *          type: string
         *        required: false
         *        description: IP address of the client (if behind a proxy).
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               email:
         *                 type: string
         *                 description: The email of the user.
         *                 example: "user@example.com"
         *               categories:
         *                 type: object
         *                 properties:
         *                   necessary:
         *                     type: boolean
         *                     description: Consent for necessary cookies.
         *                     example: true
         *                   analytics:
         *                     type: boolean
         *                     description: Consent for analytics cookies.
         *                     example: true
         *                   marketing:
         *                     type: boolean
         *                     description: Consent for marketing cookies.
         *                     example: false
         *                 required:
         *                   - necessary
         *                   - analytics
         *                   - marketing
         *     responses:
         *       201:
         *         description: Consent stored successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: string
         *                   example: OK
         *                 data:
         *                   type: object
         *                   $ref: '#/components/schemas/Consent'
         *       400:
         *         description: Bad request.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/400'
         *       401:
         *         description: Unauthorized.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/401'
         *       404:
         *         description: User not found.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/404'
         *       412:
         *         description: Precondition failed.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/412'
         *       500:
         *         description: Internal server error.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/500'
         */
        router.post("/consents", (req, res) => {
          consentController.store(req, res);
        });

        /**
         * @swagger
         * /v1/{lang}/consents/gdpr/export:
         *   post:
         *     tags:
         *     - Consent
         *     operationId: exportGdprRequest
         *     summary: Export GDPR data
         *     description: Export GDPR data for a user.
         *     parameters:
         *      - in: path
         *        name: lang
         *        schema:
         *          type: string
         *          example: en
         *        required: true
         *        description: Language for the response. Supported
         *          languages ['en', 'fr']
         *      - in: header
         *        name: User-Agent
         *        schema:
         *          type: string
         *        required: true
         *        description: User-Agent of the client.
         *      - in: header
         *        name: X-Forwarded-For
         *        schema:
         *          type: string
         *        required: false
         *        description: IP address of the client (if behind a proxy).
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               email:
         *                 type: string
         *                 description: The email of the user.
         *                 example: "user@example.com"
         *     responses:
         *       200:
         *         description: GDPR data exported successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: string
         *                   example: OK
         *                 data:
         *                   type: object
         *                   $ref: '#/components/schemas/Consent'
         *       400:
         *         description: Bad request.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/400'
         *       401:
         *         description: Unauthorized.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/401'
         *       404:
         *         description: User not found.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/404'
         *       412:
         *         description: Precondition failed.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/412'
         *       500:
         *         description: Internal server error.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/500'
         */
        router.post("/consents/gdpr/export", (req, res) => {
          consentController.exportGdprRequest(req, res);
        });

        /**
         * @swagger
         * /v1/{lang}/consents/gdpr/confirm:
         *   get:
         *     tags:
         *     - Consent
         *     operationId: confirmGdpr
         *     summary: Confirm GDPR export or deletion
         *     description: Confirms a GDPR data export or deletion request using a token.
         *     parameters:
         *      - in: path
         *        name: lang
         *        schema:
         *          type: string
         *          example: en
         *        required: true
         *        description: Language for the response. Supported languages ['en', 'fr']
         *      - in: query
         *        name: token
         *        schema:
         *          type: string
         *        required: true
         *        description: The token used to confirm the export or deletion request.
         *     responses:
         *       200:
         *         description: GDPR data exported or deleted successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: string
         *                   example: OK
         *                 data:
         *                   type: object
         *                   $ref: '#/components/schemas/Consent'
         *       400:
         *         description: Bad request.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/400'
         *       401:
         *         description: Unauthorized.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/401'
         *       404:
         *         description: User not found.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/404'
         *       412:
         *         description: Precondition failed.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/412'
         *       500:
         *         description: Internal server error.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/500'
         */
        router.get("/consents/gdpr/confirm", (req, res) => {
          consentController.confirmGdpr(req, res);
        });

        /**
         * @swagger
         * /v1/{lang}/consents/gdpr/delete:
         *   post:
         *     tags:
         *     - Consent
         *     operationId: deleteGdprRequest
         *     summary: Delete GDPR data
         *     description: Delete GDPR data for a user.
         *     parameters:
         *      - in: path
         *        name: lang
         *        schema:
         *          type: string
         *          example: en
         *        required: true
         *        description: Language for the response. Supported
         *          languages ['en', 'fr']
         *      - in: header
         *        name: User-Agent
         *        schema:
         *          type: string
         *        required: true
         *        description: User-Agent of the client.
         *      - in: header
         *        name: X-Forwarded-For
         *        schema:
         *          type: string
         *        required: false
         *        description: IP address of the client (if behind a proxy).
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               email:
         *                 type: string
         *                 format: email
         *                 description: The email of the user.
         *                 example: "user@example.com"
         *     responses:
         *       200:
         *         description: GDPR data deletion request sent successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: string
         *                   example: OK
         *                 data:
         *                   type: object
         *                   $ref: '#/components/schemas/Consent'
         *       400:
         *         description: Bad request.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/400'
         *       401:
         *         description: Unauthorized.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/401'
         *       404:
         *         description: User not found.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/404'
         *       412:
         *         description: Precondition failed.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/412'
         *       500:
         *         description: Internal server error.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/responses/schemas/500'
         */
        router.post("/consents/gdpr/delete", (req, res) => {
          consentController.deleteGdprRequest(req, res);
        });
      })
    );
  }
}

export default new ConsentRoutes();
