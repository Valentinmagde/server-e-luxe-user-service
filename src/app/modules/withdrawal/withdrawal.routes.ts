import express, { Router } from "express";
import routesGrouping from "../../utils/routes-grouping.util";
import withdrawalController from "./withdrawal.controller";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-10
 *
 * Class WithdrawalRoutes
 */
class WithdrawalRoutes {
  private router: Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   */
  public constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  /**
   * Creating all withdrawal routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @returns {Router} the withdrawal routes
   */
  public withdrawalRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/withdrawals",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/withdrawals:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Withdrawal
             *     operationId: withdraw
             *     summary: Withdrawal request.
             *     description: Withdrawal request.
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
             *             $ref: '#/components/schemas/Withdrawal'
             *
             *     responses:
             *       200:
             *         description: OK.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/200'
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
             *       404:
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             */
            router.post("/", withdrawalController.withdraw);

            /**
             * @swagger
             * /v1/{lang}/withdrawals:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Withdrawal
             *     operationId: getWithdrawals
             *     summary: Get all withdrawals.
             *     description: Get all withdrawals.
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
             *     responses:
             *       200:
             *         description: OK.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/200'
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
             *       404:
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get("/", withdrawalController.getWithdrawals);

            /**
             * @swagger
             * /v1/{lang}/withdrawals/user/{userId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Withdrawal
             *     operationId: getWithdrawalsByUser
             *     summary: Get all withdrawals by user.
             *     description: Get all withdrawals by user.
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
             *        description: User ID.
             *
             *     responses:
             *       200:
             *         description: OK.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/200'
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
             *       404:
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get("/user/:userId", withdrawalController.getWithdrawalsByUser);
          })
        );

        router.use(
          "/withdrawal",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/withdrawal/{withdrawalId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Withdrawal
             *     operationId: getWithdrawalById
             *     summary: Get a withdrawal by ID.
             *     description: Get a withdrawal by id from the system.
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
             *        name: withdrawalId
             *        schema:
             *          type: string
             *        required: true
             *        description: Withdrawal ID.
             *
             *     responses:
             *       200:
             *         description: OK.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/200'
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
             *       404:
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get(
              "/:withdrawalId",
              withdrawalController.getWithdrawalById
            );

            /**
             * @swagger
             * /v1/{lang}/withdrawal/{withdrawalId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Withdrawal
             *     operationId: updateWithdrawal
             *     summary: Update a withdrawal by ID.
             *     description: Update a withdrawal by ID.
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
             *        name: withdrawalId
             *        schema:
             *          type: string
             *        required: true
             *        description: Withdrawal ID.
             *
             *     requestBody:
             *       required: true
             *       description: We can find the documentation on the JSON
             *                    Update format [here](https://jsonpatch.com/)
             *       content:
             *         application/json:
             *           schema:
             *             $ref: '#/components/schemas/PatchBody'
             *
             *     responses:
             *       200:
             *         description: The withdrawal has successfully updated in.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Withdrawal'
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
            router.put("/:withdrawalId", withdrawalController.update);

            /**
             * @swagger
             * /v1/{lang}/withdrawal/{withdrawalId}:
             *   patch:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Withdrawal
             *     operationId: patchWithdrawal
             *     summary: Patch a withdrawal by ID.
             *     description: Patch a withdrawal by ID.
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
             *        name: withdrawalId
             *        schema:
             *          type: string
             *        required: true
             *        description: Withdrawal ID.
             *     requestBody:
             *       required: true
             *       description: We can find the documentation on the JSON
             *                    Patch format [here](https://jsonpatch.com/)
             *       content:
             *         application/json:
             *           schema:
             *             $ref: '#/components/schemas/PatchBody'
             *
             *     responses:
             *       200:
             *         description: The withdrawal has successfully patched in.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Withdrawal'
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
            router.patch("/:withdrawalId", withdrawalController.patch);

            /**
             * @swagger
             * /v1/{lang}/withdrawal/{withdrawalId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Withdrawal
             *     operationId: deleteWithdrawal
             *     summary: Delete a withdrawal by ID.
             *     description: Delete a withdrawal by ID.
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
             *        name: withdrawalId
             *        schema:
             *          type: string
             *        required: true
             *        description: Withdrawal ID.
             *
             *     responses:
             *       200:
             *         description: The withdrawal has successfully deleted.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: string
             *                    example: Withdrawal deleted successfully
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
            router.delete("/:withdrawalId", withdrawalController.delete);
          })
        );
      })
    );
  }
}

const withdrawalRoutes = new WithdrawalRoutes();
export default withdrawalRoutes;
