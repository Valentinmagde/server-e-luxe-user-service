import express, { Router } from "express";
import dotenv from "dotenv";
import routesGrouping from "../../utils/routes-grouping.util";
import subscriberController from "./subscriber.controller";

dotenv.config();

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-03-11
 *
 * Class SubscriberRoutes
 */
class SubscriberRoutes {
  private router: Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   */
  constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  /**
   * Creating all subscribers routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @returns {Router} the subscriber routes
   */
  public subscriberRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/subscribers",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/subscribers:
             *   post:
             *     tags:
             *     - Subscriber
             *     operationId: store
             *     summary: Create subscriber.
             *     description: Add subscriber into the system.
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
             *         application/x-www-form-urlencoded:
             *           schema:
             *             type: object
             *             properties:
             *               email:
             *                 type: string
             *                 description: The subscriber's email.
             *                 example: admin@example.com
             *                 format: email
             *               type:
             *                 description: SSubscription type
             *                 required: true
             *                 type: string
             *                 example: NEWSLETTER
             *             required:
             *               - email
             *               - type
             *
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               email:
             *                 type: string
             *                 description: The subscriber's email.
             *                 example: admin@example.com
             *                 format: email
             *               type:
             *                 description: Subscription type
             *                 required: true
             *                 type: string
             *                 example: NEWSLETTER
             *             required:
             *               - email
             *               - type
             *
             *     responses:
             *       201:
             *         description: Subscriber successfully created.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Subscriber'
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
             router.post("/", (req, res) => subscriberController.store(req, res));

            /**
             * @swagger
             * /v1/{lang}/subscribers:
             *   get:
             *     tags:
             *     - Subscriber
             *     operationId: getAll
             *     summary: Get all subscribers.
             *     description: Get all subscribers from system.
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
             *         description: The subscribers were successfully retrieved.
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
             *                      $ref: '#/components/schemas/Subscriber'
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
            router.get("/", subscriberController.index);
          })
        );

        router.use(
          "/subscriber",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/subscriber/{subscriberId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Subscriber
             *     operationId: show
             *     summary: Get a subscriber by ID.
             *     description: Get a subscriber by id from the system.
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
             *        name: subscriberId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the subscriber to get
             *
             *     responses:
             *       200:
             *         description: The subscriber has successfully obtained.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Subscriber'
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
            router.get("/:subscriberId", subscriberController.show);

            /**
             * @swagger
             * /v1/{lang}/subscriber/{subscriberId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Subscriber
             *     operationId: update
             *     summary: Update a subscriber by ID.
             *     description: Update a subscriber by ID.
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
             *        name: subscriberId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the subscriber to get
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               email:
             *                 type: string
             *                 description: The subscriber's email.
             *               type:
             *                 type: string
             *                 description: The subscription type.
             *                 example: NEWSLETTER
             *             required:
             *               - last_name
             *               - gender
             *     responses:
             *       200:
             *         description: The subscriber has successfully updated.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Suscriber'
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
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.put("/:subscriberId", subscriberController.update);

            /**
             * @swagger
             * /v1/{lang}/subscriber/{subscriberId}:
             *   patch:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Subscriber
             *     operationId: patch
             *     summary: Patch a subscriber by ID.
             *     description: Patch a subscriber by ID.
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
             *        name: subscriberId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the subscriber to get
             *
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
             *         description: The subscriber has successfully patched in.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Subscriber'
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
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.patch("/:subscriberId", subscriberController.patch);

            /**
             * @swagger
             * /v1/{lang}/subscriber/{subscriberId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Subscriber
             *     operationId: delete
             *     summary: Delete a subscriber by ID.
             *     description: Delete a subscriber by ID.
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
             *        name: subscriberId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the subscriber to delete
             *
             *     responses:
             *       204:
             *         description: The subscriber deleted successfully.
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
            router.delete("/:subscriberId", subscriberController.delete);
          })
        );
      })
    );
  }
}

const subscriberRoutes = new SubscriberRoutes();
export default subscriberRoutes;
