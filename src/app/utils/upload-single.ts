import * as path from "path";
import { urlJoin } from 'url-join-ts';
import fs from "fs";
import config from "../../config";

const baseUploadPath = path.resolve(__dirname, "../..", "resources/uploads/images");
const host = config.apiGatewayUrl as string;
/**
 * The provided code defines a function called uploadFile that uploads a file to a specified path.
 *
 * @author Valentin magde <valentinmagde@gmail.com>
 * @since 2024-04-07
 *
 * @param {string} pathName - The name of the path to which the file will be uploaded.
 * @param {Express.Multer.File} file - The file to be uploaded.
 *
 * @return {Promise<any>} The promise with the file path when the file has been written to the stream.
 */
export default async function uploadFile(
  pathName: string,
  file: Express.Multer.File
): Promise<any> {
  return new Promise((resolve, reject): any => {
    (async () => {
      // Check if the file is a valid image file
      // Check if the file is a valid image file by mimetype
      await fileFilter(file).catch((err) => reject(err));

      // Get the path name
      const targetPath = path.join(baseUploadPath, pathName);
      const fileName = `${file.originalname.split(".")[0]} ${Date.now()} ${path.extname(file.originalname)}`;
      const filePath = `${targetPath}/${fileName}`;

      // Check if the directory exists
      if (!fs.existsSync(targetPath)) {
        // If it doesn't exist, create the directory
        try {
          fs.mkdirSync(targetPath, {recursive: true});
        }
        catch(err){
          reject(err)
        }
      }

      // Create a file write stream
      const fileWriteStream = fs.createWriteStream(filePath);

      // Write the file to the stream
      fileWriteStream.write(file.buffer, (err: any) => {
        if (err) {
          reject(err);
        }
      });

      // Close the file write stream when the file is finished writing
      fileWriteStream.on("finish", () => {
        resolve(urlJoin(host, config.imageBaseUrl, pathName, fileName));
      });

      // Close the file write stream
      fileWriteStream.end();
    })();
  })
}

/**
 * This function is used to validate the file that is being uploaded.
 *
 * @author Valentin magde <valentinmagde@gmail.com>
 * @since 2024-04-07
 *
 * @param {Express.Multer.File} file - Which is an object representing the file that is being uploaded.
 * @return {Promise<string>} - The array of error messages.
*/
const fileFilter = async (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject): void => {
    // Initialize the error messages array
    let errorMessages = "";

    // Check if the file is a valid image file
    const extension: boolean = [".png", ".jpg", ".jpeg"].indexOf(path.extname(file.originalname).toLowerCase()) >= 0;

    // Check if the file is a valid image file by mimetype
    const mimeType: boolean = ["image/png", "image/jpg", "image/jpeg"].indexOf(file.mimetype) >= 0;

    if (!extension) {
      errorMessages +=
        `Invalid file extension ${path.extname(file.originalname)} . Only .png, .jpg, and .jpeg files are allowed.`;
    }
    if (!mimeType) {
      errorMessages +=
        `Invalid file type ${file.mimetype} . Only image/png, image/jpg, and image/jpeg files are allowed.`;
    }

    if (errorMessages) {
      reject(errorMessages);
    } else {
      resolve(errorMessages);
    }
  });
};
