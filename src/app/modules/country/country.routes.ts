import express, { Router } from "express";
import dotenv from "dotenv";
import routesGrouping from "../../utils/routes-grouping.util";
import countryController from "./country.controller";

dotenv.config();

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-08-06
 *
 * Class CountryRoutes
 */
class CountryRoutes {
  private router: Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-21
   */
  constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  /**
   * Creating all countries routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @returns {Router} all country routes
   */
  public countryRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/countries",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/countries:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Country
             *     operationId: store
             *     summary: Create a new country.
             *     description: Add country into the system.
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
             *                 description: The country ID
             *                 example: 1
             *               name:
             *                 type: string
             *                 description: The country's name.
             *                 example: Admin
             *               iso3:
             *                 type: string
             *                 description: The country iso3
             *                              code (three characters).
             *                 example: ALB
             *               iso2:
             *                 type: string
             *                 description: The country iso2
             *                              code (two characters).
             *                 example: AL
             *               numeric_code:
             *                 type: string
             *                 description: The country numeric code.
             *                 example: 008
             *               phone_code:
             *                 type: string
             *                 description: The country phone code.
             *                 example: 355
             *               currency:
             *                 type: string
             *                 description: The country currency.
             *                 example: ALL
             *               currency_name:
             *                 type: string
             *                 description: The country currency name.
             *                 example: Albanian lek
             *               currency_symbol:
             *                 type: string
             *                 description: The country currency symbol.
             *                 example: Lek
             *               tld:
             *                 type: string
             *                 description: The country tld.
             *                 example: .al
             *               latitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 41.00000000
             *               longitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 20.00000000
             *               emoji:
             *                 type: string
             *                 description: The country emoji.
             *                 example: 🇦🇱
             *               emojiU:
             *                 type: string
             *                 description: The country emojiU.
             *                 example: U+1F1E6 U+1F1F1
             *             required:
             *               - name
             *               - id
             *               - iso3
             *               - iso2
             *               - numeric_code
             *               - phone_code
             *               - currency
             *               - currency_name
             *               - currency_symbol
             *               - tld
             *               - latitude
             *               - longitude
             *               - emoji
             *               - emojiU
             *
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               id:
             *                 type: string
             *                 description: The country ID
             *                 example: 1
             *               name:
             *                 type: string
             *                 description: The country's name.
             *                 example: Admin
             *               iso3:
             *                 type: string
             *                 description: The country iso3
             *                              code (three characters).
             *                 example: ALB
             *               iso2:
             *                 type: string
             *                 description: The country iso2
             *                              code (two characters).
             *                 example: AL
             *               numeric_code:
             *                 type: string
             *                 description: The country numeric code.
             *                 example: 008
             *               phone_code:
             *                 type: string
             *                 description: The country phone code.
             *                 example: 355
             *               currency:
             *                 type: string
             *                 description: The country currency.
             *                 example: ALL
             *               currency_name:
             *                 type: string
             *                 description: The country currency name.
             *                 example: Albanian lek
             *               currency_symbol:
             *                 type: string
             *                 description: The country currency symbol.
             *                 example: Lek
             *               tld:
             *                 type: string
             *                 description: The country tld.
             *                 example: .al
             *               latitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 41.00000000
             *               longitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 20.00000000
             *               emoji:
             *                 type: string
             *                 description: The country emoji.
             *                 example: 🇦🇱
             *               emojiU:
             *                 type: string
             *                 description: The country emojiU.
             *                 example: U+1F1E6 U+1F1F1
             *             required:
             *               - name
             *               - id
             *               - iso3
             *               - iso2
             *               - numeric_code
             *               - phone_code
             *               - currency
             *               - currency_name
             *               - currency_symbol
             *               - tld
             *               - latitude
             *               - longitude
             *               - emoji
             *               - emojiU
             *
             *     responses:
             *       201:
             *         description: Country successfully created.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Country'
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
            router.post("/", countryController.store);

