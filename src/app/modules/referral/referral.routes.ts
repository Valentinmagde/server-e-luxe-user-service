import express, { Router } from "express"; // eslint-disable-line no-unused-vars
import dotenv from "dotenv";
import routesGrouping from "../../utils/routes-grouping.util";
import referralController from "./referral.controller";

dotenv.config();

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-16
 *
 * Class ReferralRoutes
 */
class ReferralRoutes {
  private router: Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-16
   */
  constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  /**
   * Creating all referral routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-16
   *
   * @returns {Router} the referral routes
   * @swagger
   * tags:
   *   name: Referral
   *   description: Management of referral.
   */
  public referralRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/referrals",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/referrals:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags: [Referral]
             *     operationId: store
             *     summary: Create a new referral.
             *     description: Add referral into the system.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               user:
             *                 type: string
             *                 description: The user id.
             *                 example: 64b2b0a0a0a0a0a0a0a0a0a0
             *               referred_by:
             *                 type: string
             *                 description: The referred by id.
             *                 example: 64b2b0a0a0a0a0a0a0a0a0a0
             *
             *     responses:
             *       201:
             *         description: Referral created successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Referral'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       401:
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.post("/", referralController.store);
          })
        );

        router.use(
          "/referral",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/referral/user/{userId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags: [Referral]
             *     operationId: showByUserId
             *     summary: Get referral details by user id.
             *     description: Get referral details by user id.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: userId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the user to get
             *
             *     responses:
             *       200:
             *         description: The referral has successfully retrieve.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Referral'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get(
              "/user/:userId",
              referralController.showByUserId
            );

            /**
             * @swagger
             * /v1/{lang}/referral/user/{userId}/code:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags: [Referral]
             *     operationId: generateReferralCode
             *     summary: Generate referral code for user.
             *     description: Generate referral code for user.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: userId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the user to get
             *
             *     responses:
             *       200:
             *         description: The referral code has successfully generated.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/User'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get(
              "/user/:userId/code",
              referralController.generateReferralCode
            );

            /**
             * @swagger
             * /v1/{lang}/referral/user/{userId}/stats:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags: [Referral]
             *     operationId: getReferralStats
             *     summary: Get referral stats for user.
             *     description: Get referral stats for user.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: userId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the user to get
             *
             *     responses:
             *       200:
             *         description: The referral stats has successfully retrieve.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/User'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get(
              "/user/:userId/stats",
              referralController.getReferralStats
            );

            /**
             * @swagger
             * /v1/{lang}/referral/user/{userId}/network:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags: [Referral]
             *     operationId: getReferralNetwork
             *     summary: Get referral network for user.
             *     description: Get referral network for user.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: userId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the user to get
             *
             *     responses:
             *       200:
             *         description: The referral network has successfully retrieve.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/User'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get(
              "/user/:userId/network",
              referralController.getReferralNetwork
            );

            /**
             * @swagger
             * /v1/{lang}/referral/user/{userId}/commission:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags: [Referral]
             *     operationId: processReferralCommission
             *     summary: Process referral commission for user.
             *     description: Process referral commission for user.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: userId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the user to get
             *
             *     responses:
             *       200:
             *         description: The referral commission has successfully
             *                      processed.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/User'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get(
              "/user/:userId/commission",
              referralController.processReferralCommission
            );

            /**
             * @swagger
             * /v1/{lang}/referral/{reeferralId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags: [Referral]
             *     operationId: update
             *     summary: Update a referral by ID.
             *     description: Update a referral by ID.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: referralId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the referral to get
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               user:
             *                 type: string
             *                 description: The user id.
             *                 example: 64b2b0a0a0a0a0a0a0a0a0a0
             *               referred_by:
             *                 type: string
             *                 description: The referred by id.
             *                 example: 64b2b0a0a0a0a0a0a0a0a0a0
             *
             *     responses:
             *       200:
             *         description: The referral has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Referral'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.put("/:referralId", referralController.update);

            /**
             * @swagger
             * /v1/{lang}/referral/{referralId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags: [Referral]
             *     operationId: delete
             *     summary: Delete a referral by ID.
             *     description: Delete a referral by ID.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: referralId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the referral to delete
             *
             *     responses:
             *       200:
             *         description: The referral has successfully deleted.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Referral'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.delete(
              "/:referralId",
              referralController.delete
            );
          })
        );
      })
    );
  }
}

const referralRoutes = new ReferralRoutes();
export default referralRoutes;
