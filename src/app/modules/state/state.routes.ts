import express, { Router } from "express";
import dotenv from "dotenv";
import routesGrouping from "../../utils/routes-grouping.util";
import stateController from "./state.controller";

dotenv.config();

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-08-06
 *
 * Class StateRoutes
 */
class StateRoutes {
  private router: Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   */
  constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  /**
   * Creating all states routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @returns {Router} all states routes
   */
  public stateRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/states",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/states:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - State
             *     operationId: store
             *     summary: Create a new state.
             *     description: Add state into the system.
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
             *               id:
             *                 type: string
             *                 description: The state ID
             *                 example: 1
             *               name:
             *                 type: string
             *                 description: The state's name.
             *                 example: Admin
             *               country_id:
             *                 type: string
             *                 description: The country ID.
             *               country_name:
             *                 type: string
             *                 description: The country name.
             *                 example: AL
             *               country_code:
             *                 type: string
             *                 description: The country code.
             *                 example: 008
             *               state_code:
             *                 type: string
             *                 description: The state code.
             *                 example: 355
             *               type:
             *                 type: string
             *                 description: The state type.
             *                 example: ALL
             *               latitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 41.00000000
             *               longitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 20.00000000
             *             required:
             *               - id
             *               - name
             *               - country_id
             *               - country_name
             *               - country_code
             *               - state_code
             *               - type
             *               - latitude
             *               - longitude
             *
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               id:
             *                 type: string
             *                 description: The state ID
             *                 example: 1
             *               name:
             *                 type: string
             *                 description: The state's name.
             *                 example: Admin
             *               country_id:
             *                 type: string
             *                 description: The country ID.
             *               country_name:
             *                 type: string
             *                 description: The country name.
             *                 example: AL
             *               country_code:
             *                 type: string
             *                 description: The country code.
             *                 example: 008
             *               state_code:
             *                 type: string
             *                 description: The state code.
             *                 example: 355
             *               type:
             *                 type: string
             *                 description: The state type.
             *                 example: ALL
             *               latitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 41.00000000
             *               longitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 20.00000000
             *             required:
             *               - id
             *               - name
             *               - country_id
             *               - country_name
             *               - country_code
             *               - state_code
             *               - type
             *               - latitude
             *               - longitude
             *
             *     responses:
             *       201:
             *         description: State successfully created.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/State'
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
            router.post("/", stateController.store);

            /**
             * @swagger
             * /v1/{lang}/states:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - State
             *     operationId: showAllStates
             *     summary: Get all states.
             *     description: Get all states from the system.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: query
             *        name: page
             *        schema:
             *          type: number
             *          example: 1
             *        description: Pagination position, this
             *          position is set to 1 by default
             *      - in: query
             *        name: perPage
             *        schema:
             *          type: number
             *          example: 15
             *        description: Number of items per page
             *
             *     responses:
             *       200:
             *         description: The states have been successfully
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
             *                      $ref: '#/components/schemas/State'
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
            router.get("/", stateController.getStates);

            /**
             * @swagger
             * /v1/{lang}/states/country/{countryId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - State
             *     operationId: showStatesByCountry
             *     summary: Get states by country.
             *     description: GGet states by country from the system.
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
             *        name: countryId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the country to get
             *
             *     responses:
             *       200:
             *         description: The states have successfully retrieve.
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
             *                      $ref: '#/components/schemas/State'
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
              "/country/:countryId",
              stateController.getStatesByCountry
            );
          })
        );

        router.use(
          "/state",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/state/{stateId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - State
             *     operationId: show
             *     summary: Get a state by ID.
             *     description: Get a state by id from the system.
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
             *        name: stateId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the state to get
             *
             *     responses:
             *       200:
             *         description: The state has successfully retrieve.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/State'
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
            router.get("/:stateId", stateController.getStateById);

            /**
             * @swagger
             * /v1/{lang}/state/{stateId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - State
             *     operationId: stateupdate
             *     summary: Update a state by ID.
             *     description: Update a state by ID.
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
             *        name: stateId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the state to get
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               id:
             *                 type: string
             *                 description: The state ID
             *                 example: 1
             *               name:
             *                 type: string
             *                 description: The state's name.
             *                 example: Admin
             *               country_id:
             *                 type: string
             *                 description: The country ID.
             *               country_name:
             *                 type: string
             *                 description: The country name.
             *                 example: AL
             *               country_code:
             *                 type: string
             *                 description: The country code.
             *                 example: 008
             *               state_code:
             *                 type: string
             *                 description: The state code.
             *                 example: 355
             *               type:
             *                 type: string
             *                 description: The state type.
             *                 example: ALL
             *               latitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 41.00000000
             *               longitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 20.00000000
             *             required:
             *               - id
             *               - name
             *               - country_id
             *               - country_name
             *               - country_code
             *               - state_code
             *               - type
             *               - latitude
             *               - longitude
             *
             *         application/x-www-form-urlencoded:
             *           schema:
             *             type: object
             *             properties:
             *               id:
             *                 type: string
             *                 description: The state ID
             *                 example: 1
             *               name:
             *                 type: string
             *                 description: The state's name.
             *                 example: Admin
             *               country_id:
             *                 type: string
             *                 description: The country ID.
             *               country_name:
             *                 type: string
             *                 description: The country name.
             *                 example: AL
             *               country_code:
             *                 type: string
             *                 description: The country code.
             *                 example: 008
             *               state_code:
             *                 type: string
             *                 description: The state code.
             *                 example: 355
             *               type:
             *                 type: string
             *                 description: The state type.
             *                 example: ALL
             *               latitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 41.00000000
             *               longitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 20.00000000
             *             required:
             *               - id
             *               - name
             *               - country_id
             *               - country_name
             *               - country_code
             *               - state_code
             *               - type
             *               - latitude
             *               - longitude
             *
             *     responses:
             *       200:
             *         description: The state has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/State'
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
            router.put("/:stateId", stateController.update);

            /**
             * @swagger
             * /v1/{lang}/state/{stateId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - State
             *     operationId: statedelete
             *     summary: Delete a state by ID.
             *     description: Delete a state by ID.
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
             *        name: stateId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the state to delete
             *
             *     responses:
             *       204:
             *         description: The state delete successfully.
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
            router.delete("/:stateId", stateController.delete);
          })
        );
      })
    );
  }
}

const stateRoutes = new StateRoutes();
export default stateRoutes;
