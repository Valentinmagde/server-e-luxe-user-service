import User from "./user.model";
import passwordHash from "../../utils/password-hash.util";
import Role from "../role/role.model";
import UserType from "./user.type";
import RoleType from "../role/role.type";
import * as jsonpatch from "fast-json-patch";
import Referral from "../referral/referral.model";
import referralService from "../referral/referral.service";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-03-22
 *
 * Class UserService
 */
class UserService {
  /**
   * Login
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-22-03
   *
   * @param {any} data the user data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async login(data: {
    email: string;
    password: string;
  }): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const user: any = await User.findOne({ email: data.email })
            .populate("gender")
            .populate("roles")
            .populate("role")
            .select("+password");

          if (user && user.status === "Inactive") {
            resolve("INACTIVE_USER");
          }

          if (user && passwordHash.compareHash(data.password, user.password)) {
            await User.findOneAndUpdate(
              { email: data.email },
              { $set: { online: true } }
            );

            const loginRes = {
              _id: user._id,
              name: user.name,
              username: user.username,
              last_name: user.last_name,
              first_name: user.first_name,
              email: user.email,
              gender: user.gender,
              image: user.image,
              role: user.role,
              roles: user.roles,
            };

            resolve(loginRes);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Social login (Google / Facebook). Finds the user by email, creating
   * one on first sign-in, then returns it in the same shape as login().
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2026-06-26
   *
   * @param {any} data the verified provider profile
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async socialLogin(data: {
    email: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    image?: string;
    provider: string;
    social_id: string;
  }): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let user: any = await User.findOne({ email: data.email })
            .populate("gender")
            .populate("roles")
            .populate("role");

          if (user && user.status === "Inactive") {
            resolve("INACTIVE_USER");
            return;
          }

          if (!user) {
            const newUser = new User({
              email: data.email,
              first_name: data.first_name,
              last_name: data.last_name,
              name: data.name,
              image: data.image,
              provider: data.provider,
              social_id: data.social_id,
            });

            user = await newUser.save();

            await referralService.store({
              userId: user._id,
              referredBy: null,
            });
          } else if (user.provider === "local") {
            await User.findOneAndUpdate(
              { email: data.email },
              { $set: { provider: data.provider, social_id: data.social_id } }
            );
          }

          await User.findOneAndUpdate(
            { email: data.email },
            { $set: { online: true } }
          );

          const loginRes = {
            _id: user._id,
            name: user.name,
            username: user.username,
            last_name: user.last_name,
            first_name: user.first_name,
            email: user.email,
            gender: user.gender,
            image: user.image,
            role: user.role,
            roles: user.roles,
          };

          resolve(loginRes);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get user details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-22-03
   *
   * @param {string} userId the user id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public profile(userId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const user = await User.findById(userId)
            .populate("roles")
            .populate("role")
            .populate("gender")
            .populate("billing_address.country")
            .populate("billing_address.state")
            .populate("delivery_address.country")
            .populate({
              path: "delivery_address.country",
              populate: [
                {
                  path: "states",
                  model: "state",
                },
              ],
            })
            .populate("delivery_address.state")
            .populate("referral");

          resolve(user);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get users by roles with pagination and sorting.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-03-11
   *
   * @param {any} query - The query object containing roles, page, limit, and sort.
   * @return {Promise<unknown>} A promise that resolves to an array of users.
   */
  public async getUsersByRoles(query: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const {
            roles,
            page = 1,
            limit = 12,
            sort = "created_at:desc",
          } = query;
          const skip = (page - 1) * limit;
          const [sortField, sortOrder] = sort.toString().split(":");

          // Convertir `roles` en tableau de chaînes
          const rolesArray =
            typeof roles === "string"
              ? roles.split(",")
              : Array.isArray(roles)
              ? roles.map((role) => role.toString())
              : [];

          let filter = {};
          if (rolesArray.length > 0) {
            // Trouver les rôles correspondants dans la base de données
            const roleDocuments = await Role.find({
              slug: { $in: rolesArray.map((role) => role.trim()) },
            });

            // Filtrer les utilisateurs par les IDs des rôles trouvés
            filter = { roles: { $in: roleDocuments.map((role) => role._id) } };
          }

          // Trouver les utilisateurs avec pagination et tri
          const users = await User.find(filter)
            .sort({ [sortField]: sortOrder === "desc" ? -1 : 1 })
            .skip(skip)
            .limit(limit);

          resolve(users);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get all customers.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-29
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getAllCustomers(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // Find the ObjectId for the "Customer" role
          const customerRole = await Role.findOne({ slug: "customer" });
          const customerRoleId = customerRole ? customerRole._id : null;

          const users = await User.find({
            $or: [
              { roles: { $exists: false } },
              { roles: { $size: 0 } },
              { roles: { $in: [customerRoleId] } },
            ],
          })
            .sort({ _id: -1 })
            .populate("roles")
            .populate("billing_address.country")
            .populate("billing_address.state")
            .populate("delivery_address.country")
            .populate("delivery_address.state");

          resolve(users);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get all staff.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-08-02
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getAllStaff(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // Find the ObjectId for the "Customer" role
          const customerRole = await Role.findOne({ slug: "customer" });
          const customerRoleId = customerRole ? customerRole._id : null;

          const users = await User.find({
            roles: { $exists: true, $not: { $size: 0 } }, // Ensure that the roles field exists and is not empty
            $or: [
              { "roles.2": { $exists: true } }, // Users with multiple roles
              { roles: { $nin: [customerRoleId] } }, // Users with a role other than customerRoleId
            ],
          })
            .sort({ _id: -1 })
            .populate("roles")
            .populate("role")
            .populate("billing_address.country")
            .populate("billing_address.state")
            .populate("delivery_address.country")
            .populate("delivery_address.state");

          resolve(users);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get user details by username
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-10-10
   *
   * @param {string} userName the username
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public showByUsername(userName: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const user = await User.findOne({ username: userName })
            .populate("roles")
            .populate("billing_address.country")
            .populate("billing_address.state")
            .populate("delivery_address.country")
            .populate("delivery_address.state")
            .populate("vendor.store_info.state")
            .populate("vendor.store_info.country");

          resolve(user);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Assign a role to a user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-21
   *
   * @param {string} userId the user id
   * @param {string} roleId the role id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public assign(userId: string, roleId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const user: any = await User.findById(userId);

          if (user) {
            const role: RoleType | null = await Role.findById(roleId);

            if (role) {
              // Check if the user doesn't already have this role
              if (user.roles.includes(role._id)) resolve("ALREADY_ASSIGNED");
              else {
                user.roles = [...user.roles, role._id];

                await user.save();
              }

              resolve(user);
            } else {
              resolve("ROLE_NOT_FOUND");
            }
          } else {
            resolve("USER_NOT_FOUND");
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Unassign a role to a user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-21
   *
   * @param {string} userId the user id
   * @param {string} roleId the role id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public unassign(userId: string, roleId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const user: any = await User.findById(userId);

          if (user) {
            const role: RoleType | null = await Role.findById(roleId);

            if (role) {
              // Check if the user have this role
              if (!user.roles.includes(role._id)) resolve("NOT_HAVE_THIS_ROLE");
              else {
                user.roles = user.roles.filter(
                  (x: any) => x.toString() != role._id.toString()
                );

                await user.save();
              }

              resolve(user);
            } else {
              resolve("ROLE_NOT_FOUND");
            }
          } else {
            resolve("USER_NOT_FOUND");
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Register user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-22-03
   *
   * @param {any} data the user data to store.
   * @param {any} files - .
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async register(data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const isAdded = await User.findOne({ email: data.email });

          if (isAdded) {
            resolve("EMAIL_ALREADY_TAKEN");
          }

          const newUser = new User({
            ...data,
            password: passwordHash.createHash(data.password),
          });

          const user = await newUser.save();
          let referredBy = null;

          if (data?.referralCode) {
            const referral = await Referral.findOne({
              code: data.referralCode,
            });

            if (!referral) {
              resolve("REFERRAL_CODE_NOT_FOUND");
            }

            referredBy = referral?.user;
          }

          await referralService.store({
            userId: user._id,
            referredBy,
          });

          resolve(user);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create new user.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-29
   *
   * @param {any} data the user data to store.
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async store(data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const newUser = new User({
            ...data,
            password: passwordHash.createHash(data.password),
          });

          const createdUser = await newUser.save();
          let referredBy = null;

          if (data?.referralCode) {
            const referral = await Referral.findOne({
              code: data.referralCode,
            });

            if (!referral) {
              resolve("REFERRAL_CODE_NOT_FOUND");
            }

            referredBy = referral?.user;
          }

          await referralService.store({
            userId: createdUser._id,
            referredBy,
          });

          resolve(createdUser);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create multiple users.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-29
   *
   * @param {any} data the user data to store.
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async storeMultiple(data: Array<UserType>): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const createdUsers = await User.insertMany(data);

          resolve(createdUsers);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Subscribe to newsletter
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-30
   *
   * @param {any} data the user data to store
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async subscribe(data: UserType): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const role = await Role.findOne({ name: "Subscriber" });

          if (role) {
            const user = await User.findOne({ email: data.email });

            if (user) {
              if (!user.roles.includes(role._id)) {
                user.roles = [...user.roles, role._id];
                await user.save();
              }

              resolve(user);
            } else {
              data.username = data.email;
              data.password = passwordHash.createHash(data.email);

              const user = new User(data);
              const createdUser = await user.save();

              resolve(createdUser);
            }
          } else {
            resolve("ROLE_NOT_FOUND");
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Send reset password link
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-22
   *
   * @param {any} data the user data
   * @return {Promise<any>} the eventual completion or failure
   */
  public async sendResetPasswordLink(data: UserType): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const user = await User.findOne({ email: data.email });

          resolve(user);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update a user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-10
   *
   * @param {string} userId the user id
   * @param {any} data the user data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async update(userId: string, data: UserType): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const user: any = await User.findById(userId).select("+password");

          if (!user) resolve(null);

          if (data.current_password) {
            if (
              !passwordHash.compareHash(data.current_password, user.password)
            ) {
              resolve("INCORRECT_PASSWORD");
            }
            if (data.current_password === data.new_password) {
              resolve("NEW_PASSWORD_MUST_BE_DIFFERENT");
            }
            user.password = passwordHash.createHash(data.new_password);
          }

          data.password = data.password
            ? passwordHash.createHash(data.password)
            : user.password;

          const updateObject = { ...user.toObject(), ...data };

          await User.updateOne({ _id: userId }, { $set: updateObject });

          resolve(updateObject);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Patch a user
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-21
   *
   * @param {string} userId the user id
   * @param {any} data the update object
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async patch(userId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const user = await User.findById(userId);

          if (user) {
            const updateObject = jsonpatch.applyPatch(
              user.toObject(),
              data,
              false,
              true
            ).newDocument;

            await User.updateOne({ _id: userId }, { $set: updateObject });

            resolve(updateObject);
          } else {
            resolve(user);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Reset password
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-27
   *
   * @param {string} userId the user id
   * @param {any} data the user data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async resetPassword(userId: string, data: UserType): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let user: any = await User.findById(userId).select("+password");

          if (user) {
            if (
              data.new_password &&
              data.new_password === data.confirm_password
            ) {
              user.password = passwordHash.createHash(data.new_password);

              await new User(user).save();

              user = await User.findById(userId)
                .populate("gender")
                .populate("roles");

              resolve(user);
            } else {
              resolve("NEW_AND_CONFIRM_PASSWORD_MUST_BE_SAME");
            }
          } else {
            resolve(user);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete a user by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-10
   *
   * @param {string} userId the user id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public delete(userId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const user: any = await User.findById(userId).populate(
            "roles"
          );

          if (user) {
            let roles: Array<RoleType> = user?.roles as Array<RoleType>;
            roles = roles.filter((role) => role.name.en == "Administrator");

            if (roles.length) resolve("isAdmin"); else await user.softDelete();
          }
          resolve(user);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}

const userService = new UserService();
export default userService;
