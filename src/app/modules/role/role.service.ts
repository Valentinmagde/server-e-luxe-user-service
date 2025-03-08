import { slugify } from "../../utils/helpers.util";
import Role from "./role.model";
import RoleType from "./role.type";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-04-20
 *
 * Class RoleService
 */
class RoleService {
  /**
   * Get role details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-21
   *
   * @param {string} roleId the role id
   * @returns {Promise<unknown>} the eventual completion or failure
   */
  public getById(roleId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const role = await Role.findById(roleId);

          resolve(role);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get all roles details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-21
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getAll(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const roles = await Role.find();

          resolve(roles);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create a new role
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-20
   *
   * @param {RoleType} data the role data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async store(data: RoleType): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if(!data?.slug) {
            data.slug = slugify(data?.name?.en || data?.name?.fr);
          }

          const role = new Role(data);

          const createdRole = await role.save();

          resolve(createdRole);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update a role
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-21
   *
   * @param {string} roleId the role id
   * @param {any} data the role data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async update(
    roleId: string,
    data: any
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const role = await Role.findById(roleId);

          if (role) {
            role.name = { ...role.name, ...data.name };
            role.slug = data.slug || role.slug || slugify(role?.name?.en || role?.name?.fr);
            role.priority = data?.priority || role?.priority;

            const updatedRole = await role.save();

            resolve(updatedRole);
          } else {
            resolve(role);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete a role by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-04-21
   *
   * @param {string} roleId the role id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public delete(roleId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const role = await Role.findById(roleId);

          if (role) {
            const deleteRole = await role.deleteOne();

            resolve(deleteRole);
          } else {
            resolve(role);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}

const roleService = new RoleService();
export default roleService;
