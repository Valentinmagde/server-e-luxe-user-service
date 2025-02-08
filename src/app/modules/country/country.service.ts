import { Request } from "express-jwt";
import Country from "./country.model";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-08-06
 *
 * Class CountryService
 */
class CountryService {
  /**
   * Get country details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @param {string} countryId the country id
   * @returns {Promise<unknown>} the eventual completion or failure
   */
  public getCountryById(countryId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const country = await Country.findById(countryId);

          resolve(country);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * filter countries
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @param {Request} req the http request
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public filterCountries(req: Request): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pageSize = Number(req.query.perPage) || 15;
          const page: number = Number(req.query.page) || 1;
          const name: any = req.query.name || "";

          const nameFilter: any = name
            ? { name: { $regex: name, $options: "i" } }
            : {};

          const count: any = await Country.count({
            ...nameFilter,
          });

          const countries = await Country.find({
            ...nameFilter,
          })
            .populate("states")
            .skip(pageSize * (page - 1))
            .limit(pageSize);

          const previousPage: any = page === 1 ? null : page - 1;
          const currentPage: number = page;
          const pages: number = Math.ceil(count / pageSize);
          const nextPage: any = pages > page ? page + 1 : null;

          resolve({
            countries,
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
   * Create a new country
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-05
   *
   * @param {any} data the country data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async store(data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const country = new Country(data);

          const createdCountry = await country.save();

          resolve(createdCountry);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update a country
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @param {string} countryId the country id
   * @param {any} data the role data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async update(countryId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const country = await Country.findById(countryId);

          if (country) {
            country.id = data.id || country.id;
            country.name = data.name || country.name;
            country.iso3 = data.iso3 || country.iso3;
            country.iso2 = data.iso2 || country.iso2;
            country.numeric_code = data.numeric_code || country.numeric_code;
            country.phone_code = data.phone_code || country.phone_code;
            country.currency = data.currency || country.currency;
            country.currency_name = data.currency_name || country.currency_name;
            country.currency_symbol =
              data.currency_symbol || country.currency_symbol;
            country.tld = data.tld || country.tld;
            country.latitude = data.latitude || country.latitude;
            country.longitude = data.longitude || country.longitude;
            country.emoji = data.longitude || country.longitude;
            country.emojiU = data.emojiU || country.emojiU;

            const updatedCountry = await country.save();

            resolve(updatedCountry);
          } else {
            resolve(country);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete a country by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-06
   *
   * @param {string} countryId the country id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public delete(countryId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const country = await Country.findById(countryId);

          if (country) {
            const deleteCountry = await country.deleteOne();

            resolve(deleteCountry);
          } else {
            resolve(country);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}

const countryService = new CountryService();
export default countryService;
