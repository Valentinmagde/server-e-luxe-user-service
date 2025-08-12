import express, { Router } from "express";
import dotenv from "dotenv";
import routesGrouping from "../../utils/routes-grouping.util";
import userController from "./user.controller";
import multer from "multer";

const upload = multer();

dotenv.config();

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-04-21
 *
 * Class UserRoutes
 */
class UserRoutes {
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
   * Creating all user routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-21
   *
   * @returns {Router} the user routes
   */
  public userRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/users",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/users/register:
             *   post:
             *     tags:
             *     - User
             *     operationId: register
             *     summary: Create user.
             *     description: Add user into the system.
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
             *               name:
             *                 type: string
             *                 description: The user's name.
             *                 example: John
             *               email:
             *                 type: string
             *                 description: The user's email.
             *                 example: admin@example.com
             *                 format: email
             *               password:
             *                 type: string
             *                 format: password
             *                 description: The user's password.
             *                 example: admin
             *             required:
             *               - name
             *               - email
             *               - password
             *
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               name:
             *                 type: string
             *                 description: The user's name.
             *                 example: John
             *               email:
             *                 type: string
             *                 description: The user's email.
             *                 example: admin@example.com
             *                 format: email
             *               password:
             *                 type: string
             *                 format: password
             *                 description: The user's password.
             *                 example: admin
             *             required:
             *               - name
             *               - email
             *               - password
             *
             *     responses:
             *       201:
             *         description: User successfully created.
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
            router.post(
              "/register",
              upload.fields([
                { name: "avatar", maxCount: 1 },
                { name: "cover", maxCount: 1 },
              ]),
              (req, res) => userController.register(req, res)
            );