            /**
             * @swagger
             * /v1/{lang}/countries:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Country
             *     operationId: showAllCountries
             *     summary: Get all countries.
             *     description: Get all countries from the system.
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
             *      - in: query
             *        name: name
             *        schema:
             *          type: string
             *        description: The country name
             *
             *     responses:
             *       200:
             *         description: The countries have been successfully
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
             *                      $ref: '#/components/schemas/Country'
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
            router.get("/", countryController.filterCountries);
          })
        );

        router.use(
          "/country",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/country/{countryId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Country
             *     operationId: show
             *     summary: Get a country by ID.
             *     description: Get a country by id from the system.
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
             *         description: The country has successfully retrieve.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Country'
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
            router.get("/:countryId", countryController.getCountryById);

            /**
             * @swagger
             * /v1/{lang}/country/{countryId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Country
             *     operationId: countryupdate
             *     summary: Update a country by ID.
             *     description: Update a country by ID.
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
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               id:
             *                 type: string
             *                 description: The country ID
             *                 example: 1
             *               name:
             *                 type: string
             *                 description: The country's name.
             *                 example: Admin
             *               iso3:
             *                 type: string
             *                 description: The country iso3
             *                              code (three characters).
             *                 example: ALB
             *               iso2:
             *                 type: string
             *                 description: The country iso2
             *                              code (two characters).
             *                 example: AL
             *               numeric_code:
             *                 type: string
             *                 description: The country numeric code.
             *                 example: 008
             *               phone_code:
             *                 type: string
             *                 description: The country phone code.
             *                 example: 355
             *               currency:
             *                 type: string
             *                 description: The country currency.
             *                 example: ALL
             *               currency_name:
             *                 type: string
             *                 description: The country currency name.
             *                 example: Albanian lek
             *               currency_symbol:
             *                 type: string
             *                 description: The country currency symbol.
             *                 example: Lek
             *               tld:
             *                 type: string
             *                 description: The country tld.
             *                 example: .al
             *               latitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 41.00000000
             *               longitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 20.00000000
             *               emoji:
             *                 type: string
             *                 description: The country emoji.
             *                 example: 🇦🇱
             *               emojiU:
             *                 type: string
             *                 description: The country emojiU.
             *                 example: U+1F1E6 U+1F1F1
             *             required:
             *               - name
             *               - id
             *               - iso3
             *               - iso2
             *               - numeric_code
             *               - phone_code
             *               - currency
             *               - currency_name
             *               - currency_symbol
             *               - tld
             *               - latitude
             *               - longitude
             *               - emoji
             *               - emojiU
             *         application/x-www-form-urlencoded:
             *           schema:
             *             type: object
             *             properties:
             *               id:
             *                 type: string
             *                 description: The country ID
             *                 example: 1
             *               name:
             *                 type: string
             *                 description: The country's name.
             *                 example: Admin
             *               iso3:
             *                 type: string
             *                 description: The country iso3
             *                              code (three characters).
             *                 example: ALB
             *               iso2:
             *                 type: string
             *                 description: The country iso2
             *                              code (two characters).
             *                 example: AL
             *               numeric_code:
             *                 type: string
             *                 description: The country numeric code.
             *                 example: 008
             *               phone_code:
             *                 type: string
             *                 description: The country phone code.
             *                 example: 355
             *               currency:
             *                 type: string
             *                 description: The country currency.
             *                 example: ALL
             *               currency_name:
             *                 type: string
             *                 description: The country currency name.
             *                 example: Albanian lek
             *               currency_symbol:
             *                 type: string
             *                 description: The country currency symbol.
             *                 example: Lek
             *               tld:
             *                 type: string
             *                 description: The country tld.
             *                 example: .al
             *               latitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 41.00000000
             *               longitude:
             *                 type: string
             *                 description: The country latitude.
             *                 example: 20.00000000
             *               emoji:
             *                 type: string
             *                 description: The country emoji.
             *                 example: 🇦🇱
             *               emojiU:
             *                 type: string
             *                 description: The country emojiU.
             *                 example: U+1F1E6 U+1F1F1
             *             required:
             *               - name
             *               - id
             *               - iso3
             *               - iso2
             *               - numeric_code
             *               - phone_code
             *               - currency
             *               - currency_name
             *               - currency_symbol
             *               - tld
             *               - latitude
             *               - longitude
             *               - emoji
             *               - emojiU
             *     responses:
             *       200:
             *         description: The country has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Country'
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
            router.put("/:countryId", countryController.update);

            /**
             * @swagger
             * /v1/{lang}/country/{countryId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Country
             *     operationId: countrydelete
             *     summary: Delete a country by ID.
             *     description: Delete a country by ID.
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
             *        description: String ID of the country to delete
             *
             *     responses:
             *       204:
             *         description: The country delete successfully.
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
            router.delete("/:countryId", countryController.delete);
          })
        );
      })
    );
  }
}

const countryRoutes = new CountryRoutes();
export default countryRoutes;
