import { Router } from "express";
import routesGrouping from "../../utils/routes-grouping.util";
import commissionController from "./commission.controller";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-10
 *
 * Class CommissionRoutes
 */
class CommissionRoutes {
  private router: Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   */
  constructor() {
    this.router = Router({ mergeParams: true });
  }

  /**
   * Creating all commission routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-10
   *
   * @returns {Router} the commission routes
   */
  public commissionRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/commissions",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/commissions:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Commission
             *     operationId: store
             *     summary: Create a new commission.
             *     description: Add commission into the system.
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
             *               order_id:
             *                 type: string
             *                 description: The order ID.
             *                 example: 1
             *
             *     responses:
             *       201:
             *         description: The commission successfully created.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Commission'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
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
            router.post("/", (req, res) => {
              // Update url with original url which contain all path
              req.url = req.originalUrl;
              commissionController.create(req, res);
            });

            /**
             * @swagger
             * /v1/{lang}/commissions:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Commission
             *     operationId: getCommissions
             *     summary: Get all commissions.
             *     description: Get all commissions from the system.
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
             *         description: The commissions have been successfully
             *                      recovered.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: array
             *                    items:
             *                      $ref: '#/components/schemas/Commission'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
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
            router.get("/", (req, res) => {
              // Update url with original url which contain all path
              req.url = req.originalUrl;
              commissionController.getCommissions(req, res);
            });

            /**
             * @swagger
             * /v1/{lang}/commissions/user/{userId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Commission
             *     operationId: getUserCommissions
             *     summary: Get all user commissions.
             *     description: Get all user commissions from the system.
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
             *         description: The user commissions have been successfully
             *                      recovered.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: array
             *                    items:
             *                      $ref: '#/components/schemas/Commission'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
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
            router.get("/user/:userId", (req, res) => {
              // Update url with original url which contain all path
              req.url = req.originalUrl;
              commissionController.getUserCommissions(req, res);
            });

            /**
             * @swagger
             * /v1/{lang}/commissions/order/{orderId}/paid:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Commission
             *     operationId: paid
             *     summary: Paid commission.
             *     description: Paid commission from the system.
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
             *        name: orderId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the order to get
             *
             *     responses:
             *       200:
             *         description: The commission successfully paid.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Commission'
             *
             *       400:
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
            router.get("/order/:orderId/paid", (req, res) => {
              // Update url with original url which contain all path
              req.url = req.originalUrl;
              commissionController.paid(req, res);
            });
          })
        );

        router.use(
          "/commission",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/commission/{commissionId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Commission
             *     operationId: show
             *     summary: Get a commission by ID.
             *     description: Get a commission by id from the system.
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
             *        name: commissionId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the commission to get
             *
             *     responses:
             *       200:
             *         description: The commission has successfully
             *                      retrieve.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Commission'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
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
            router.get("/:commissionId", (req, res) => {
              // Update url with original url which contain all path
              req.url = req.originalUrl;
              commissionController.getCommission(req, res);
            });

            /**
             * @swagger
             * /v1/{lang}/commission/{commissionId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Commission
             *     operationId: update
             *     summary: Update a commission by ID.
             *     description: Update a commission by ID.
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
             *        name: commissionId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the commission to get
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               status:
             *                 type: string
             *                 description: The commission status.
             *                 enum: ["pending", "paid", "cancelled"]
             *             required:
             *               - status
             *
             *     responses:
             *       200:
             *         description: The commission has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Commission'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
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
            router.put("/:commissionId", (req, res) => {
              // Update url with original url which contain all path
              req.url = req.originalUrl;
              commissionController.update(req, res);
            });

            /**
             * @swagger
             * /v1/{lang}/commission/{commissionId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Commission
             *     operationId: delete
             *     summary: Delete a commission by ID.
             *     description: Delete a commission by id from the system.
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
             *        name: commissionId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the commission to delete
             *
             *     responses:
             *       204:
             *         description: The commission deleted successfully.
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
            router.delete("/:commissionId", (req, res) => {
              // Update url with original url which contain all path
              req.url = req.originalUrl;
              commissionController.delete(req, res);
            });
          })
        );
      })
    );
  }
}

export default new CommissionRoutes();
