import { Request } from "express";
import State from "./state.model";
import Country from "../country/country.model";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-08-06
 *
 * Class StateService
 */
class StateService {
  /**
   * Get state details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @param {string} stateId the state id
   * @returns {Promise<unknown>} the eventual completion or failure
   */
  public getStateById(stateId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const state = await State.findById(stateId);

          resolve(state);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get states by country
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @param {string} countryId the country id
   * @returns {Promise<unknown>} the eventual completion or failure
   */
  public getStatesByCountry(countryId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const country: any = await Country.findOne({ id: countryId });

          if (country) {
            const states = await State.find({ country_id: countryId });

            resolve(states);
          } else {
            resolve("COUNTRY_NOT_FOUND");
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get all states
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @param {Request} req the http request
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getStates(req: Request): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pageSize = Number(req.query.perPage) || 15;
          const page: number = Number(req.query.page) || 1;

          const count: any = await State.count();

          const states = await State.find()
            .skip(pageSize * (page - 1))
            .limit(pageSize);

          const previousPage: any = page === 1 ? null : page - 1;
          const currentPage: number = page;
          const pages: number = Math.ceil(count / pageSize);
          const nextPage: any = pages > page ? page + 1 : null;

          resolve({
            states,
            previousPage,
            perPage: pageSize,
            allCountries: count,
            currentPage,
            pages,
            nextPage,
          });
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create a new state
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-05
   *
   * @param {any} data the state data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async store(data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const state = new State(data);

          const createdState = await state.save();

          resolve(createdState);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update a state
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @param {string} stateId the state id
   * @param {any} data the role data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async update(stateId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const state = await State.findById(stateId);

          if (state) {
            state.id = data.id || state.id;
            state.name = data.name || state.name;
            state.country_id = data.country_id || state.country_id;
            state.country_code = data.country_code || state.country_code;
            state.country_name = data.country_name || state.country_name;
            state.state_code = data.state_code || state.state_code;
            state.type = data.type || state.type;
            state.latitude = data.latitude || state.latitude;
            state.longitude = data.latitude || state.latitude;

            const updatedState = await state.save();

            resolve(updatedState);
          } else {
            resolve(state);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete a state by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @param {string} stateId the state id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public delete(stateId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const state = await State.findById(stateId);

          if (state) {
            const deleteState = await state.deleteOne();

            resolve(deleteState);
          } else {
            resolve(state);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}

const stateService = new StateService();
export default stateService;
