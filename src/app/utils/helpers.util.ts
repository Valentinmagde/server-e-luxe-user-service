import mongoose from "mongoose";
import handlebars from "handlebars";
import fs from "fs";
import * as path from "path";

/**
 * Check ObjectId validity
 *
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-04-10
 *
 * @param {string} id the object id
 * @returns {RegExpMatchArray | nul} true | false
 */
export function checkObjectId(id: string): RegExpMatchArray | null {
  return id.match(/^[0-9a-fA-F]{24}$/);
}

/**
 * Remove first and last slash.
 * That method removes the first and last slash from a string.
 * For example, if the input string is "/foo/bar/", the output string will be "foo/bar".
 *
 * @author Valentin magde <valentinmagde@gmail.com>
 * @since 2023-04-10
 *
 * @param {string} path - The path.
 * @returns {string} - The path without first and last slash
 */
export function removeFirstLastSlash(path: string): string {
  return path.replace(/^\/|\/$/g, "");
}

/**
 * This function generates a new MongoDB ObjectId.
 *
 * @author Valentin magde <valentinmagde@gmail.com>
 * @since 2024-04-07
 *
 * @return {string} The ObjectId string.
 */
export function createMongooseId(): string {
  return new mongoose.Types.ObjectId().toString();
}

/**
 * Loads and compiles an email template with dynamic replacements.
 *
 * @param {string} templateName - The name of the template file (relative to the current directory).
 * @param {EmailReplacements} replacements - An object containing key-value pairs for replacing
 * placeholders in the template.
 * @returns {string} - The compiled HTML content with placeholders replaced by the provided values.
 */
export function loadTemplate(templateName: string, replacements: any): string {
  const templatePath = path.resolve(
    __dirname,
    "../../resources/templates",
    templateName
  );
  const templateContent = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateContent);
  return template(replacements);
}

/**
 * Extracts the browser information from the User-Agent string in the request headers.
 *
 * @param {any} req - The HTTP request object containing headers with a User-Agent string.
 * @returns {string} A string representing the browser name
 * (e.g., "Chrome", "Firefox", "Safari", "Edge", "Internet Explorer")
 *  or "Unknown Browser" if the browser cannot be identified.
 */
export function getBrowserFromRequest(req: any): string {
  const userAgent = req.headers["user-agent"];
  let browser;

  if (/chrome|crios/i.test(userAgent)) {
    browser = "Chrome";
  } else if (/firefox|fxios/i.test(userAgent)) {
    browser = "Firefox";
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    browser = "Safari";
  } else if (/msie|trident/i.test(userAgent)) {
    browser = "Internet Explorer";
  } else if (/edge|edg/i.test(userAgent)) {
    browser = "Edge";
  } else {
    browser = "Unknown Browser";
  }

  return browser;
}

/**
 * Extracts the operating system information from the User-Agent string in the request headers.
 *
 * @param {any} req - The HTTP request object containing headers with a User-Agent string.
 * @returns {string} A string representing the operating system information (e.g., "Windows NT 10.0; Win64; x64",
 * "Macintosh; Intel Mac OS X 10_15_7") or "Unknown OS" if the operating system cannot be identified.
 */
export function getOsFromRequest(req: any): string {
  const userAgent = req.headers["user-agent"];
  const osMatch = userAgent.match(/\(([^)]+)\)/);
  const os = osMatch ? osMatch[1] : "Unknown OS";
  return os;
}