            /**
             * @swagger
             * /v1/{lang}/users:
             *   post:
             *     tags:
             *     - User
             *     operationId: store
             *     summary: Create user.
             *     description: Add user into the system.
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
             *               username:
             *                 type: string
             *                 description: The user's name.
             *                 example: John
             *               last_name:
             *                 type: string
             *                 description: The user's last name.
             *                 example: Doe
             *               email:
             *                 type: string
             *                 description: The user's email.
             *                 example: admin@example.com
             *                 format: email
             *               gender:
             *                 description: Gender ID
             *                 required: true
             *                 type: string
             *                 example: 6442aa155564a41669de60cb
             *               password:
             *                 type: string
             *                 format: password
             *                 description: The user's password.
             *                 example: admin
             *             required:
             *               - username
             *               - last_name
             *               - email
             *               - gender
             *               - password
             *
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               username:
             *                 type: string
             *                 description: The user's name.
             *                 example: John
             *               last_name:
             *                 type: string
             *                 description: The user's last name.
             *                 example: Doe
             *               email:
             *                 type: string
             *                 description: The user's email.
             *                 example: admin@example.com
             *                 format: email
             *               gender:
             *                 description: Gender ID
             *                 required: true
             *                 type: string
             *                 example: 6442aa155564a41669de60cb
             *               password:
             *                 type: string
             *                 format: password
             *                 description: The user's password.
             *                 example: admin
             *             required:
             *               - username
             *               - last_name
             *               - email
             *               - gender
             *               - password
             *
             *     responses:
             *       201:
             *         description: User successfully created.
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
             router.post("/", (req, res) => userController.store(req, res));

            /**
             * @swagger
             * /v1/{lang}/users/many:
             *   post:
             *     tags:
             *     - User
             *     operationId: storeMultiple
             *     summary: Create multiple user.
             *     description: Add many users into the system.
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
             *             type: array
             *             items:
             *               type: object
             *               properties:
             *                 username:
             *                   type: string
             *                   description: The user's name.
             *                   example: John
             *                 last_name:
             *                   type: string
             *                   description: The user's last name.
             *                   example: Doe
             *                 email:
             *                   type: string
             *                   description: The user's email.
             *                   example: admin@example.com
             *                   format: email
             *                 gender:
             *                   description: Gender ID
             *                   required: true
             *                   type: string
             *                   example: 6442aa155564a41669de60cb
             *                 password:
             *                   type: string
             *                   format: password
             *                   description: The user's password.
             *                   example: admin
             *             required:
             *               - username
             *               - last_name
             *               - email
             *               - gender
             *               - password
             *
             *     responses:
             *       201:
             *         description: Users successfully created.
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
             *                      $ref: '#/components/schemas/User'
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
            router.post("/many", userController.storeMultiple);

            /**
             * @swagger
             * /v1/{lang}/users:
             *   get:
             *     tags:
             *     - User
             *     operationId: getAllUsers
             *     summary: Get all users.
             *     description: Get all users from system.
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
             *        name: roles
             *        schema:
             *          type: string
             *        description: Roles's slug separated by commas
             *      - in: query
             *        name: page
             *        schema:
             *          type: number
             *        description: Page index
             *      - in: query
             *        name: limit
             *        schema:
             *          type: number
             *        description: Number of elements per page
             *
             *     responses:
             *       200:
             *         description: The users were successfully retrieved.
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
             *                      $ref: '#/components/schemas/User'
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
            router.get("/", userController.getUsersByRoles);

            /**
             * @swagger
             * /v1/{lang}/users/customers:
             *   get:
             *     tags:
             *     - User
             *     operationId: getAllCustomer
             *     summary: Get all customers.
             *     description: Get all customers from system.
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
             *         description: The customers were successfully retrieved.
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
             *                      $ref: '#/components/schemas/User'
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
            router.get("/customers", userController.getAllCustomers);

            /**
             * @swagger
             * /v1/{lang}/users/staff:
             *   get:
             *     tags:
             *     - User
             *     operationId: getAllStaff
             *     summary: Get all staff.
             *     description: Get all staff from the system.
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
             *         description:  All staff members successfully recovered .
             *         content:
             *           application/json:
             *             schema:
             *                type: array
             *                items:
             *                  type: object
             *                  properties:
             *                    status:
             *                      type: string
             *                      example: Ok
             *                    data:
             *                      $ref: '#/components/schemas/User'
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
            router.get("/staff", userController.getAllStaff);

            /**
             * @swagger
             * /v1/{lang}/users/subscribe:
             *   post:
             *     tags:
             *     - User
             *     operationId: subscribe
             *     summary: Subscribe to newsletter.
             *     description: Subscribe to newsletter.
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
             *                 description: The user's email.
             *                 example: admin@example.com
             *                 format: email
             *                 required: true
             *
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               email:
             *                 type: string
             *                 description: The user's email.
             *                 example: admin@example.com
             *                 format: email
             *                 required: true
             *
             *     responses:
             *       201:
             *         description: User successfully subscribed.
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
            router.post("/subscribe", userController.subscribe);

            /**
             * //@swagger
             * /v1/{lang}/users/login:
             *   post:
             *     tags:
             *     - User
             *     operationId: login
             *     summary: Logs user into the system.
             *     description: Logs user into the system.
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
             *                 description: The user's email.
             *                 example: admin@example.com
             *               password:
             *                 type: string
             *                 format: password
             *                 description: The user's password.
             *                 example: admin
             *             required:
             *               - email
             *               - password
             *     responses:
             *       200:
             *         description: The user has successfully logged in.
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 status:
             *                  type: string
             *                  example: Ok
             *                 data:
             *                   type: array
             *                   items:
             *                     type: object
             *                     properties:
             *                       _id:
             *                         type: integer
             *                         description: The user ID.
             *                         example: 0
             *                       name:
             *                         type: string
             *                         description: The user's name.
             *                         example: Leanne Graham
             *                       email:
             *                         type: string
             *                         description: The user's email.
             *                         example: admin@example.com
             *                       isAdmin:
             *                         type: boolean
             *                         description: The user's role.
             *                         example: true
             *                       token:
             *                         type: string
             *                         description: json web token.
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '412':
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
            router.post("/login", userController.login);
          })
        );

        router.use(
          "/user",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/user/{userId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - User
             *     operationId: profile
             *     summary: Get a user by ID.
             *     description: Get a user by id from the system.
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
             *         description: The user has successfully logged in.
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
            router.get("/:userId", userController.profile);

            /**
             * @swagger
             * /v1/{lang}/user/username/{userName}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - User
             *     operationId: showByUsername
             *     summary: Get a user by username.
             *     description: Get a user by username from the system.
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
             *        name: userName
             *        schema:
             *          type: string
             *        required: true
             *        description: String username of the user to get
             *
             *     responses:
             *       200:
             *         description: The user has successfully retrieved.
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
            router.get("/username/:userName", userController.showByUsername);

            /**
             * @swagger
             * /v1/{lang}/user/{userId}/role/{roleId}/assign:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - User
             *     operationId: assignrole
             *     summary: Assign a role to a user.
             *     description: Assign a role to a user.
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
             *      - in: path
             *        name: roleId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the role to get
             *
             *     responses:
             *       200:
             *         description: The role successfully assigned to a user.
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
            router.get("/:userId/role/:roleId/assign", userController.assign);

            /**
             * @swagger
             * /v1/{lang}/user/{userId}/role/{roleId}/unassign:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - User
             *     operationId: unassignrole
             *     summary: Unassign a role to a user.
             *     description: Unassign a role to a user.
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
             *      - in: path
             *        name: roleId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the role to get
             *
             *     responses:
             *       200:
             *         description: The role successfully unassigned to a user.
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
              "/:userId/role/:roleId/unassign",
              userController.unassign
            );

            /**
             * @swagger
             * /v1/{lang}/user/sendResetPasswordLink:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - User
             *     operationId: sendResetPasswordLink
             *     summary: Send reset password link.
             *     description: Send reset password link.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *     requestBody:
             *       required: true
             *       content:
             *         application/x-www-form-urlencoded:
             *           schema:
             *             type: object
             *             properties:
             *               email:
             *                 type: string
             *                 description: The user's email.
             *                 example: admin@example.com
             *               returnPath:
             *                 type: string
             *                 description: |
             *                  The path to redirect your customer to after he clicks on the password reset
             *                  link sent by e-mail.\
             *                  This path will be automatically concatenated with the customer's
             *                  identifier.\
             *                  The default path is /reset-password.
             *                 example: /reset-password
             *             required:
             *               - email
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               email:
             *                 type: string
             *                 description: The user's email.
             *                 example: admin@example.com
             *               returnPath:
             *                 type: string
             *                 description: |
             *                  The path to redirect your customer to after he clicks on the password reset link sent
             *                  by e-mail.
             *                  This path will be automatically concatenated with the customer's identifier.
             *                  The default path is /reset-password
             *                 example: /reset-password
             *             required:
             *               - email
             *     responses:
             *       200:
             *         description: Link successfully sent.
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
            router.post(
              "/sendResetPasswordLink",
              (req, res) => userController.sendResetPasswordLink(req, res)
            );

            /**
             * @swagger
             * /v1/{lang}/user/{userId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - User
             *     operationId: update
             *     summary: Update a user by ID.
             *     description: Update a user by ID.
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
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               last_name:
             *                 type: string
             *                 description: The user's name.
             *                 example: John
             *               first_name:
             *                 type: string
             *                 description: The user's last name.
             *                 example: Doe
             *               gender:
             *                 description: Gender ID
             *                 required: true
             *                 type: string
             *                 example: 6442aa155564a41669de60cb
             *               billing_address:
             *                 type: object
             *                 properties:
             *                   last_name:
             *                     type: string
             *                     description: The user's name.
             *                     example: John
             *                   first_name:
             *                     type: string
             *                     description: The user's last name.
             *                     example: Doe
             *                   company:
             *                     type: string
             *                   address1:
             *                     type: string
             *                   address2:
             *                     type: string
             *                   city:
             *                     type: string
             *                   postal_code:
             *                     type: number
             *                   country:
             *                     type: string
             *                   state:
             *                     type: string
             *                   phone:
             *                     type: string
             *                   email:
             *                     type: string
             *               delivery_address:
             *                 type: object
             *                 properties:
             *                   last_name:
             *                     type: string
             *                     description: The user's name.
             *                     example: John
             *                   first_name:
             *                     type: string
             *                     description: The user's last name.
             *                     example: Doe
             *                   company:
             *                     type: string
             *                   address1:
             *                     type: string
             *                   address2:
             *                     type: string
             *                   city:
             *                     type: string
             *                   postal_code:
             *                     type: number
             *                   country:
             *                     type: string
             *                   state:
             *                     type: string
             *                   phone:
             *                     type: string
             *                   email:
             *                     type: string
             *               vendor:
             *                 type: object
             *                 properties:
             *                   personal_info:
             *                     type: object
             *                     properties:
             *                       country:
             *                         type: string
             *                       state:
             *                         type: string
             *                       currency:
             *                         type: string
             *                       log:
             *                         type: string
             *                       description:
             *                         type: string
             *                       rating:
             *                         type: number
             *                       num_reviews:
             *                         type: number
             *                   store_info:
             *                     type: object
             *                     properties:
             *                       name:
             *                         type: string
             *                       url:
             *                         type: string
             *                       address1:
             *                         type: string
             *                       address2:
             *                         type: string
             *                       city:
             *                         type: string
             *                       zip_code:
             *                         type: string
             *                       country:
             *                         type: string
             *                       state:
             *                         type: string
             *                       phone:
             *                         type: string
             *                       facebook:
             *                         type: string
             *                       twitter:
             *                         type: string
             *                       linkedin:
             *                         type: string
             *                       youtube:
             *                         type: string
             *                       instagram:
             *                         type: string
             *                   payment_options:
             *                     type: object
             *                     properties:
             *                       bank_name:
             *                         type: string
             *                       account_name:
             *                         type: string
             *                       account_number:
             *                         type: number
             *                       bank_address:
             *                         type: string
             *                       routing_number:
             *                         type: number
             *                       bank_iban:
             *                         type: number
             *                       bank_swift:
             *                         type: string
             *                   vendor_options:
             *                     type: object
             *                     properties:
             *                       selling:
             *                         type: boolean
             *                       publishing:
             *                         type: boolean
             *                       feature_vendor:
             *                         type: boolean
             *             required:
             *               - last_name
             *               - gender
             *     responses:
             *       200:
             *         description: The user has successfully logged in.
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
            router.put("/:userId", userController.update);

            /**
             * @swagger
             * /v1/{lang}/user/{userId}:
             *   patch:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - User
             *     operationId: patch
             *     summary: Patch a user by ID.
             *     description: Patch a user by ID.
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
             *        description: String ID of the order to get
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
             *         description: The user has successfully patched in.
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
            router.patch("/:userId", userController.patch);

            /**
             * @swagger
             * /v1/{lang}/user/{userId}/resetPassword:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - User
             *     operationId: resetPassword
             *     summary: Reset user password by user ID.
             *     description: Reset user password by user ID.
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
             *     requestBody:
             *       required: true
             *       content:
             *         application/x-www-form-urlencoded:
             *           schema:
             *             type: object
             *             properties:
             *               new_password:
             *                 type: string
             *                 format: password
             *                 description: The new password.
             *                 required: true
             *               confirm_password:
             *                 type: string
             *                 format: password
             *                 description: The confirm password.
             *                 required: true
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               new_password:
             *                 type: string
             *                 format: password
             *                 description: The new password.
             *                 required: true
             *               confirm_password:
             *                 type: string
             *                 format: password
             *                 description: The confirm password.
             *                 required: true
             *     responses:
             *       200:
             *         description: The user has successfully logged in.
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
            router.post("/:userId/resetPassword", userController.resetPassword);

            /**
             * @swagger
             * /v1/{lang}/user/{userId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - User
             *     operationId: delete
             *     summary: Delete a user by ID.
             *     description: Delete a user by ID.
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
             *        description: String ID of the user to delete
             *
             *     responses:
             *       204:
             *         description: The user deleted successfully.
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
            router.delete("/:userId", userController.delete);
          })
        );
      })
    );
  }
}

const userRoutes = new UserRoutes();
export default userRoutes;
